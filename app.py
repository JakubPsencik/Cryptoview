from flask import Flask, render_template, jsonify, request, redirect, send_from_directory
import websocket as ws
import config
from binance.client import Client
import numpy as np
import asyncio
import aiomysql
import requests
from datetime import datetime, timedelta
import math
import csv
import os;

app = Flask(__name__)

client = Client(config.API_KEY, config.API_SECRET)


@app.route("/", methods=['GET']) #rika flasku, kdy se ma zavolat index() funkce (po zadani ktere url)
def index():
	title = "CRYPTOVIEW"

	return render_template("index.html", title=title)

# display data button clicked
@app.route("/update", methods=['GET'])
def update():
	# extract params from url
	candlesticks = client.get_historical_klines(
		request.args.get("pair_symbol_option_name"),
		request.args.get("interval_option_name"),
		request.args.get("data_amount_option_name"))

	processed_candlesticks = []
	for data in candlesticks:
		candlestick = {
			"time": data[0] / 1000,
			"open": data[1],
			"high": data[2],
			"low": data[3],
			"close": data[4],
		}

		processed_candlesticks.append(candlestick)

	return jsonify(processed_candlesticks)

@app.route("/as", methods=['GET'])
async def show():
	loop = asyncio.get_event_loop()

	conn = await aiomysql.connect(host=config.HOST, port=config.PORT,user=config.USER, password=config.PASSWORD, db=config.DB, loop=loop)

	cur = await conn.cursor()
	await cur.execute("""select pairname, base_currency, quote_currency, course, course_in_eur, compound_interest_total_in_eur, fixed_deposit_total_in_eur, all_no_trades
						from view_pair_for_trade_all
						order by fixed_deposit_total_in_eur desc
						limit 5;""")
	#print(cur.description)
	data = await cur.fetchall()
	await cur.close()
	conn.close()

	return jsonify(data)

@app.route("/logos", methods=['GET'])
async def parse():
	
	urls = open("urls.txt", "r")
	data = urls.read()
	lst = data.split("\n")
	urls.close()

	return lst

@app.route("/lastPrices", methods=['GET'])
async def getLastPrices():
	loop = asyncio.get_event_loop()

	conn = await aiomysql.connect(host=config.HOST, port=config.PORT,user=config.USER, password=config.PASSWORD, db=config.DB, loop=loop)

	cur = await conn.cursor()
	await cur.execute("""select pairname 
							from peak_valley_stats_all
							where pairname not like '%000%'
							group by pairname
							order by SUM(fixed_deposit_total_in_eur) desc
							limit 20;""")
	
	data = await cur.fetchall()
	data = ["\"{}\"".format(row[0]) for row in data]

	
	#print(data)
	#print("##")
	await cur.execute("""select pairname,type,date_begin,date_end, compound_interest_total_in_eur, fixed_deposit_total_in_eur
							from peak_valley_stats_all
							where pairname in ({})
							and type in ('last_day_01', 'previous_day_01', 'previous_day_02', 'previous_day_03')
							and (date_begin is not null and fixed_deposit_total_in_eur is not null)""".format(",".join(data)))
	
	data1 = await cur.fetchall()
	#print(data1)
	await cur.close()
	conn.close()
	#print(data)
	#print(data1)
	data = list(map(lambda x: x.replace('"', ''), data))
	processed_data = []
	processed_data.append(data)
	for d in data1:
		pair = {
			"pairname": d[0],
			"type": d[1],
			"date_begin": d[2].strftime('%Y-%m-%d'),
			"date_end": d[3].strftime('%Y-%m-%d'),
			"compound_interest_total_in_eur": d[4],
			"fixed_deposit_total_in_eur": d[5],
		}
	
		processed_data.append(pair)

	#print(processed_data)

	return jsonify(processed_data)

