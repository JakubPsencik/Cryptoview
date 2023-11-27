from flask import Flask, render_template, jsonify, request, redirect, send_from_directory
import websocket as ws
import config
from binance.client import Client
import numpy as np
import asyncio
import aiomysql
import requests
from datetime import datetime, timedelta

def get_binance_kline_data(symbol, interval, start_date, end_date):
    base_url = "https://api.binance.com/api/v3/klines"

    # Convert start and end dates to timestamps in milliseconds
    start_timestamp = int(datetime.timestamp(datetime.strptime(start_date, "%Y-%m-%d")) * 1000)
    end_timestamp = int(datetime.timestamp(datetime.strptime(end_date, "%Y-%m-%d")) * 1000)

    # Construct the URL
    url = f"{base_url}?symbol={symbol}&interval={interval}&startTime={start_timestamp}&endTime={end_timestamp}"

    # Make the API request
    response = requests.get(url)
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to retrieve data. Status code: {response.status_code}")
        return None

def extract_whole_item_with_minimum_price_value(list_of_lists):
  """Extracts the whole item with the minimum price value from the list of lists.

  Args:
    list_of_lists: A list of lists, where each inner list contains two values: the first value is an integer and the second value is a float.

  Returns:
    A list containing the whole item with the minimum price value.
  """

  minimum_value = min([inner_list[1] for inner_list in list_of_lists])
  index_of_minimum_value = [index for index, inner_list in enumerate(list_of_lists) if inner_list[1] == minimum_value][0]
  item_with_minimum_price_value = list_of_lists[index_of_minimum_value]
  return item_with_minimum_price_value


