from flask import Flask, render_template, jsonify, request, redirect, send_from_directory
import websocket as ws
import config
from binance.client import Client
import numpy as np
import asyncio
import aiomysql
from datetime import datetime

app = Flask(__name__)

client = Client(config.API_KEY, config.API_SECRET)

# load page


@app.route("/", methods=['GET'])
def index():
	title = "CRYPTOVIEW"

	exchange_info = client.get_exchange_info()
	currency_symbols = exchange_info['symbols']

	return render_template("index.html", title=title, symbols=currency_symbols)

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
	# replace Pant with Ishan
	
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
							from view_pair_for_trade_busd_all v
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


