import pandas as pd
import talib

# Load the BTCEUR data from Binance for the last month
df = pd.read_csv('BTCEUR.csv')

# Calculate the RSI indicator over a 14-day period
rsi_period = 14
df['RSI'] = talib.RSI(df['Close'], timeperiod=rsi_period)

# Print the last 5 rows of the data frame with the RSI values
print(df)

# write the data frame to a CSV file
df.to_csv('rsi_result.csv', index=False)