@app.route("/view", methods=['GET'])
async def getViewData():

	processed_data = []

	loop = asyncio.get_event_loop()

	conn = await aiomysql.connect(host=config.HOST, port=config.PORT,user=config.USER, password=config.PASSWORD, db=config.DB, loop=loop)

	cur = await conn.cursor()

	##select from view_pair_for_trade_day##
	await cur.execute("""select v.pairname, v.base_currency, v.quote_currency, v.date_begin, v.date_end, v.compound_interest_total_in_eur, v.fixed_deposit_total_in_eur
							from view_pair_for_trade_day v
							order by fixed_deposit_total_in_eur desc
							limit 20;""")
	
	daily = await cur.fetchall()
	daily_pair_names = ["\"{}\"".format(row[0]) for row in daily]
	
	##--------------------------------------------------------------------------

	##select from view_pair_for_trade_week##
	await cur.execute("""select v.pairname, v.base_currency, v.quote_currency, v.date_begin, v.date_end, v.compound_interest_total_in_eur, v.fixed_deposit_total_in_eur
							from view_pair_for_trade_week v
							order by fixed_deposit_total_in_eur desc
							limit 20;""")
	
	weekly = await cur.fetchall()
	weekly_pair_names = ["\"{}\"".format(row[0]) for row in weekly]
	
	##--------------------------------------------------------------------------

	##select from view_pair_for_trade_month
	await cur.execute("""select v.pairname, v.base_currency, v.quote_currency, v.date_begin, v.date_end, v.compound_interest_total_in_eur, v.fixed_deposit_total_in_eur
						from view_pair_for_trade_month v
						order by fixed_deposit_total_in_eur desc
						limit 20;""")
	
	monthly = await cur.fetchall()
	monthly_pair_names = ["\"{}\"".format(row[0]) for row in monthly]
	##--------------------------------------------------------------------------

	await cur.close()
	conn.close()

	processed_data.append("daily")
	processed_data.append(daily_pair_names)
	for d in daily:
		pair = {
			"pairname": d[0],
			"base": d[1],
			"quote": d[2],
			"date_begin": d[3].strftime('%Y-%m-%d'),
			"date_end": d[4].strftime('%Y-%m-%d'),
			"compound_interest_total_in_eur": d[5],
			"fixed_deposit_total_in_eur": d[6],
		}
	
		processed_data.append(pair)

	processed_data.append("weekly")
	processed_data.append(weekly_pair_names)
	for d in weekly:
		pair = {
			"pairname": d[0],
			"base": d[1],
			"quote": d[2],
			"date_begin": d[3].strftime('%Y-%m-%d'),
			"date_end": d[4].strftime('%Y-%m-%d'),
			"compound_interest_total_in_eur": d[5],
			"fixed_deposit_total_in_eur": d[6],
		}
	
		processed_data.append(pair)

	processed_data.append("monthly")
	processed_data.append(monthly_pair_names)	
	for d in monthly:
		pair = {
			"pairname": d[0],
			"base": d[1],
			"quote": d[2],
			"date_begin": d[3].strftime('%Y-%m-%d'),
			"date_end": d[4].strftime('%Y-%m-%d'),
			"compound_interest_total_in_eur": d[5],
			"fixed_deposit_total_in_eur": d[6],
		}

		processed_data.append(pair)

	return jsonify(processed_data)

@app.route("/savings", methods=['GET'])
async def getSavingsStakingData():
	loop = asyncio.get_event_loop()

	conn = await aiomysql.connect(host=config.HOST, port=config.PORT,user=config.USER, password=config.PASSWORD, db=config.DB, loop=loop)

	cur = await conn.cursor()
	await cur.execute("""select s.*, ssa.interval_day from (SELECT asset, MAX(profit_total_eur) AS highest_profit_price
							FROM savings_staking_all
							GROUP BY asset
							ORDER BY highest_profit_price DESC
							limit 20) as s
							join savings_staking_all ssa on s.asset = ssa.asset and s.highest_profit_price = ssa.profit_total_eur
							order by highest_profit_price desc;""")
	
	data = await cur.fetchall()
	await cur.close()
	conn.close()

	processed_data = []

	for d in data:
		pair = {
			"asset": d[0],
			"profit": round(d[1], 2),
			"interval": d[2]
		}
	
		processed_data.append(pair)

	return jsonify(processed_data)

@app.route('/<path:filename>')
def send_file(filename):
	return send_from_directory('/static/img', filename)

def convert_datetime_to_unix_timestamp(datetime_string):
	"""Converts a datetime string to a Unix timestamp."""
	#print(datetime_string)
	datetime_object = datetime.strptime(datetime_string, '%Y-%m-%dT%H:%M')
	unix_timestamp = datetime_object.timestamp()
	result = str(unix_timestamp)[0:(len(str(unix_timestamp))-2)]
	result += "000"
	return result

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
	elif response.status_code == 400 or response.status_code == 500:
		return -1
	else:
		print(f"Failed to retrieve data. Status code: {response.status_code}")
		return None

def get_binance_rebalanace_kline_data(symbol, interval, start_date, end_date):
	base_url = "https://api.binance.com/api/v3/klines"

	#print("get_binance_kline_data: " + symbol + '\n')
	# Construct the URL
	url = f"{base_url}?symbol={symbol}&interval={interval}&startTime={start_date}&endTime={end_date}&limit={1000}"

	# Make the API request
	response = requests.get(url)
	
	if response.status_code == 200:
		return response.json()
	else:
		print(f"Failed to retrieve data. Status code: {response.status_code}")
		return None

def Rebalance(AmountOfBaseCurrency1, AmountOfBaseCurrency2, newPair1Price, newPair2Price, time1, time2, alloc1,alloc2, rebalanceRatio, rebalancingResults):
	
	newPair1QuoteAmount = AmountOfBaseCurrency1 * newPair1Price
	newPair2QuoteAmount = AmountOfBaseCurrency2 * newPair2Price

	QuoteTotal = newPair1QuoteAmount + newPair2QuoteAmount
	#print(alloc1)
	#print(alloc2)
	pair1Ratio = abs(alloc1 - (newPair1QuoteAmount / QuoteTotal))
	pair2Ratio = abs(alloc2 - (newPair2QuoteAmount / QuoteTotal))
	
	# if (50% - calculated-ration) je kladne tak dokupuju -> tzn +
	# if (50% - calculated-ration) je zaporne tak prodavam -> tzn -
	
	if((pair1Ratio > rebalanceRatio) or (pair2Ratio > rebalanceRatio)):
		#print("rebalance triggered")
		#print(f"newPair1QuoteAmount / QuoteTotal: {newPair1QuoteAmount / QuoteTotal}, newPair2QuoteAmount / QuoteTotal: {newPair2QuoteAmount / QuoteTotal}\n")
		#print(f"ratio1: {0.5 - (newPair1QuoteAmount / QuoteTotal)}, ratio2: {0.5 - (newPair2QuoteAmount / QuoteTotal)}\n")
		ratio1 = 0.5 - (newPair1QuoteAmount / QuoteTotal)
		ratio2 = 0.5 - (newPair2QuoteAmount / QuoteTotal)


		TriggerRebalance(ratio1, ratio2, newPair1QuoteAmount, newPair2QuoteAmount, QuoteTotal, time1, time2, rebalancingResults)
	else:
		rebalancingResults.append([time1, time2, newPair1QuoteAmount,newPair2QuoteAmount,QuoteTotal, 0])

