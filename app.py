from flask import Flask, render_template, jsonify, request
import config
from binance.client import Client
import asyncio
import aiomysql
import requests
from datetime import datetime, timedelta
import math
import os;

app = Flask(__name__)

client = Client(config.API_KEY, config.API_SECRET)

@app.route("/")
def index():
	title = "CRYPTOVIEW"

	return render_template("index.html", title=title)

@app.route("/autoinvest", methods=['GET'])
async def get_auto_invest_data():
	loop = asyncio.get_event_loop()

	conn = await aiomysql.connect(host=config.HOST, port=config.PORT,user=config.USER, password=config.PASSWORD, db=config.DB, loop=loop)

	cur = await conn.cursor()
	await cur.execute("""SELECT savings.*, ssa.interval_day FROM (SELECT asset, MAX(profit_total_eur) AS highest_profit_price
							FROM savings_staking_all
							GROUP BY asset
							ORDER BY highest_profit_price DESC
							LIMIT 10) AS savings
							JOIN savings_staking_all ssa ON savings.asset = ssa.asset AND savings.highest_profit_price = ssa.profit_total_eur
							ORDER BY highest_profit_price desc;""")
	
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

@app.route("/simpleearn", methods=['GET'])
async def get_simple_earn_data():

	processed_data = []

	loop = asyncio.get_event_loop()

	conn = await aiomysql.connect(host=config.HOST, port=config.PORT,user=config.USER, password=config.PASSWORD, db=config.DB, loop=loop)

	cur = await conn.cursor()

	##select from view_pair_for_trade_day##
	await cur.execute("""SELECT v.pairname, v.base_currency, v.quote_currency, v.compound_interest_total_in_eur, v.fixed_deposit_total_in_eur
							FROM view_pair_for_trade_day v
							ORDER BY fixed_deposit_total_in_eur DESC
							LIMIT 10;""")
	
	daily = await cur.fetchall()
	daily_pair_names = ["\"{}\"".format(row[0]) for row in daily]
	
	##--------------------------------------------------------------------------

	##select from view_pair_for_trade_week##
	await cur.execute("""SELECT v.pairname, v.base_currency, v.quote_currency, v.compound_interest_total_in_eur, v.fixed_deposit_total_in_eur
							FROM view_pair_for_trade_week v
							ORDER BY fixed_deposit_total_in_eur DESC
							LIMIT 10;""")
	
	weekly = await cur.fetchall()
	weekly_pair_names = ["\"{}\"".format(row[0]) for row in weekly]
	
	##--------------------------------------------------------------------------

	##select from view_pair_for_trade_month
	await cur.execute("""SELECT v.pairname, v.base_currency, v.quote_currency, v.compound_interest_total_in_eur, v.fixed_deposit_total_in_eur
						FROM view_pair_for_trade_month v
						ORDER BY fixed_deposit_total_in_eur DESC
						LIMIT 10;""")
	
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
			"compound_interest_total_in_eur": d[3],
			"fixed_deposit_total_in_eur": d[4],
		}
	
		processed_data.append(pair)

	processed_data.append("weekly")
	processed_data.append(weekly_pair_names)
	for d in weekly:
		pair = {
			"pairname": d[0],
			"base": d[1],
			"quote": d[2],
			"compound_interest_total_in_eur": d[3],
			"fixed_deposit_total_in_eur": d[4],
		}
	
		processed_data.append(pair)

	processed_data.append("monthly")
	processed_data.append(monthly_pair_names)	
	for d in monthly:
		pair = {
			"pairname": d[0],
			"base": d[1],
			"quote": d[2],
			"compound_interest_total_in_eur": d[3],
			"fixed_deposit_total_in_eur": d[4],
		}

		processed_data.append(pair)

	return jsonify(processed_data)

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
	print(url)
	# Make the API request
	response = requests.get(url)
	
	if response.status_code == 200:
		return response.json()
	else:
		print(f"Failed to retrieve data. Status code: {response.status_code}")
		return None

