import requests
from datetime import datetime, timedelta


"""
Spot DCA examples
You can use Spot DCA to automatically buy or sell a fixed amount of assets at a designated price deviation at a desired frequency. Let’s use BTC/USDT as an example.

Buy-side example
Suppose your trading bot parameters are set as follows:

- Price Deviation: 5%
- Take Profit: 10%
- Base Order: 1,000 USDT
- DCA Order: 1,000 USDT
- Max DCA: 2 orders
"""
price_deviation = 0.01 #%
take_profit = 0.05 #% 
base_order = 1000 #$
DCA_order = 1000 #$
max_DCA_orders = 2
investment = base_order + DCA_order * max_DCA_orders
currently_invested = 0

SpotDCAResults = []

def get_binance_kline_data(symbol, interval, start_date, end_date):
	
	"""
	Function for retrieving historical data from Binance API
	param: symbol
	param: interval
	param: start_date
	param: end_date
	"""
	
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
	
def start_spotDCA(historical_data):
	#start Spot DCA by buying 1,000 USDT worth of BTC.

	num_of_dca_orders = 0
	profit = 0
	base_price = float(historical_data[0][4])
	current_price = float(historical_data[0][4])

	#amount of my base currency
	amtOfBase = base_order / float(current_price)
	currently_invested = base_order
	print(f"amtOfBase: {amtOfBase}\n")

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
		

		#current_price_deviation kladne  | + | - cena stoupla
		#current_price_deviation zaporne | - | - cena klesla
		"""
		The bot will continue to place DCA orders until it reaches the target take-profit percentage. 
		In this example, the target take-profit percentage is 10%, so the bot will sell all of your BTC when the total value of your investments has increased by 10%.

		For example, if you invest $10,000 in the bot, the bot will sell all of your BTC when the total value of your investments reaches $11,000.
		"""

			#trigger DCA order
		if(current_price_deviation < 0 and (abs(current_price_deviation) > price_deviation) and (num_of_dca_orders < max_DCA_orders)):
			newBoughtAmount = DCA_order / current_price
			amtOfBase = amtOfBase + newBoughtAmount
			num_of_dca_orders = num_of_dca_orders + 1
			currently_invested = currently_invested + DCA_order
			print(f"DCA triggered: new amtOfBase = {amtOfBase}\n")
			print(f"amtOfBase: {amtOfBase}, current_price: {current_price}, current_price_deviation: {current_price_deviation}\n")
			print("------------------------------------")

		#check if the total quote amount already increased by 10%
		#elif(current_price_deviation > 0 and (abs(current_price_deviation) > price_deviation) and (num_of_dca_orders < max_DCA_orders)):
		if((num_of_dca_orders == max_DCA_orders)):
			
			profit = amtOfBase * current_price
			print(f"({i}.) current price: {current_price}, current profit: {profit}\n")
			#if(profit >= (take_profit * investment + investment)):
			#print(f"Take Profit {100 * take_profit} % reached, selling {amtOfBase} worth of assets now...\naccuired: {profit}\n")
			SpotDCAResults.append([historical_data[i][0], amtOfBase, profit])
			SpotDCAResults.append(1)
			return profit
			
		
		SpotDCAResults.append([historical_data[i][0], amtOfBase, profit])

		#print("------------------------------------")
	#The bot will continue to run until it reaches the target take-profit percentage (10%).
	print(f"Take Profit {100 * take_profit} % was not reached, assets accuired: {profit}\n")
	SpotDCAResults.append(0)
	return None
#---------------------------------------------------------------------------------

# Set parameters
symbol = "ETHUSDT"
interval = "1h"
end_date = datetime.now()
start_date = end_date - timedelta(days=30)

# Format dates as strings
start_date_str = start_date.strftime("%Y-%m-%d")
end_date_str = end_date.strftime("%Y-%m-%d")

# Retrieve Kline data
BTCUSDT_kline_data = get_binance_kline_data(symbol, interval, start_date_str, end_date_str)

#print(BTCUSDT_kline_data)
start_spotDCA(BTCUSDT_kline_data)
#print("###########################\n")
#print(f"results: {SpotDCAResults}\n")