def TriggerRebalance(pair1Ratio, pair2Ratio, newPair1QuoteAmount, newPair2QuoteAmount, QuoteTotal, time1, time2, rebalancingResults):

	#print(f"def TriggerRebalance\n-----------------------\npair1Ratio: {abs(pair1Ratio)}, pair2Ratio: {abs(pair2Ratio)}")
	pair1amt = 0
	pair2amt = 0

	if(pair1Ratio > 0):
		#buy
		pair1amt = newPair1QuoteAmount + (QuoteTotal * abs(pair1Ratio))
	else:
		pair1amt = newPair1QuoteAmount - (QuoteTotal * abs(pair1Ratio))

	if(pair2Ratio > 0):
	#buy
		pair2amt = newPair2QuoteAmount + (QuoteTotal * abs(pair2Ratio))
	else:
		pair2amt = newPair2QuoteAmount - (QuoteTotal * abs(pair2Ratio))
	

	#print(f"pair1 amount: ' {pair1amt}\n")
	#print(f"pair2 amount: ' {pair2amt}\n")

	#print(f"total: ' {QuoteTotal}\n")

	#append record when rebalance triggered
	rebalancingResults.append([time1, time2, pair1amt,pair2amt,QuoteTotal, 1])

	return

def SimulateRebalancing(pair1Data,   pair2Data, pair1QuoteAssest, pair2QuoteAssest, ratio1, ratio2, rebalanceRatio):
	
	#global values
	rebalancingResults = []

	for i in range(1, len(pair1Data)):

		#print(f"Cycle Number: {i}\n")

		#print(f"newMultiplier1: ' {pair1Data[i][4]}\n")
		#print(f"newMultiplier2: ' {pair2Data[i][4]}\n")

		#toto je ke 2. a vyssi iteraci
		amtOfBase1 = (pair1QuoteAssest) / float(pair1Data[0][4])
		amtOfBase2 = (pair2QuoteAssest) / float(pair2Data[0][4])

		Rebalance(amtOfBase1,amtOfBase2,float(pair1Data[i][4]), float(pair2Data[i][4]), pair1Data[i][0],pair2Data[i][0], ratio1, ratio2, rebalanceRatio, rebalancingResults)

	return rebalancingResults

@app.route("/rebalance", methods=['GET'])
def getRebalancing():

	if(request.args.get("coin1") == None):
		return ""

	#inputs from the form
	settings = [
		request.args.get("coin1"),
		request.args.get("alloc1"),
		request.args.get("coin2"),
		request.args.get("alloc2"),
		request.args.get("investment"),
		request.args.get("ratio"),
		request.args.get("interval"),
		request.args.get("start"),
		request.args.get("end")
	]

	#print(settings)

	rebalancingResults = []
	symbols = [str(f"{settings[0]}USDT"), str(f"{settings[2]}USDT")]
	interval = settings[6]

	s = convert_datetime_to_unix_timestamp(settings[7])
	e = convert_datetime_to_unix_timestamp(settings[8])
	#print(f"{s}, || {e}")

	# Retrieve Kline data
	BTCUSDT_kline_data = get_binance_rebalanace_kline_data(symbols[0], interval, s, e)
	BNBUSDT_kline_data = get_binance_rebalanace_kline_data(symbols[1], interval, s, e)

	#print(BTCUSDT_kline_data)
	#print(len(BNBUSDT_kline_data))

	ratio1 = int(settings[1]) / 100
	ratio2 = int(settings[3]) / 100

	#print(f"{ratio1}, {ratio2}")

	amtOfBase1 = (ratio1 * int(settings[4])) / float(BTCUSDT_kline_data[0][4])
	amtOfBase2 = (ratio2 * int(settings[4])) / float(BNBUSDT_kline_data[0][4])

	pair1QuoteAssest = ratio1 * int(settings[4])
	pair2QuoteAssest =  ratio2 * int(settings[4])

	rebalanceRatio = float(settings[5]) / 100
	#(rebalanceRatio)
	#1. iterace
	
	Rebalance(amtOfBase1,amtOfBase2, float(BTCUSDT_kline_data[0][4]), float(BNBUSDT_kline_data[0][4]),  BTCUSDT_kline_data[0][0], BNBUSDT_kline_data[0][0], ratio1, ratio2, rebalanceRatio, rebalancingResults)

	rebalancingResults = SimulateRebalancing(BTCUSDT_kline_data,   BNBUSDT_kline_data, pair1QuoteAssest, pair2QuoteAssest,  ratio1, ratio2, rebalanceRatio)

	processed_data = []
	data0 = []
	for res in rebalancingResults:
		item = {
			"time1": res[0],
			"time2": res[1],
			"pair1amt": res[2],
			"pair2amt": res[3],
			"QuoteTotal": res[4],
			"Rebalance": res[5]
		}

		data0.append(item)

	
	data1 = []
	for i in BTCUSDT_kline_data:
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

		data1.append(item)

	
	data2 = []
	for i in BNBUSDT_kline_data:
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

		data2.append(item)

	

	processed_data.append(data1)
	processed_data.append(data2)
	processed_data.append(data0)

	#print(processed_data)
	return jsonify(processed_data)
	
