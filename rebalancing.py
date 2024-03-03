import requests
from datetime import datetime, timedelta

rebalancingResults = []

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


def Rebalance(AmountOfBaseCurrency1, AmountOfBaseCurrency2, newPair1Price, newPair2Price, time1, time2, alloc1,alloc2, rebalanceRatio, rebalancingResults):
	
	newPair1QuoteAmount = AmountOfBaseCurrency1 * newPair1Price
	newPair2QuoteAmount = AmountOfBaseCurrency2 * newPair2Price

	QuoteTotal = newPair1QuoteAmount + newPair2QuoteAmount

	pair1Ratio = abs(alloc1 - (newPair1QuoteAmount / QuoteTotal))
	pair2Ratio = abs(alloc2 - (newPair2QuoteAmount / QuoteTotal))
	
	# if (50% - calculated-ratio) je kladne tak dokupuju -> tzn +
	# if (50% - calculated-ratio) je zaporne tak prodavam -> tzn -
	
	if((pair1Ratio > rebalanceRatio) or (pair2Ratio > rebalanceRatio)):
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

def SimulateRebalancing(pair1Data,   pair2Data, pair1QuoteAssest, pair2QuoteAssest, ratio1, ratio2, rebalanceRatio):
	
	#global values
	rebalancingResults = []

	for i in range(1, len(pair1Data)):

		#toto je ke 2. a vyssi iteraci
		amtOfBase1 = (pair1QuoteAssest) / float(pair1Data[0][4])
		amtOfBase2 = (pair2QuoteAssest) / float(pair2Data[0][4])

		Rebalance(amtOfBase1,amtOfBase2,float(pair1Data[i][4]), float(pair2Data[i][4]), pair1Data[i][0],pair2Data[i][0], ratio1, ratio2, rebalanceRatio, rebalancingResults)

	return rebalancingResults

#-----------------------------------------------------------------------------------------

# Set parameters
ratio1 = 0.5
ratio2 = 0.5

pair1QuoteAssest = 50
pair2QuoteAssest = 50

rebalanceRatio = 0.01


interval = "1h"
end_date = "2024-02-25T06:00"
start_date = "2024-02-19T06:00"

s = convert_datetime_to_unix_timestamp(start_date)
e = convert_datetime_to_unix_timestamp(end_date)

# Retrieve Kline data
PAIR1_kline_data = get_binance_kline_data('BTCUSDT', interval, s, e)
PAIR2_kline_data = get_binance_kline_data('ETHUSDT', interval, s, e)

print('\n')
print(PAIR2_kline_data[0][4])
print("--------------------------")
amtOfBase1 = (pair1QuoteAssest) / float(PAIR1_kline_data[0][4])
amtOfBase2 = (pair1QuoteAssest) / float(PAIR2_kline_data[0][4])

print(f"amtOfBase1: ' {amtOfBase1}\n")
print(f"amtOfBase2: ' {amtOfBase2}\n")

print("\n--------------------------")

#1. iterace
Rebalance(amtOfBase1,amtOfBase2, float(PAIR1_kline_data[0][4]), float(PAIR2_kline_data[0][4]), PAIR1_kline_data[0][0], PAIR2_kline_data[0][0], ratio1, ratio2, rebalanceRatio, rebalancingResults)

rebalancingResults = SimulateRebalancing(PAIR1_kline_data, PAIR2_kline_data, pair1QuoteAssest, pair2QuoteAssest,  ratio1, ratio2, rebalanceRatio)

print(f"rebalanceCount: {len(rebalancingResults)}\n")
print(f"results: {rebalancingResults}\n")
''''''