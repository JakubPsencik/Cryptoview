def simulate_hold(data, total_invested_dca):
    initial_price = data[0]['close']
    coin_bought = total_invested_dca / initial_price  # Buy the same amount of coins as in DCA
    final_price = data[-1]['close']
    final_balance = coin_bought * final_price
    profit = final_balance - total_invested_dca
    return final_balance, profit
    
def simulate_dca(data, initial_balance):
    total_invested = 0  # Total amount invested
    coin_balance = 0
    for item in data:
        price = item['close']
        coin_bought = initial_balance / price
        coin_balance += coin_bought
        total_invested += initial_balance  # Accumulate the total amount invested

    final_price = data[-1]['close']
    final_balance = coin_balance * final_price
    
    profit = final_balance - total_invested  # Profit is final balance minus total invested
    return total_invested, final_balance, profit

# Sample data
data = [
    {
        "close": 62085.4,
        "datetime": "Fri, 01 Mar 2024 10:00:00 GMT",
        "unixtime": 1709287200000
    },
    {
        "close": 61828.7,
        "datetime": "Sat, 02 Mar 2024 10:00:00 GMT",
        "unixtime": 1709373600000
    },
    {
        "close": 61710,
        "datetime": "Sun, 03 Mar 2024 10:00:00 GMT",
        "unixtime": 1709460000000
    },
    {
        "close": 65257.6,
        "datetime": "Mon, 04 Mar 2024 10:00:00 GMT",
        "unixtime": 1709546400000
    },
    {
        "close": 66466.8,
        "datetime": "Tue, 05 Mar 2024 10:00:00 GMT",
        "unixtime": 1709632800000
    },
    {
        "close": 66351.7,
        "datetime": "Wed, 06 Mar 2024 10:00:00 GMT",
        "unixtime": 1709719200000
    },
    {
        "close": 66686,
        "datetime": "Thu, 07 Mar 2024 10:00:00 GMT",
        "unixtime": 1709805600000
    },
    {
        "close": 67112.2,
        "datetime": "Fri, 08 Mar 2024 10:00:00 GMT",
        "unixtime": 1709892000000
    },
    {
        "close": 68276,
        "datetime": "Sat, 09 Mar 2024 10:00:00 GMT",
        "unixtime": 1709978400000
    },
    {
        "close": 69798.3,
        "datetime": "Sun, 10 Mar 2024 10:00:00 GMT",
        "unixtime": 1710064800000
    },
    {
        "close": 71684.2,
        "datetime": "Mon, 11 Mar 2024 10:00:00 GMT",
        "unixtime": 1710151200000
    },
    {
        "close": 71890,
        "datetime": "Tue, 12 Mar 2024 10:00:00 GMT",
        "unixtime": 1710237600000
    },
    {
        "close": 73290,
        "datetime": "Wed, 13 Mar 2024 10:00:00 GMT",
        "unixtime": 1710324000000
    },
    {
        "close": 73336,
        "datetime": "Thu, 14 Mar 2024 10:00:00 GMT",
        "unixtime": 1710410400000
    },
    {
        "close": 67891.2,
        "datetime": "Fri, 15 Mar 2024 10:00:00 GMT",
        "unixtime": 1710496800000
    },
    {
        "close": 68984,
        "datetime": "Sat, 16 Mar 2024 10:00:00 GMT",
        "unixtime": 1710583200000
    },
    {
        "close": 66521.1,
        "datetime": "Sun, 17 Mar 2024 10:00:00 GMT",
        "unixtime": 1710669600000
    },
    {
        "close": 67906.8,
        "datetime": "Mon, 18 Mar 2024 10:00:00 GMT",
        "unixtime": 1710756000000
    },
    {
        "close": 64013.3,
        "datetime": "Tue, 19 Mar 2024 10:00:00 GMT",
        "unixtime": 1710842400000
    },
    {
        "close": 63157.6,
        "datetime": "Wed, 20 Mar 2024 10:00:00 GMT",
        "unixtime": 1710928800000
    },
    {
        "close": 66905.7,
        "datetime": "Thu, 21 Mar 2024 10:00:00 GMT",
        "unixtime": 1711015200000
    },
    {
        "close": 65559.4,
        "datetime": "Fri, 22 Mar 2024 10:00:00 GMT",
        "unixtime": 1711101600000
    },
    {
        "close": 64540,
        "datetime": "Sat, 23 Mar 2024 10:00:00 GMT",
        "unixtime": 1711188000000
    },
    {
        "close": 64909,
        "datetime": "Sun, 24 Mar 2024 10:00:00 GMT",
        "unixtime": 1711274400000
    },
    {
        "close": 67020,
        "datetime": "Mon, 25 Mar 2024 10:00:00 GMT",
        "unixtime": 1711360800000
    },
    {
        "close": 71138,
        "datetime": "Tue, 26 Mar 2024 10:00:00 GMT",
        "unixtime": 1711447200000
    },
    {
        "close": 70066,
        "datetime": "Wed, 27 Mar 2024 10:00:00 GMT",
        "unixtime": 1711533600000
    },
    {
        "close": 70586,
        "datetime": "Thu, 28 Mar 2024 10:00:00 GMT",
        "unixtime": 1711620000000
    },
    {
        "close": 69706,
        "datetime": "Fri, 29 Mar 2024 10:00:00 GMT",
        "unixtime": 1711706400000
    },
    {
        "close": 70021.1,
        "datetime": "Sat, 30 Mar 2024 10:00:00 GMT",
        "unixtime": 1711792800000
    },
    {
        "close": 70229,
        "datetime": "Sun, 31 Mar 2024 10:00:00 GMT",
        "unixtime": 1711879200000
    },
    {
        "close": 69389.5,
        "datetime": "Mon, 01 Apr 2024 10:00:00 GMT",
        "unixtime": 1711965600000
    },
    {
        "close": 66068,
        "datetime": "Tue, 02 Apr 2024 10:00:00 GMT",
        "unixtime": 1712052000000
    },
    {
        "close": 66472,
        "datetime": "Wed, 03 Apr 2024 10:00:00 GMT",
        "unixtime": 1712138400000
    },
    {
        "close": 66262.2,
        "datetime": "Thu, 04 Apr 2024 10:00:00 GMT",
        "unixtime": 1712224800000
    },
    {
        "close": 66880,
        "datetime": "Fri, 05 Apr 2024 10:00:00 GMT",
        "unixtime": 1712311200000
    },
    {
        "close": 67807.8,
        "datetime": "Sat, 06 Apr 2024 10:00:00 GMT",
        "unixtime": 1712397600000
    },
    {
        "close": 69266,
        "datetime": "Sun, 07 Apr 2024 10:00:00 GMT",
        "unixtime": 1712484000000
    },
    {
        "close": 72238,
        "datetime": "Mon, 08 Apr 2024 10:00:00 GMT",
        "unixtime": 1712570400000
    },
    {
        "close": 70428,
        "datetime": "Tue, 09 Apr 2024 10:00:00 GMT",
        "unixtime": 1712656800000
    },
    {
        "close": 69112,
        "datetime": "Wed, 10 Apr 2024 10:00:00 GMT",
        "unixtime": 1712743200000
    },
    {
        "close": 70628,
        "datetime": "Thu, 11 Apr 2024 10:00:00 GMT",
        "unixtime": 1712829600000
    },
    {
        "close": 70617,
        "datetime": "Fri, 12 Apr 2024 10:00:00 GMT",
        "unixtime": 1712916000000
    },
    {
        "close": 67360,
        "datetime": "Sat, 13 Apr 2024 10:00:00 GMT",
        "unixtime": 1713002400000
    },
    {
        "close": 64194.3,
        "datetime": "Sun, 14 Apr 2024 10:00:00 GMT",
        "unixtime": 1713088800000
    }
]



# Simulate DCA strategy
total_invested, final_balance_dca, profit_dca = simulate_dca(data)
print("\nDollar Cost Averaging (DCA) Strategy:")
print("Total invested:", total_invested)
print("Final Balance:", final_balance_dca)
print("Profit:", profit_dca)

print("\n")

# Simulate hold strategy
final_balance_hold, profit_hold = simulate_hold(data, total_invested_dca=total_invested)
print("Hold Strategy:")
print("Total invested:", total_invested)
print("Final Balance:", final_balance_hold)
print("Profit:", profit_hold)