def start_spotDCA(historical_data, settings, SpotDCAResults):
	#start Spot DCA by buying 1,000 USDT worth of BTC.

	'''
	#inputs from the form
	settings = [
		request.args.get("pair"),
		request.args.get("price_deviation"),
		request.args.get("take_profit"),
		request.args.get("base_order"),
		request.args.get("order_size"),
		request.args.get("number_of_orders"),
		request.args.get("interval"),
		request.args.get("start"),
		request.args.get("end")
	]
	'''

	price_deviation = float(settings[1]) / 100 #%
	take_profit =float(settings[2]) / 100 #% 
	base_order = float(settings[3]) #$
	DCA_order = float(settings[4]) #$
	max_DCA_orders = float(settings[5])
	investment = base_order + DCA_order * max_DCA_orders
	#print(investment)
	currently_invested = 0

	#---------------------------

	num_of_dca_orders = 0
	profit = 0
	base_price = float(historical_data[0][4])
	current_price = float(historical_data[0][4])

	#amount of my base currency
	amtOfBase = base_order / float(current_price)
	currently_invested = base_order
	#print(f"amtOfBase: {amtOfBase}\n")

	#entry point
	SpotDCAResults.append([historical_data[0][0], historical_data[0][4], amtOfBase, base_order, -1])

	#len(historical_data)
	for i in range(1, len(historical_data)):
		#change ratio
		new_price = float(historical_data[i][4])

		#print(f"current_price: {current_price}, new_price: {new_price}\n")
		current_price_deviation = current_price / base_price
		#print(f"deviation: {current_price_deviation}\n")
		if(current_price_deviation > 1):
			current_price_deviation = (1 - current_price_deviation)
		else:
			current_price_deviation = (1 - current_price_deviation)

		current_price = new_price
		profit = amtOfBase * current_price
		#print(f"amtOfBase: {amtOfBase}, current_price: {current_price}, current_price_deviation: {current_price_deviation}\n")
		

		#current_price_deviation kladne  | + | - cena klesla
		#current_price_deviation zaporne | - | - cena stoupla
		"""
		The bot will continue to place DCA orders until it reaches the target take-profit percentage. 
		In this example, the target take-profit percentage is 10%, so the bot will sell all of your BTC when the total value of your investments has increased by 10%.

		For example, if you invest $10,000 in the bot, the bot will sell all of your BTC when the total value of your investments reaches $11,000.
		"""

			#trigger DCA order
		if(current_price_deviation > 0 and (abs(current_price_deviation) > price_deviation) and (num_of_dca_orders < max_DCA_orders)):
			#print(f"deviation: {current_price_deviation}\n")
			#1 - cervena - nakup
			newBoughtAmount = DCA_order / current_price
			amtOfBase = amtOfBase + newBoughtAmount
			num_of_dca_orders = num_of_dca_orders + 1
			currently_invested = currently_invested + DCA_order
			profit = amtOfBase * current_price
			#append DCA point
			SpotDCAResults.append([historical_data[i][0], historical_data[i][4], amtOfBase, profit, 1])
			#print(f"DCA triggered: new amtOfBase = {amtOfBase}\n")
			#print(f"amtOfBase: {amtOfBase}, current_price: {current_price}, current_price_deviation: {current_price_deviation}\n")
			#print("------------------------------------")

		#check if the total quote amount already increased by 10%
		#elif(current_price_deviation > 0 and (abs(current_price_deviation) > price_deviation) and (num_of_dca_orders < max_DCA_orders)):
		if((num_of_dca_orders == max_DCA_orders)):
			
			profit = amtOfBase * current_price
			#print(f"({i}.) current price: {current_price}, current profit: {profit}\n")
			#print(f"profit >= (take_profit * investment + investment)\n{profit} >= {take_profit * investment + investment}")
			if(profit >= ((take_profit * investment) + investment)):
				print(f"Take Profit {100 * take_profit} % reached, selling {amtOfBase} worth of assets now...\naccuired: {profit}\n")
				SpotDCAResults.append([historical_data[i][0],historical_data[i][4], amtOfBase, profit, 0])
				SpotDCAResults.append('true')
				#print(SpotDCAResults)
				return profit

		#SpotDCAResults.append([historical_data[i][0], historical_data[i][4], amtOfBase, profit, 0])

		#print("------------------------------------")
	#The bot will continue to run until it reaches the target take-profit percentage (10%).
	#print(f"Take Profit {100 * take_profit} % was not reached, assets accuired: {profit}\n")
	SpotDCAResults.append('false')
	#print(SpotDCAResults)
	return SpotDCAResults