def start_spotGrid(historical_data, SpotGridResults):

	TEMP_TEST_DATA = []

	amtOfBase = 0
	amtOfQuote = 0
	price_difference = 0

	upper_price = max([item[4] for item in historical_data]) 
	lower_price = min([item[4] for item in historical_data])

	#print(historical_data)
	#enlarge the boundaries
	upper_price = float(upper_price)
	lower_price = float(lower_price)

	#minimum investment in quote currency (ex. USDT):
	min_investment = (upper_price - lower_price) / 2

	number_of_grids = 5
	# 0 - arithmetic
	# 1 - geometric
	mode = 0
	amount_invested = 10000

	#Price Difference (d) = (Grid Upper Limit - Grid Lower Limit) / Number of Grids
	#tohle urcite aritmeticke rozdeleni gridu
	price_difference = (upper_price - lower_price) / number_of_grids

	#trading fees (c): 0.1%.
	trading_fees = 0.1
	#The Maximum Profit/Grid = (1 - c) * d / Grid Lower Limit - 2c
	maximum_profit_per_grid = (1 - trading_fees) * price_difference / lower_price - 2 * trading_fees
	#The Minimum Profit/Grid = (Grid Upper Limit*(1 - c)) / (Grid Lower Limit - d) - 1 - c
	minimum_profit_per_grid = (upper_price * (1 - trading_fees)) / (lower_price - price_difference) - 1 - trading_fees
	#print(f"max profit: {maximum_profit_per_grid} - min profit: {minimum_profit_per_grid}")

	#za kolik quote meny budu kupovat base menu pri grid triggeru
	AmtOfQuoteAssetWhenGridTriggered = amount_invested / price_difference

	grid_price_values = []
	for i in range(0, number_of_grids+1):
		grid_price_values.append([i+1,lower_price + (i * price_difference)])
	
	print(grid_price_values)



	current_price = float(historical_data[1][4])

	close_to_grid_price_difference = []
	triggered_grid_price = 0

	SpotGridResults.append([upper_price, lower_price, price_difference, number_of_grids, -1])

	for i in range(2, len(historical_data)):
		close_to_grid_price_difference = []
		previous_price = current_price
		current_price = float(historical_data[i][4])
		#print(f"pre: {previous_price}, curr: {current_price}")
		#kontroluju rozdil close ceny s gridy
		for j in range(0, len(grid_price_values)):
			item = []
			item.append(j+1)
			item.append(abs(current_price - grid_price_values[j][1]))
			close_to_grid_price_difference.append(item)

		#print(close_to_grid_price_difference)

		#ted jsem zjistil, ktery grid to protlo
		min_value = min([inner_list[1] for inner_list in close_to_grid_price_difference])
		lvl = extract_whole_item_with_minimum_price_value(close_to_grid_price_difference)
		idx = int(lvl[0] - 1)
		CURRENT_TRIGGERED_GRID_PRICE = grid_price_values[idx][1]

		#print(f"triggered level: {lvl[0]} , price: {CURRENT_TRIGGERED_GRID_PRICE}")
		triggered_grid_price = current_price + min_value
		#print(triggered_grid_price)
		if(current_price < previous_price):
			#print("down")
			#price goes down
			#if grid was intersected
			if(previous_price > CURRENT_TRIGGERED_GRID_PRICE and current_price < CURRENT_TRIGGERED_GRID_PRICE):
				
				#execute buy order
				if(amount_invested <= 0):
					#uz neni co investovat a cena jde porad dolu
					break
				
				#print("buy\n")
				#budu pocitat s tim, ze se nakoupi za tu cenu, ktera je na gridu
				#jelikoz ten buy order by tam mel byt placed
				new_buy_order = AmtOfQuoteAssetWhenGridTriggered / CURRENT_TRIGGERED_GRID_PRICE
				#tady sme nakoupili bitcoooooin
				amtOfBase = amtOfBase + new_buy_order
				amount_invested = amount_invested - AmtOfQuoteAssetWhenGridTriggered

				SpotGridResults.append([historical_data[i][0],historical_data[i][4],amtOfBase, amtOfQuote, 0])
			
		elif(current_price > previous_price):
			#price goes up
			#print("up")
			#print(f"{previous_price} < {CURRENT_TRIGGERED_GRID_PRICE} and {current_price} > {CURRENT_TRIGGERED_GRID_PRICE}")
			if(previous_price < CURRENT_TRIGGERED_GRID_PRICE and current_price > CURRENT_TRIGGERED_GRID_PRICE):
				#print(f"amt_inv: {amount_invested}")
				if(amount_invested == 0):
					break

				#print("sell\n")
				#execute sell order
				#tady budu prodavat nejake procento Bitcoinu (treba 50%)
				percentage_to_sell = 0.50
				
				new_sell_order =  (percentage_to_sell * amtOfBase) * CURRENT_TRIGGERED_GRID_PRICE

				#nezapomenout odecist prodany bitcoin od celkovych assets
				amtOfBase = amtOfBase - (amtOfBase * percentage_to_sell)

				#tady se nam navysili zisky s prodaneho bitcoinu
				amtOfQuote = amtOfQuote + new_sell_order
				amount_invested = amount_invested - AmtOfQuoteAssetWhenGridTriggered
				SpotGridResults.append([historical_data[i][0],historical_data[i][4],amtOfBase, amtOfQuote, 1])

		#SpotDCAResults.append([historical_data[i][0], amtOfBase, profit])

	#print(f"Take Profit {100 * take_profit} % was not reached, assets accuired: {profit}\n")
	#SpotDCAResults.append(0)
	#print(TEMP_TEST_DATA)

	#first row - grid settings
	
	#SpotGridResults.append(TEMP_TEST_DATA)

	return SpotGridResults
	#return jsonify(processed_data)

#@app.route("/spotGrid", methods=['GET'])
def getSpotGrid():


	SpotGridResults = []

	# Set parameters
	symbol = "ETHUSDT"
	interval = "1m"
	end_date = datetime.now()
	start_date = end_date - timedelta(days=1)

	# Format dates as strings
	start_date_str = start_date.strftime("%Y-%m-%d")
	end_date_str = end_date.strftime("%Y-%m-%d")
	print(f"{start_date_str}, {end_date_str}")
	# Retrieve Kline data
	historical_data = get_binance_kline_data(symbol, interval, start_date_str, end_date_str)

	#1. iterace
	#print(historical_data)
	start_spotGrid(historical_data, SpotGridResults)
	#print(SpotGridResults)
	#print(f"count: {len(SpotGridResults)}\n")
	#print(f"results: {SpotDCAResults}\n")

	processed_data = []

	#TEMP_TEST_DATA.append([historical_data[i][0],historical_data[i][4],amtOfBase, amtOfQuote, 1])
	for res in SpotGridResults:
		
		print(f"{res}'\n'")
		
		item = {
			"time": res[0],
			"close": res[1],
			"base": res[2],
			"quote": res[3],
			"order": res[4]
		}

		processed_data.append(item)


	data = []
	for i in historical_data:
		try:
			item = {
				"time": i[0] / 1000,
				"open": i[1],
				"high": i[2],
				"low":  i[3],
				"close": i[4],
			}

		except:
			pass

		data.append(item)

	processed_data.append(data)
	print((processed_data))
	

getSpotGrid()