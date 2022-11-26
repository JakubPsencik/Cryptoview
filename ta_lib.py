import talib
from numpy import genfromtxt
from scipy.signal import find_peaks
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import peakutils
import requests
import bs4

'''
#15 minutes candles from binance api
my_data = genfromtxt("./1_week_old.csv", delimiter=",")

#print(my_data)

#data extraction - close price


# initialize list of lists
closing_price = my_data[:,[0,4]]
  
# Create the pandas DataFrame
df = pd.DataFrame(closing_price, columns=['unixtime', 'close'])
  
# print dataframe.
#print(df)
#print(closing_price)

#klouzavy prumer
#simple_moving_average = talib.SMA(closing_price)
#print(simple_moving_average)

#overbought - usually over 70; oversold usually below 30
#relative_strenght_index = talib.RSI(closing_price)
#print(relative_strenght_index)


# Input signal
t = np.arange(len(closing_price))
#CLOSING PRICES
series = np.array(closing_price)

#print(series)

# Threshold value (for height of peaks and valleys)
thresh = 0.98

# Find indices of peaks
peak_idx, _ = find_peaks(series, height=thresh)

# Find indices of valleys (from inverting the signal)
valley_idx, _ = find_peaks(-series, height=thresh)

#print(peak_idx)
#print(valley_idx)

# Plot signal
plt.plot(t, series)

# Plot threshold
plt.plot([min(t), max(t)], [thresh, thresh], '--')
plt.plot([min(t), max(t)], [-thresh, -thresh], '--')

# Plot peaks (red) and valleys (blue)
plt.plot(t[peak_idx], series[peak_idx], 'r.')
plt.plot(t[valley_idx], series[valley_idx], 'b.')
mng = plt.get_current_fig_manager()
mng.resize(*mng.window.maxsize())
#plt.show()


# load values from strategy_values
threshold_high = 100
threshold_low = 100
min_dist_high = 1000
min_dist_low = 1250

#df = pd.DataFrame([x.__dict__ for x in series])
closes = df['close']
closes_inverted = df['close'] * - 1

#print(closes)
#print(closes_inverted)

peaks = peakutils.indexes(closes, thres=threshold_high, min_dist=min_dist_high)
lows = peakutils.indexes(closes_inverted, thres=threshold_low, min_dist=min_dist_low)

print('peaks\n', peaks)
#print('---------------------------------------------------')
print('lows\n', lows)

buy_points = [(closing_price[x][0], closing_price[x][1]) for x in peaks]

sell_points = [(closing_price[x][0], closing_price[x][1]) for x in lows]

print('buy_points\n', buy_points)
#print('---------------------------------------------------')
print('sell_points\n', sell_points)
'''

#-------------------------------------------------------
