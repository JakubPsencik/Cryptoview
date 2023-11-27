from flask import jsonify, request
import requests
from datetime import datetime

def get_binance_kline_data(symbol, interval, start_date, end_date):
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

def convert_datetime_to_unix_timestamp(datetime_string):
	"""Converts a datetime string to a Unix timestamp."""
	#print(datetime_string)
	datetime_object = datetime.strptime(datetime_string, '%Y-%m-%dT%H:%M')
	unix_timestamp = datetime_object.timestamp()
	result = str(unix_timestamp)[0:(len(str(unix_timestamp))-2)]
	result += "000"
	return result

def calc_day_average(data):
	_sum = 0
	for c in data:
		_sum = _sum + float(c[1])

	avg = _sum / len(data)
	return avg


def start_week_predict(historical_data, weekPredictResults):
	
	markers = []

	start = 0
	end = 24
	for i in range(0,8):
		weekPredictResults.append([i, historical_data[start][0], calc_day_average(historical_data[start:end])])
		start = start + 24
		end = start + 24

	print(f"{weekPredictResults}, {len(weekPredictResults)}")

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

	print(f"{min_value}, time: {min_time} | {max_value}, time: {max_time}")

	markers.append([min_time, min_value], [max_time, max_value])

	return markers
	#return jsonify(processed_data)

def getweekPredictions():
	weekPredictResults = []
	markers = []
	# Set parameters
	symbol ="BTCEUR"
	interval = "1h"

	# Retrieve Kline data
	historical_data = get_binance_kline_data(symbol,
											interval, 
											convert_datetime_to_unix_timestamp("2023-11-06T00:00"), 
											convert_datetime_to_unix_timestamp("2023-11-14T00:00"))
	
	complete_historical_data = []
	for c in historical_data:
		complete_historical_data.append([c[0], c[4]])
	
	candles = []
	for c in historical_data:
		candles.append([c[0], c[1], c[2], c[3], c[4]])

	print(f"{complete_historical_data} \n {len(complete_historical_data)}")

	markers = start_week_predict(complete_historical_data, weekPredictResults)
	

	processed_data = []
	
	
	for res in markers:
		
		item = {
			"time": res[0],
			"close": res[1]
		}

		processed_data.append(item)

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

#--------------------------------------------------------
getweekPredictions()