def Rebalance(coins_amt_of_base, new_coins_prices, timestamps, coin_allocations, rebalanceRatio, option_value, rebalancing_results):

	new_coins_quote_amount = []

	for i in range(0, len(coins_amt_of_base)):
		new_coins_quote_amount.append(coins_amt_of_base[i] * float(new_coins_prices[i]))

	quote_total = 0

	for i in range(0, len(new_coins_quote_amount)):
		quote_total += new_coins_quote_amount[i]

	coin_ratios = []

	for i in range(0, len(new_coins_quote_amount)):
		coin_ratios.append(new_coins_quote_amount[i] / quote_total)
	

	if(option_value == 0):

		for i in range(0, len(coin_ratios)):
	
			# if (50% - calculated-ratio) je kladne tak dokupuju -> tzn +
			# if (50% - calculated-ratio) je zaporne tak prodavam -> tzn -
			print(f"coin_ratios: {coin_ratios[i]}, rebalanceRatio: {rebalanceRatio}")

			if(coin_ratios[i] > float(rebalanceRatio)):
				for j in range(0, len(coin_ratios)):
					coin_ratios[j] = coin_allocations[j] - (new_coins_quote_amount[j] / quote_total)
				
				trigger_rebalance(coin_ratios, new_coins_quote_amount, quote_total, timestamps, rebalancing_results)

			else:
				rebalancing_results.append([timestamps, new_coins_quote_amount, quote_total, 0])

	elif(option_value == 1):
		#podle casu
		for i in range(0, len(coin_ratios)):
		
			# if (50% - calculated-ratio) je kladne tak dokupuju -> tzn +
			# if (50% - calculated-ratio) je zaporne tak prodavam -> tzn -
			print(f"coin_ratios: {coin_ratios[i]}, rebalanceRatio: {coin_allocations}")

			if(coin_ratios[i] > float(coin_allocations[i])):
				for j in range(0, len(coin_ratios)):
					coin_ratios[j] = coin_allocations[j] - (new_coins_quote_amount[j] / quote_total)
				
				trigger_rebalance(coin_ratios, new_coins_quote_amount, quote_total, timestamps, rebalancing_results)

			else:
				rebalancing_results.append([timestamps, new_coins_quote_amount, quote_total, 0])

def trigger_rebalance(coin_ratios, new_coins_quote_amount, quote_total, timestamps, rebalancing_results):

	pair_amounts = []

	for i in range(0, len(coin_ratios)):
		if(coin_ratios[i] > 0):
			#buy
			pair_amounts.append(new_coins_quote_amount[i] + (quote_total * abs(coin_ratios[i])))
		else:
			pair_amounts.append(new_coins_quote_amount[i] - (quote_total * abs(coin_ratios[i])))

	#append record when rebalance triggered
	rebalancing_results.append([timestamps, pair_amounts, quote_total, 1])

def simulate_rebalancing(coins_init_close_prices, coins_data, coins_quote_assests, percentage_ratios, rebalanceRatio, option_value, timestamp_ratio, initial_timestamp):

	#global values
	rebalancing_results = []
	coins_amt_of_base = []
	local_init_timestamp = initial_timestamp

	if(option_value == 0):
		for i in range(0, len(coins_data[0])):
			coins_new_prices = []
			coins_new_timestamps = []
			#toto je ke 2. a vyssi iteraci
			for j in range(0, len(coins_init_close_prices)):
				coins_amt_of_base.append((coins_quote_assests[j]) / coins_init_close_prices[j])
				coins_new_prices.append(float(coins_data[j][i][4]))
				coins_new_timestamps.append(coins_data[j][i][0])
			
			Rebalance(coins_amt_of_base, coins_new_prices,coins_new_timestamps, percentage_ratios, rebalanceRatio, option_value, rebalancing_results)
			coins_amt_of_base = []
	
	elif(option_value == 1):
		#podle casu

		for i in range(0, len(coins_data[0])):
			print(f"{coins_data[0][i][0]} == {local_init_timestamp}" )
			if(coins_data[0][i][0] == local_init_timestamp):
				local_init_timestamp  += timestamp_ratio
				#print(f"{coins_data[0][i][0]} == {local_init_timestamp}")
				print('performing rebalance...')
				coins_new_prices = []
				coins_new_timestamps = []
				#toto je ke 2. a vyssi iteraci
				for j in range(0, len(coins_init_close_prices)):
					coins_amt_of_base.append((coins_quote_assests[j]) / coins_init_close_prices[j])
					coins_new_prices.append(float(coins_data[j][i][4]))
					coins_new_timestamps.append(coins_data[j][i][0])
				
				Rebalance(coins_amt_of_base, coins_new_prices,coins_new_timestamps, percentage_ratios, rebalanceRatio, option_value, rebalancing_results)
				coins_amt_of_base = []
			else:
				continue

	return rebalancing_results