@app.route("/spotDCA", methods=['GET'])
def getSpotDCA():
	#inputs from the form
	settings = [
		request.args.get("pair"),
		request.args.get("price_deviation"),
		request.args.get("take_profit"),
		request.args.get("base_order"),
		request.args.get("order_size"),
		request.args.get("number_of_orders"),
		request.args.get("interval"),
		request.args.get("start"),
		request.args.get("end")
	]

	#print(settings)

	SpotDCAResults = []

	# Set parameters
	symbol = settings[0]
	interval = settings[6]

	s = convert_datetime_to_unix_timestamp(settings[7])
	e = convert_datetime_to_unix_timestamp(settings[8])
	#print(f"{s}, || {e}")

	# Retrieve Kline data
	historical_data = get_binance_rebalanace_kline_data(symbol, interval, s, e)
	#print(f" dca : {len(historical_data)}")
	#1. iterace
	#print(historical_data)
	start_spotDCA(historical_data, settings, SpotDCAResults)
	#print(SpotDCAResults)
	#print(f"count: {len(SpotDCAResults)}\n")
	#print(f"results: {SpotDCAResults}\n")

	processed_data = []

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

	for res in SpotDCAResults:
		
		try:
			item = {
				"time": res[0],
				"close": res[1],
				"amtOfBase": res[2],
				"profit": res[3],
				"DCA": res[4]
			}

		except:
			item = {
				"time": res,
				"close": res,
				"amtOfBase": res,
				"profit": res,
				"DCA": res
			}

		processed_data.append(item)

	return jsonify(processed_data)


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

def start_spotGrid(historical_data, settings, SpotGridResults):

	'''	
	settings = [
		request.args.get("pair"),
		request.args.get("lower"),
		request.args.get("upper"),
		request.args.get("grids"),
		request.args.get("grid_investment"),
		request.args.get("interval"),
		request.args.get("start"),
		request.args.get("end")
	]
	'''

	amtOfBase = 0
	amtOfQuote = 0
	price_difference = 0

	upper_price = max([item[4] for item in historical_data]) 
	lower_price = min([item[4] for item in historical_data])
	#upper_price = int(settings[2])
	#lower_price = int(settings[1])

	#print(historical_data)
	#enlarge the boundaries
	upper_price = float(upper_price)
	lower_price = float(lower_price)

	#minimum investment in quote currency (ex. USDT):
	min_investment = (upper_price - lower_price) / 2

	number_of_grids = int(settings[3])
	# 0 - arithmetic
	# 1 - geometric
	mode = 0
	amount_invested = int(settings[4])

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
	
	#print(grid_price_values)

	current_price = float(historical_data[1][4])

	close_to_grid_price_difference = []
	triggered_grid_price = 0

	SpotGridResults.append([upper_price, lower_price, price_difference, number_of_grids, -1])

	previous_lvl = -1

	for i in range(2, len(historical_data)):
		amtOfQuote = 0
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
		current_lvl = lvl[0]
		idx = int(lvl[0] - 1)
		CURRENT_TRIGGERED_GRID_PRICE = grid_price_values[idx][1]

		#print(f"triggered level: {current_lvl} , price: {CURRENT_TRIGGERED_GRID_PRICE}")
		triggered_grid_price = current_price + min_value
		#print(triggered_grid_price)
		if(current_price < previous_price):
			#print(amount_invested)
			#print("down")
			#price goes down
			#if grid was intersected
			if(previous_price > CURRENT_TRIGGERED_GRID_PRICE and current_price <= CURRENT_TRIGGERED_GRID_PRICE and previous_lvl != current_lvl):
				
				#execute buy order
				if(amount_invested <= 0):
					#uz neni co investovat a cena jde porad dolu
					break
				
				
				#budu pocitat s tim, ze se nakoupi za tu cenu, ktera je na gridu
				#jelikoz ten buy order by tam mel byt placed
				new_buy_order = 0
				if(amount_invested < AmtOfQuoteAssetWhenGridTriggered):
					new_buy_order = amount_invested / CURRENT_TRIGGERED_GRID_PRICE
					amount_invested = amount_invested - amount_invested
				else:
					new_buy_order = AmtOfQuoteAssetWhenGridTriggered / CURRENT_TRIGGERED_GRID_PRICE
					amount_invested = amount_invested - AmtOfQuoteAssetWhenGridTriggered
				#tady sme nakoupili bitcoooooin
				amtOfBase = amtOfBase + new_buy_order
				

				previous_lvl = current_lvl
				
				SpotGridResults.append([historical_data[i][0],historical_data[i][4],amtOfBase, amtOfQuote, 0])
				#print(f"execute buy order -> time: {datetime.utcfromtimestamp(historical_data[i][0] / 1000).strftime('%Y-%m-%d %H:%M:%S')}, prev-level: {previous_lvl}, curr-level: {current_lvl}, amtinvested: {amount_invested}, base: {amtOfBase}, quote: {amtOfQuote}, close: {current_price}") 

		elif(current_price > previous_price):
			#price goes up
			#print("up")
			#print(f"{previous_price} < {CURRENT_TRIGGERED_GRID_PRICE} and {current_price} > {CURRENT_TRIGGERED_GRID_PRICE}")
			if(previous_price < CURRENT_TRIGGERED_GRID_PRICE and current_price >= CURRENT_TRIGGERED_GRID_PRICE and previous_lvl != current_lvl):
				#print(f"amt_inv: {amount_invested}")
				if(amount_invested == 0):
					break

				
	
				#execute sell order
				#tady budu prodavat nejake procento Bitcoinu (treba 50%)
				percentage_to_sell = 0.50
				
				new_sell_order =  (percentage_to_sell * amtOfBase) * CURRENT_TRIGGERED_GRID_PRICE

				#nezapomenout odecist prodany bitcoin od celkovych assets
				amtOfBase = amtOfBase - (amtOfBase * percentage_to_sell)

				#tady se nam navysili zisky s prodaneho bitcoinu
				amtOfQuote = amtOfQuote + new_sell_order
				#amount_invested = amount_invested - AmtOfQuoteAssetWhenGridTriggered
				amount_invested = amount_invested + amtOfQuote
				previous_lvl = current_lvl

				SpotGridResults.append([historical_data[i][0],historical_data[i][4],amtOfBase, amtOfQuote, 1])
				#print(f"execute sell order -> time: {datetime.utcfromtimestamp(historical_data[i][0] / 1000).strftime('%Y-%m-%d %H:%M:%S')}, prev-level: {previous_lvl}, curr-level: {current_lvl}, amtinvested: {amount_invested}, base: {amtOfBase}, quote: {amtOfQuote}, close: {current_price}") 

	#SpotGridResults.append(TEMP_TEST_DATA)

	closeAtLastOrder = float(SpotGridResults[(len(SpotGridResults)-1)][1])
	if(amount_invested > 0):
		#dokup za zbytek co mas
		amtOfBase = amtOfBase + (float(amount_invested) / closeAtLastOrder)
	
	profit = amtOfBase * closeAtLastOrder

	SpotGridResults.append([profit,settings[4],0,0, 2])

	#print(closeAtLastOrder)


	return SpotGridResults
	#return jsonify(processed_data)

