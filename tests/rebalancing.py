import requests
from datetime import datetime, timedelta

#global values
pair1amt = 500
pair2amt = 500
rebalanceCount = 0

rebalancingResults = []

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


def Rebalance(AmountOfBaseCurrency1, AmountOfBaseCurrency2, newPair1Price, newPair2Price, rebalanceCount, time1, time2):
	newPair1QuoteAmount = AmountOfBaseCurrency1 * newPair1Price
	newPair2QuoteAmount = AmountOfBaseCurrency2 * newPair2Price

	

	QuoteTotal = newPair1QuoteAmount + newPair2QuoteAmount

	pair1Ratio = abs(0.5 - (newPair1QuoteAmount / QuoteTotal))
	pair2Ratio = abs(0.5 - (newPair2QuoteAmount / QuoteTotal))


	print(f"pair1Ratio: {pair1Ratio}, pair2Ratio: {pair2Ratio}\n")

	print(f"total: {QuoteTotal} ,newPair1QuoteAmount: {newPair1QuoteAmount}, newPair2QuoteAmount: {newPair2QuoteAmount}")

	print(f"ration1: {(newPair1QuoteAmount / QuoteTotal ) * 100}, ration2: {(newPair2QuoteAmount / QuoteTotal) * 100}")
	
	# if (50% - calculated-ration) je kladne tak dokupuju -> tzn +
	# if (50% - calculated-ration) je zaporne tak prodavam -> tzn -
	
	if((pair1Ratio > 0.01) or (pair2Ratio > 0.01)):
		print("rebalance triggered")
		rebalanceCount = rebalanceCount + 1
		print(f"newPair1QuoteAmount / QuoteTotal: {newPair1QuoteAmount / QuoteTotal}, newPair2QuoteAmount / QuoteTotal: {newPair2QuoteAmount / QuoteTotal}\n")
		print(f"ratio1: {0.5 - (newPair1QuoteAmount / QuoteTotal)}, ratio2: {0.5 - (newPair2QuoteAmount / QuoteTotal)}\n")
		ratio1 = 0.5 - (newPair1QuoteAmount / QuoteTotal)
		ratio2 = 0.5 - (newPair2QuoteAmount / QuoteTotal)
		TriggerRebalance(ratio1, ratio2, newPair1QuoteAmount, newPair2QuoteAmount, QuoteTotal, time1, time2)

def TriggerRebalance(pair1Ratio, pair2Ratio, newPair1QuoteAmount, newPair2QuoteAmount, QuoteTotal, time1, time2):

	print(f"def TriggerRebalance\n-----------------------\npair1Ratio: {abs(pair1Ratio)}, pair2Ratio: {abs(pair2Ratio)}")
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
	

	print(f"pair1 amount: ' {pair1amt}\n")
	print(f"pair2 amount: ' {pair2amt}\n")

	print(f"total: ' {QuoteTotal}\n")

	rebalancingResults.append([time1, time2, pair1amt,pair2amt,QuoteTotal])

def SimulateRebalancing(pair1Data, pair2Data):
	
	rebalanceCount = 0
	for i in range(1, len(pair1Data)):

		print(f"Cycle Number: {i}\n")

		print(f"newMultiplier1: ' {pair1Data[i][4]}\n")
		print(f"newMultiplier2: ' {pair2Data[i][4]}\n")

		#toto je ke 2. a vyssi iteraci
		amtOfBase1 = (pair1amt) / float(BTCUSDT_kline_data[0][4])
		amtOfBase2 = (pair2amt) / float(BNBUSDT_kline_data[0][4])


		Rebalance(amtOfBase1,amtOfBase2, float(pair1Data[i][4]), float(pair2Data[i][4]), rebalanceCount, pair1Data[i][0], pair2Data[i][0])

# Set parameters
symbol = "BTCUSDT"
interval = "1h"
end_date = datetime.now()
start_date = end_date - timedelta(days=7)

# Format dates as strings
start_date_str = start_date.strftime("%Y-%m-%d")
end_date_str = end_date.strftime("%Y-%m-%d")

# Retrieve Kline data
BTCUSDT_kline_data = get_binance_kline_data(symbol, interval, start_date_str, end_date_str)
BNBUSDT_kline_data = get_binance_kline_data('BNBUSDT', interval, start_date_str, end_date_str)

print(BTCUSDT_kline_data[0][4])
print('\n')
print(BNBUSDT_kline_data[0][4])
print("--------------------------")
amtOfBase1 = (500) / float(BTCUSDT_kline_data[0][4])
amtOfBase2 = (500) / float(BNBUSDT_kline_data[0][4])

print(f"amtOfBase1: ' {amtOfBase1}\n")
print(f"amtOfBase2: ' {amtOfBase2}\n")

print("\n--------------------------")

#1. iterace
Rebalance(amtOfBase1,amtOfBase2, float(BTCUSDT_kline_data[0][4]), float(BNBUSDT_kline_data[0][4]), 0, None, None)

SimulateRebalancing(BTCUSDT_kline_data, BNBUSDT_kline_data)

print(f"rebalanceCount: {len(rebalancingResults)}\n")
print(f"results: {rebalancingResults}\n")