@app.route("/rebalance", methods=['GET'])
def getRebalancing():

	coins = request.args.get("coins").split(",")
	allocations = request.args.get("allocations").split(",")

	rebalancing_results = []
	
	interval = request.args.get("interval")
	
	s = convert_datetime_to_unix_timestamp(request.args.get("start"))
	e = convert_datetime_to_unix_timestamp(request.args.get("end"))
	
	coins_kline_data = []
	
	for i in range(0, len(coins)):
		coins_kline_data.append(get_binance_rebalanace_kline_data(str(f"{coins[i]}USDT"), interval, s, e))

	percentage_ratios = []

	for i in range(0, len(allocations)):
		percentage_ratios.append(float(int(allocations[i])) / 100)

	coins_amt_of_base = []

	for i in range(0, len(coins_kline_data)):
		coins_amt_of_base.append((percentage_ratios[i] * float(request.args.get("investment"))) / float(coins_kline_data[i][0][4]))

	coins_quote_assests = []

	for i in range(0, len(coins_kline_data)):
		coins_quote_assests.append(coins_amt_of_base[i] * (float(coins_kline_data[i][0][4])))

	rebalance_ratio = 0
	
	coins_init_close_prices = []

	for i in range(0, len(coins_kline_data)):
		coins_init_close_prices.append(float(coins_kline_data[i][0][4]))

	coins_init_timestamps = []

	for i in range(0, len(coins_kline_data)):
		coins_init_timestamps.append(coins_kline_data[i][0][0])

	interval_option = request.args.get("intervalOption")
	option_value = 0
	time_ratio = 0

	if "%" in interval_option:
		option_value = 0
		rebalance_ratio = float(interval_option[:-1]) / 100
	else:
		option_value = 1
		sec = convert_interval_to_miliseconds(interval_option)
		time_ratio = sec

	#1. iterace	
	Rebalance(coins_amt_of_base, coins_init_close_prices, coins_init_timestamps, percentage_ratios, rebalance_ratio, option_value, rebalancing_results)

	rebalancing_results = simulate_rebalancing(coins_init_close_prices, coins_kline_data, coins_quote_assests, percentage_ratios, rebalance_ratio, option_value, time_ratio, coins_init_timestamps[0])

	#rebalancing_results.append([timestamps, new_coins_quote_amount, quote_total, 0])

	processed_data = []
	data0 = []
	for res in rebalancing_results:
		item = {
			"timestamps": res[0],
			"coinAmounts": res[1],
			"QuoteTotal": res[2],
			"Rebalance": res[3]
		}

		data0.append(item)

	for i in range(0, len(coins_kline_data)):
		data = []
		for j in coins_kline_data[i]:
			try:
				item = {
					"time": j[0] / 1000,
					"open": j[1],
					"high": j[2],
					"low":  j[3],
					"close": j[4],
				}

			except:
				pass

			data.append(item)

		processed_data.append(data)
	
	processed_data.append(data0)

	#print(processed_data)
	return jsonify(processed_data)

def convert_interval_to_miliseconds(interval):
	mapping = {
		"30m": 30 * 60 * 1000,
		"1h": 60 * 60 * 1000,
		"4h": 4 * 60 * 60 * 1000,
		"8h": 8 * 60 * 60 * 1000,
		"12h": 12 * 60 * 60 * 1000,
		"1d": 24 * 60 * 60 * 1000,
		"3d": 3 * 24 * 60 * 60 * 1000,
		"7d": 7 * 24 * 60 * 60 * 1000,
		"14d": 14 * 24 * 60 * 60 * 1000
	}
	return mapping.get(interval, 0)
	
def start_spotDCA(historical_data, settings, SpotDCAResults):
	#start Spot DCA by buying 1,000 USDT worth of BTC.

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

	#za kolik quote meny budu kupovat base menu pri grid triggeru
	AmtOfQuoteAssetWhenGridTriggered = amount_invested / price_difference

	grid_price_values = []
	for i in range(0, number_of_grids+1):
		grid_price_values.append([i+1,lower_price + (i * price_difference)])
	
	#print(grid_price_values)

	current_price = float(historical_data[1][4])

	close_to_grid_price_difference = []

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

@app.route("/products", methods=['GET'])
async def get_products():

	loop = asyncio.get_event_loop()
	conn = await aiomysql.connect(host=config.HOST, port=config.PORT,user=config.USER, password=config.PASSWORD, db=config.DB, loop=loop)

	#retrieve data from binance_index table
	cursor = await conn.cursor()
	query = """select distinct base_currency from product
				UNION
				select distinct quote_currency from product;"""
	
	await cursor.execute(query)
	
	data = await cursor.fetchall()
	await cursor.close()

	result = []

	for d in data:
		d = str(d)[2:-3]
		result.append(d)

	return jsonify(result)