@app.route("/spotGrid", methods=['GET'])
def getSpotGrid():

	#inputs from the form
	settings = [
		request.args.get("pair"),
		request.args.get("lower"),
		request.args.get("upper"),
		request.args.get("grids"),
		request.args.get("grid_investment"),
		request.args.get("interval"),
		request.args.get("start"),
		request.args.get("end")
	]

	#print(settings)

	SpotGridResults = []

	# Set parameters
	symbol = settings[0]
	interval = settings[5]

	s = convert_datetime_to_unix_timestamp(settings[6])
	e = convert_datetime_to_unix_timestamp(settings[7])
	#print(f"{s}, {e}")

	# Retrieve Kline data
	historical_data = get_binance_rebalanace_kline_data(symbol, interval, s, e)


	#historical_data = get_binance_kline_data(symbol, interval, start_date_str, end_date_str)

	#1. iterace
	#print(historical_data)
	start_spotGrid(historical_data, settings, SpotGridResults)
	#print(SpotGridResults)
	#print(f"count: {len(SpotGridResults)}\n")
	#print(f"results: {SpotDCAResults}\n")

	processed_data = []
	
	#TEMP_TEST_DATA.append([historical_data[i][0],historical_data[i][4],amtOfBase, amtOfQuote, 1])
	for res in SpotGridResults:
		
		#print(f"{res}'\n'")
		
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

	return jsonify(processed_data)

def calc_day_average(data):
	_sum = 0
	for c in data:
		_sum = _sum + float(c[1])

	avg = _sum / len(data)
	return avg


def start_week_predict(historical_data, weekPredictResults):
	
	
	rng =  math.floor(len(historical_data) / 24)
	
	#print(f"data-len: {len(historical_data)}, range: {rng}")
	markers = []

	start = 0
	end = 24
	for i in range(0,rng+1):
		weekPredictResults.append([i, historical_data[start][0], historical_data[start][1], calc_day_average(historical_data[start:end])])
		start = start + 24
		end = start + 24

	# Extract prices from the list of lists
	prices = []
	for row in weekPredictResults:
		price = row[2]
		prices.append(price)
	min_value = min(prices)
	max_value = max(prices)
	min_time = 0
	max_time = 0

	for row in weekPredictResults:
		if(min_value == row[2]):
			min_time = row[1]
		if(max_value == row[2]):
			max_time = row[1]

	#print(f"{min_value}, time: {min_time} | {max_value}, time: {max_time}")

	markers.append([min_time, min_value])
	markers.append([max_time, max_value])

	return markers
	#return jsonify(processed_data)

def calculate_start_end_dates(months_ago):
	today = datetime.now()
	end_date = today - timedelta(days=months_ago * 30)
	start_date = end_date - timedelta(days=30)
	return start_date.strftime("%Y-%m-%d"), end_date.strftime("%Y-%m-%d")

@app.route("/weekPredict", methods=['GET'])
def getweekPredictions():
	weekPredictResults = []
	markers = []
	# Set parameters
		# Set parameters
	symbol = request.args.get("symbol")
	interval = request.args.get("interval")

	# Retrieve Kline data
	historical_data = get_binance_rebalanace_kline_data(symbol,
											interval, 
											convert_datetime_to_unix_timestamp("2023-10-28T00:00"), 
											convert_datetime_to_unix_timestamp("2023-11-29T00:00"))
	
	complete_historical_data = []
	for c in historical_data:
		complete_historical_data.append([c[0], c[4]])
	
	candles = []
	for c in historical_data:
		candles.append([c[0], c[1], c[2], c[3], c[4]])

	#print(f"{complete_historical_data} \n {len(complete_historical_data)}")

	markers = start_week_predict(complete_historical_data, weekPredictResults)
	

	processed_data = []
	
	
	for res in markers:
		
		item = {
			"time": res[0],
			"close": res[1]
		}

		processed_data.append(item)

	#processed_data.append(weekPredictResults)

	data = []
	for i in candles:
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

	return jsonify(processed_data)

