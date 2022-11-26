from flask import Flask, render_template, jsonify, request, redirect, send_from_directory
import websocket as ws
import config
from binance.client import Client
import talib
import numpy as np
import pandas as pd
import peakutils
import asyncio
import aiomysql

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
						 from view_pair_for_trade_month limit 5;""")
	#print(cur.description)
	data = await cur.fetchall()
	await cur.close()
	conn.close()



	return jsonify(data)

@app.route('/<path:filename>')  
def send_file(filename):  
      return send_from_directory('/static/img', filename)


# apply p&v button clicked


