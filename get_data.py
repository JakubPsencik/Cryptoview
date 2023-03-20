import pandas as pd
from binance.client import Client
from datetime import datetime, timedelta
import config

# Set up the Binance API client
client = Client(config.API_KEY, config.API_SECRET)

# Get the current time and the time one month ago
now = datetime(2023,2,1)
one_month_ago = now - timedelta(days=30)

# Convert the times to Unix timestamps
start_time = int(one_month_ago.timestamp() * 1000)
end_time = int(now.timestamp() * 1000)

# Get the BTCEUR data from Binance for the last month
klines = client.get_historical_klines('BTCEUR', Client.KLINE_INTERVAL_1DAY, start_time, end_time)

# Convert the data to a Pandas data frame
df = pd.DataFrame(klines, columns=['Open time', 'Open', 'High', 'Low', 'Close', 'Volume', 'Close time', 'Quote asset volume', 'Number of trades', 'Taker buy base asset volume', 'Taker buy quote asset volume', 'Ignore'])

# Remove unused columns
df = df[['Open time', 'Open', 'High', 'Low', 'Close']]

# Convert the Open time column to a datetime object
df['Open time'] = pd.to_datetime(df['Open time'], unit='ms')

# Save the data to a CSV file
df.to_csv('BTCEUR.csv', index=False)