@app.route("/getData", methods=['GET'])
def getData():
	weekPredictResults = []
	# Set parameters
	symbol = request.args.get("symbol")
	interval = "1d"
	data = []

	for i in range(3, -1, -1):
		start_date, end_date = calculate_start_end_dates(i)
		historical_data = get_binance_kline_data( symbol,interval, start_date, end_date)
		
		if(historical_data == -1):
			return -1
		
		for i in historical_data:
			item = {
				"time": i[0] / 1000,
				"value": i[4]
			}
			data.append(item)

	markers = start_week_predict(historical_data, weekPredictResults)
	for res in markers:	
		item = {
			"time": res[0],
			"close": res[1]
		}

		data.append(item)

	return jsonify(data)

@app.route("/binanceIndex", methods=['GET'])
async def get_binance_index_data():
	loop = asyncio.get_event_loop()

	conn = await aiomysql.connect(host=config.HOST, port=config.PORT,user=config.USER, password=config.PASSWORD, db=config.DB, loop=loop)

	cur = await conn.cursor()
	await cur.execute("""select label, name from binance_index;""")

	data = await cur.fetchall()
	await cur.close()
	conn.close()

	result = []

	for record in data:
		item = {
			"label": record[0],
			"name": record[1]
		}

		result.append(item)

	return jsonify(result)

@app.route("/binanceIndexAsset", methods=['GET'])
async def get_binance_index_asset_data():
	loop = asyncio.get_event_loop()

	conn = await aiomysql.connect(host=config.HOST, port=config.PORT,user=config.USER, password=config.PASSWORD, db=config.DB, loop=loop)

	#retrieve data from binance_index table
	binanceIndexCursor = await conn.cursor()
	await binanceIndexCursor.execute("""select label, name from binance_index;""")
	binanceIndexData = await binanceIndexCursor.fetchall()
	await binanceIndexCursor.close()

	#retrieve data from binance_index_asset table
	binanceIndexAssetCursor = await conn.cursor()
	await binanceIndexAssetCursor.execute("""select index_label, asset_label, allocation from binance_index_asset;""")
	binanceIndexAssetData = await binanceIndexAssetCursor.fetchall()
	await binanceIndexAssetCursor.close()

	conn.close()

	grouped_data = {}

	for record in binanceIndexAssetData:
		index_label = record[0]

		if index_label not in grouped_data:
			grouped_data[index_label] = {
				"indexLabel": index_label,
				"name": binanceIndexData[(findNameIdx(index_label, binanceIndexData, binanceIndexAssetData))][1],
				"coins": []
			}

		grouped_data[index_label]["coins"].append({
			"coin": record[1],
			"allocation": record[2]
		})

	# Convert the dictionary to a list
	result = list(grouped_data.values())

	return jsonify(result)

def findNameIdx(label, binanceIndexData, binanceIndexAssetData):
		for i in range(0, len(binanceIndexAssetData)):
			for idx, idx_data in enumerate(binanceIndexData):
				if idx_data[0] == label:
					return idx

@app.route("/binanceIndexAssetCoins", methods=['GET'])
async def get_binance_index_asset__coins():

	loop = asyncio.get_event_loop()

	conn = await aiomysql.connect(host=config.HOST, port=config.PORT,user=config.USER, password=config.PASSWORD, db=config.DB, loop=loop)

	crs = await conn.cursor()
	await crs.execute("""select distinct asset_label from binance_index_asset;""")
	
	data = await crs.fetchall()
	await crs.close()

	result = []

	for record in data:
		item = {"coin": record[0]}
		result.append(item)

	# Save coins into a .js file
	with open(os.path.join(os.path.dirname(__file__), "coins.js"), "w") as file:
		file.write("const coins = [")
		for i, record in enumerate(data):
			file.write(f'"{record[0]}"')
			if i != len(data) - 1:
				file.write(", ")
		file.write("]")

	return jsonify(result)

@app.route("/binanceIndexRecommend", methods=['GET'])
async def get_binance_index_recom_all_data():

	#inputs from the form
	params = [
		request.args.get("indexName"),
		request.args.get("minute"),
	]

	loop = asyncio.get_event_loop()

	conn = await aiomysql.connect(host=config.HOST, port=config.PORT,user=config.USER, password=config.PASSWORD, db=config.DB, loop=loop)

	#retrieve data from binance_index table
	binance_index_recom_allCursor = await conn.cursor()
	await binance_index_recom_allCursor.execute("""SELECT label, minute, dim_year, amount_invested, amount_profit, profit, asset_allocation
													FROM binance.binance_index_recom_all
													where label = {0} and minute = {1} ORDER BY profit DESC;""".format(params[0], params[1]))
	
	binance_index_recom_allData = await binance_index_recom_allCursor.fetchall()
	await binance_index_recom_allCursor.close()

	result = []

	for record in binance_index_recom_allData:
		item = {
			"label": record[0],
			"minute": record[1],
			"year": record[2],
			"invested": record[3],
			"profitEur": record[4],
			"profit": record[5],
			"assets": record[6],
		}

		result.append(item)

	return jsonify(result)


