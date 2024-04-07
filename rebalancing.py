from flask import Flask, render_template, jsonify, request
import config
from binance.client import Client
import asyncio
import aiomysql
import requests
from datetime import datetime, timedelta
import math
import os;

rebalancingResults = []

def convert_datetime_to_unix_timestamp(datetime_string):
	"""Converts a datetime string to a Unix timestamp."""
	#print(datetime_string)
	datetime_object = datetime.strptime(datetime_string, '%Y-%m-%dT%H:%M')
	unix_timestamp = datetime_object.timestamp()
	result = str(unix_timestamp)[0:(len(str(unix_timestamp))-2)]
	result += "000"
	return result


def get_binance_rebalanace_kline_data(symbol, interval, start_date, end_date):
	base_url = "https://api.binance.com/api/v3/klines"


	url = f"{base_url}?symbol={symbol}&interval={interval}&startTime={start_date}&endTime={end_date}&limit={1000}"
	print(url)
	# Make the API request
	response = requests.get(url)
	
	if response.status_code == 200:
		return response.json()
	else:
		print(f"Failed to retrieve data. Status code: {response.status_code}")
		return None

def Rebalance(coins_amt_of_base, new_coins_prices, timestamps, coin_allocations, rebalancing_results):

	new_coins_quote_amount = []

	for i in range(0, len(coins_amt_of_base)):
		new_coins_quote_amount.append(coins_amt_of_base[i] * float(new_coins_prices[i]))

	quote_total = 0

	for i in range(0, len(new_coins_quote_amount)):
		quote_total += new_coins_quote_amount[i]

	tmp_ratios = []
	coin_ratios = []

	for i in range(0, len(new_coins_quote_amount)):
		tmp_ratios.append(abs(coin_allocations[i] - (new_coins_quote_amount[i] / quote_total)))

	coin_ratios = tmp_ratios
	#podle casu
	for i in range(0, len(coin_ratios)):
	
		# if (50% - calculated-ratio) je kladne tak dokupuju -> tzn +
		# if (50% - calculated-ratio) je zaporne tak prodavam -> tzn -
		#print(f"coin_ratios: {coin_ratios[i]}, rebalanceRatio: {coin_allocations}")
		print(f"coin_ratios: {coin_ratios[i]},  float(coin_allocations[i]): { float(coin_allocations[i])}")

		if(coin_ratios[i] > float(coin_allocations[i])):
			for j in range(0, len(coin_ratios)):
				coin_ratios[j] = coin_allocations[j] - (new_coins_quote_amount[j] / quote_total)
			
			trigger_rebalance(coin_ratios, new_coins_quote_amount, quote_total, timestamps, rebalancing_results)
			break

		else:
			rebalancing_results.append([timestamps, new_coins_quote_amount, quote_total, 0])

	new_coins_quote_amount = []
	tmp_ratios = []
	coin_ratios = []

def trigger_rebalance(coin_ratios, new_coins_quote_amount, quote_total, timestamps, rebalancing_results):

	pair_amounts = []

	for i in range(0, len(coin_ratios)):
		if(coin_ratios[i] > 0):
			#buy
			pair_amounts.append(new_coins_quote_amount[i] + (quote_total * abs(coin_ratios[i])))
		else:
			pair_amounts.append(new_coins_quote_amount[i] - (quote_total * abs(coin_ratios[i])))
	print(pair_amounts)
	#append record when rebalance triggered
	rebalancing_results.append([timestamps, pair_amounts, quote_total, 1])
	pair_amounts = []

def simulate_rebalancing(coins_init_close_prices, coins_data, coins_quote_assests, percentage_ratios, rebalanceRatio, option_value, timestamp_ratio, initial_timestamp):

	#global values
	rebalancing_results = []
	coins_amt_of_base = []
	local_init_timestamp = initial_timestamp

	

	#podle casu
	for i in range(0, len(coins_data[0])):
		#print(f"{coins_data[0][i][0]} == {local_init_timestamp}" )
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
			
			Rebalance(coins_amt_of_base, coins_new_prices,coins_new_timestamps, percentage_ratios, rebalancing_results)
			coins_amt_of_base = []
		else:
			continue

	return rebalancing_results


def getRebalancing():

	coins = ['BTC','ETH','BNB']
	allocations = [50,30,20]

	rebalancing_results = []
	
	interval = '1h'
	
	s = convert_datetime_to_unix_timestamp('2024-03-18T01:00')
	e = convert_datetime_to_unix_timestamp('2024-03-19T01:00')
	
	coins_kline_data = []
	
	for i in range(0, len(coins)):
		coins_kline_data.append(get_binance_rebalanace_kline_data(str(f"{coins[i]}USDT"), interval, s, e))

	percentage_ratios = []

	for i in range(0, len(allocations)):
		percentage_ratios.append(float(int(allocations[i])) / 100)

	coins_amt_of_base = []

	for i in range(0, len(coins_kline_data)):
		coins_amt_of_base.append((percentage_ratios[i] * float(1000)) / float(coins_kline_data[i][0][4]))

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


	option_value = 1
	sec = convert_interval_to_miliseconds('1h')
	time_ratio = sec

	#1. iterace	
	Rebalance(coins_amt_of_base, coins_init_close_prices, coins_init_timestamps, percentage_ratios, rebalancing_results)

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

	print(processed_data[3])
	#return jsonify(processed_data)

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


getRebalancing()