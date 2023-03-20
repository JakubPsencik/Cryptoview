'''
import pandas as pd
import matplotlib.pyplot as plt

# Set initial investment amount and regular investment amount
initial_investment = 1000
regular_investment = 500

# Load Bitcoin price data
df = pd.read_csv('mydata.csv', index_col='Open time', parse_dates=True)
print(df)
# Calculate the number of shares purchased with each investment
df['Shares Purchased'] = regular_investment / df['Close']

# Calculate the total value of the investment portfolio over time
df['Portfolio Value'] = (df['Shares Purchased'] * df['Close']) + initial_investment

# Plot the results
df['Portfolio Value'].plot(figsize=(12,8))
plt.xlabel('Date')
plt.ylabel('Portfolio Value')
plt.title('Dollar-Cost Averaging on Bitcoin')
plt.show()
'''

import requests
import pandas as pd
import time

# Define the URL for the Binance API
url = 'https://api.binance.com/api/v3/klines'

# Define the parameters for the API request
params = {
    'symbol': 'BTCEUR',
    'interval': '1d',
    'limit': 1,
    'startTime': int(time.time() - 1*24*60*60)*1000, # 60 days ago in milliseconds
    'endTime': int(time.time())*1000 # Current time in milliseconds
}

# Make the API request and store the data in a DataFrame
response = requests.get(url, params=params)
data = response.json()
df = pd.DataFrame(data, columns=['open_time', 'open', 'high', 'low', 'close', 'volume', 'close_time', 'quote_asset_volume', 'num_trades', 'taker_buy_base_asset_volume', 'taker_buy_quote_asset_volume', 'ignored'])

# Convert the timestamp to a datetime object
df['open_time'] = pd.to_datetime(df['open_time']/1000, unit='s')

# Calculate the average price for each day
df['avg_price'] = (df['open'].astype(float) + df['close'].astype(float)) / 2

# Set the initial investment amount to 0
investment = 0

# Iterate over each row in the DataFrame
for index, row in df.iterrows():
    # If this is the first row, buy the initial investment amount
    if index == 0:
        investment += 180000
        coins = investment / row['avg_price']
        print(f"Bought {coins} BTC at {row['open_time']} for a total of {investment} EUR")
    # Otherwise, buy 100 euros worth of BTC and print the transaction details
    else:
        investment += 180000
        coins = investment / row['avg_price']
        print(f"Bought {coins} BTC at {row['open_time']} for a total of {investment} EUR")

# Print the final investment amount and number of coins held
print(f"Final investment amount: {investment} EUR")
print(f"Number of coins held: {coins}")