@app.route("/binanceIndexAssetRecommendMinute", methods=['GET'])
async def get_binance_index_asset_recom_minute_data():
	#inputs from the form
	param = request.args.get("queryParam")
	loop = asyncio.get_event_loop()

	conn = await aiomysql.connect(host=config.HOST, port=config.PORT,user=config.USER, password=config.PASSWORD, db=config.DB, loop=loop)

	#retrieve data from binance_index table
	binance_index_asset_recom_minuteCursor = await conn.cursor()
	query = """SELECT asset_label, dim_year, amount, num_of_trades, close_eur, amount_eur, profit FROM
															binance.binance_index_asset_recom_minute where asset_label = {0} ORDER BY profit DESC;""".format(param)
	await binance_index_asset_recom_minuteCursor.execute(query)
	
	binance_index_asset_recom_minuteData = await binance_index_asset_recom_minuteCursor.fetchall()
	await binance_index_asset_recom_minuteCursor.close()

	result = []

	for record in binance_index_asset_recom_minuteData:
		item = {
			"asset_label": record[0],
			"year": record[1],
			"amount": record[2],
			"num_of_trades": record[3],
			"close_eur": record[4],
			"amount_eur": record[5],
			"profit": record[6],
		}

		result.append(item)

	return jsonify(result)

@app.route("/binanceIndexAssetRecommendHour", methods=['GET'])
async def get_binance_index_asset_recom_hour_data():
	#inputs from the form
	param = request.args.get("queryParam")
	loop = asyncio.get_event_loop()

	conn = await aiomysql.connect(host=config.HOST, port=config.PORT,user=config.USER, password=config.PASSWORD, db=config.DB, loop=loop)

	#retrieve data from binance_index table
	binance_index_asset_recom_minuteCursor = await conn.cursor()
	query = """SELECT asset_label, dim_year, amount, num_of_trades, close_eur, amount_eur, profit FROM
															binance.binance_index_asset_recom_hour where asset_label = {0} ORDER BY profit DESC;""".format(param)
	await binance_index_asset_recom_minuteCursor.execute(query)
	
	binance_index_asset_recom_minuteData = await binance_index_asset_recom_minuteCursor.fetchall()
	await binance_index_asset_recom_minuteCursor.close()

	result = []

	for record in binance_index_asset_recom_minuteData:
		item = {
			"asset_label": record[0],
			"year": record[1],
			"amount": record[2],
			"num_of_trades": record[3],
			"close_eur": record[4],
			"amount_eur": record[5],
			"profit": record[6],
		}

		result.append(item)

	return jsonify(result)

@app.route("/binanceIndexAssetRecommendWeek", methods=['GET'])
async def get_binance_index_asset_recom_week_data():
	#inputs from the form
	param = request.args.get("queryParam")
	loop = asyncio.get_event_loop()

	conn = await aiomysql.connect(host=config.HOST, port=config.PORT,user=config.USER, password=config.PASSWORD, db=config.DB, loop=loop)

	#retrieve data from binance_index table
	binance_index_asset_recom_minuteCursor = await conn.cursor()
	query = """SELECT asset_label, dim_year, amount, num_of_trades, close_eur, amount_eur, profit FROM
															binance.binance_index_asset_recom_week where asset_label = {0} ORDER BY profit DESC;""".format(param)
	await binance_index_asset_recom_minuteCursor.execute(query)
	
	binance_index_asset_recom_minuteData = await binance_index_asset_recom_minuteCursor.fetchall()
	await binance_index_asset_recom_minuteCursor.close()

	result = []

	for record in binance_index_asset_recom_minuteData:
		item = {
			"asset_label": record[0],
			"year": record[1],
			"amount": record[2],
			"num_of_trades": record[3],
			"close_eur": record[4],
			"amount_eur": record[5],
			"profit": record[6],
		}

		result.append(item)

	return jsonify(result)

@app.route("/binanceIndexAssetRecommendMonth", methods=['GET'])
async def get_binance_index_asset_recom_month_data():
	#inputs from the form
	param = request.args.get("queryParam")
	loop = asyncio.get_event_loop()

	conn = await aiomysql.connect(host=config.HOST, port=config.PORT,user=config.USER, password=config.PASSWORD, db=config.DB, loop=loop)

	#retrieve data from binance_index table
	binance_index_asset_recom_minuteCursor = await conn.cursor()
	query = """SELECT asset_label, dim_year, amount, num_of_trades, close_eur, amount_eur, profit FROM
															binance.binance_index_asset_recom_month where asset_label = {0} ORDER BY profit DESC;""".format(param)
	await binance_index_asset_recom_minuteCursor.execute(query)
	
	binance_index_asset_recom_minuteData = await binance_index_asset_recom_minuteCursor.fetchall()
	await binance_index_asset_recom_minuteCursor.close()

	result = []

	for record in binance_index_asset_recom_minuteData:
		item = {
			"asset_label": record[0],
			"year": record[1],
			"amount": record[2],
			"num_of_trades": record[3],
			"close_eur": record[4],
			"amount_eur": record[5],
			"profit": record[6],
		}

		result.append(item)

	return jsonify(result)


@app.route("/CMC", methods=['GET'])
async def get_binance_cmc_ew_index_coins():

	loop = asyncio.get_event_loop()
	conn = await aiomysql.connect(host=config.HOST, port=config.PORT,user=config.USER, password=config.PASSWORD, db=config.DB, loop=loop)

	#retrieve data from binance_index table
	cursor = await conn.cursor()
	query = """select asset_label from binance_index_asset where index_label = 'idx_binance_cmc_top_10';"""
	await cursor.execute(query)
	
	data = await cursor.fetchall()
	await cursor.close()

	return jsonify(data)