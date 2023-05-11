/* 

* Konfigurační soubor pro webovou aplikaci

*/

// Slide 1

/* Slide 2 
- získání a zobrazení dat do tabulky Top 10
- data pochází z tabulek  view_pair_for_trade_ a pro potřeby aplikace byly upraveny do json podoby:

	{
		"base": "RAD",
		"compound_interest_total_in_eur": 7.455733,
		"date_begin": "2023-05-02",
		"date_end": "2023-05-08",
		"fixed_deposit_total_in_eur": 1.925318,
		"pairname": "radbusd",
		"quote": "BUSD"
	},
	{
		"base": "ORN",
		"compound_interest_total_in_eur": 2.992203,
		"date_begin": "2023-05-02",
		"date_end": "2023-05-08",
		"fixed_deposit_total_in_eur": 1.316389,
		"pairname": "ornbusd",
		"quote": "BUSD"
	},
	...
*/
displayDataPG2("http://127.0.0.1:5000/view")

/* Slide 3 
- získání a zobrazení dat do tabulky Cryptoview Simple Earn
- data pochází z tabulky savings_staking_all a mají nasledující tvar:

	{
		"asset": "CFX",
		"interval": 122,
		"profit": 10.54
	},
	{
		"asset": "AGIX",
		"interval": 124,
		"profit": 4.26
	},
	...
*/
display_savings_staking_data("http://127.0.0.1:5000/savings")

/* 
- sestavení widgetů s realtime daty pro vybrané páry
*/
const realtimeWidgetBase = ['BTC', 'ETH', 'BNB', 'XRP', 'ADA'];
const realtimeWidgetQuote = 'EUR';

for(let i = 0; i < 5; i++) {
	buildRealtimeWidget(`realtimeWidget${i+1}`, `${realtimeWidgetBase[i]}${realtimeWidgetQuote[0]}`, `${realtimeWidgetBase[i]}`, `${realtimeWidgetQuote[0]}`, 1000);
}

/* Slide 4
- získání a zobrazení dat do tabulky Cryptoview Peaks & Valleys
- data pochází z tabulky peak_valley_stats_all a mají nasledující tvar:

	{
	"compound_interest_total_in_eur": -0.004162,
	"date_begin": "2023-05-08",
	"date_end": "2023-05-08",
	"fixed_deposit_total_in_eur": -0.004199,
	"pairname": "adxbusd",
	"type": "last_day_01"
	},
	{
	"compound_interest_total_in_eur": -0.00858,
	"date_begin": "2023-05-07",
	"date_end": "2023-05-07",
	"fixed_deposit_total_in_eur": -0.008494,
	"pairname": "adxbusd",
	"type": "previous_day_01"
	},
	...
*/

displayPriceChartsDataPage4("http://127.0.0.1:5000/lastPrices")

// Slide 5


// Slide 6




