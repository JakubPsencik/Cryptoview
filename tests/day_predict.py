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

def calc_hour_average(data):
	_sum = 0
	for c in data:
		_sum = _sum + float(c[1])

	avg = _sum / len(data)
	return avg

def start_dayPredict(historical_data, DayPredictResults):
	start = 0
	end = 60
	for i in range(0,24):
		DayPredictResults.append([i, historical_data[start][0], calc_hour_average(historical_data[start:end])])
		start = start + 60
		end = start + 60

	print(f"{DayPredictResults}, {len(DayPredictResults)}")

	# Extract prices from the list of lists
	prices = []
	for row in DayPredictResults:
		price = row[2]
		prices.append(price)
	min_value = min(prices)
	max_value = max(prices)
	min_time = 0
	max_time = 0

	for row in DayPredictResults:
		if(min_value == row[2]):
			min_time = row[1]
		if(max_value == row[2]):
			max_time = row[1]

	print(f"{min_value}, time: {min_time} | {max_value}, time: {max_time}")

	return DayPredictResults
	#return jsonify(processed_data)

def getDayPredictions():
	DayPredictResults = []
	# Set parameters
	symbol ="BTCEUR"
	interval = "1m"

	#print(convert_datetime_to_unix_timestamp("2023-10-18T00:00"))
	#print(convert_datetime_to_unix_timestamp("2023-11-18T12:00"))

	# Retrieve Kline data
	historical_data_0_12 = get_binance_kline_data(symbol,
											interval, 
											convert_datetime_to_unix_timestamp("2023-11-16T00:00"), 
											convert_datetime_to_unix_timestamp("2023-11-16T12:00"))
	
	tmp1 = []
	for c in historical_data_0_12:
		tmp1.append([c[0], c[4]])

	historical_data_12_24 = get_binance_kline_data(symbol,
											interval, 
											convert_datetime_to_unix_timestamp("2023-11-16T12:00"), 
											convert_datetime_to_unix_timestamp("2023-11-17T00:00"))
	
	tmp2 = []
	for c in historical_data_12_24:
		tmp2.append([c[0], c[4]])
	
	complete_historical_data = tmp1 + tmp2[1:]

	#print(f"{complete_historical_data[0:60]} \n {len(complete_historical_data)}")

	start_dayPredict(complete_historical_data, DayPredictResults)
	

	processed_data = []
	
	'''
	for res in DayPredictResults:
		
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
'''
#--------------------------------------------------------
getDayPredictions()