/* 

* Konfigurační soubor pro webovou aplikaci

*/

// Slide 1

/* 
Slide 2
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


/* Slide 3 - Rebalancing bot
*/
$(document).ready(async () => {

	coin1 = document.getElementById("rebalance-coin1").value;
	alloc1 = document.getElementById("rebalance-coin1-allocation").value;
	coin2 = document.getElementById("rebalance-coin2").value;
	alloc2 = document.getElementById("rebalance-coin2-allocation").value;
	investment = document.getElementById("rebalance-investment").value;
	ratio = document.getElementById("rebalance-ratio").value;
	selectElement = document.getElementById("rebalance-interval");
	_interval = selectElement.options[selectElement.selectedIndex].value;
	start_date = document.getElementById("rebalance-start-date").value;
	end_date = document.getElementById("rebalance-end-date").value;


	var rebalance_url = "http://127.0.0.1:5000/rebalance?"
		+ "&coin1=" + coin1
		+ "&alloc1=" + alloc1
		+ "&coin2=" + coin2
		+ "&alloc2=" + alloc2
		+ "&investment=" + investment
		+ "&ratio=" + ratio
		+ "&interval=" + _interval
		+ "&start=" + start_date
		+ "&end=" + end_date;

	//console.log(rebalance_url)
	//setRebalancePoints(rebalance_url);
});

/* Slide 4 - Spot DCA bot
*/
$(document).ready(async () => {

	pair = document.getElementById("DCA-pair").value;
	price_deviation = document.getElementById("DCA-price-deviation").value;
	take_profit = document.getElementById("DCA-take-profit").value;
	base_order = document.getElementById("DCA-base-order").value;
	order_size = document.getElementById("DCA-order-size").value;
	number_of_orders = document.getElementById("DCA-order-count").value;

	selectElement = document.getElementById("DCA-interval");
	_interval = selectElement.options[selectElement.selectedIndex].value;

	start_date = document.getElementById("DCA-start-date").value;
	end_date = document.getElementById("DCA-end-date").value;


	var DCA_url = "http://127.0.0.1:5000/spotDCA?"
		+ "&pair=" + pair
		+ "&price_deviation=" + price_deviation
		+ "&take_profit=" + take_profit
		+ "&base_order=" + base_order
		+ "&order_size=" + order_size
		+ "&number_of_orders=" + number_of_orders
		+ "&interval=" + _interval
		+ "&start=" + start_date
		+ "&end=" + end_date;

	//setSpotDCAPoints(DCA_url);

});

/* Slide 5 - Spot Grid bot
*/
$(document).ready(async () => {

	pair = document.getElementById("SpotGrid-pair").value;
	lower = document.getElementById("SpotGrid-lower").value;
	upper = document.getElementById("SpotGrid-upper").value;
	grids = document.getElementById("SpotGrid-grids").value;
	grid_investment = document.getElementById("SpotGrid-investment").value;

	selectElement = document.getElementById("SpotGrid-interval");
	_interval = selectElement.options[selectElement.selectedIndex].value;

	start_date = document.getElementById("SpotGrid-start-date").value;
	end_date = document.getElementById("SpotGrid-end-date").value;


	var SpotGrid_url = "http://127.0.0.1:5000/spotGrid?"
		+ "&pair=" + pair
		+ "&lower=" + lower
		+ "&upper=" + upper
		+ "&grids=" + grids
		+ "&grid_investment=" + grid_investment
		+ "&interval=" + _interval
		+ "&start=" + start_date
		+ "&end=" + end_date;

	//setSpotGridPoints(SpotGrid_url);
});

/* 
Slide 6
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
displayTop10("http://127.0.0.1:5000/view")

//setWeekPredictPoints("http://127.0.0.1:5000/weekPredict?&symbol=LTCEUR&interval=1h")

getHistoricalData("http://127.0.0.1:5000/getData?&symbol=BTCEUR")
getHistoricalData("http://127.0.0.1:5000/getData?&symbol=ETHEUR")
getHistoricalData("http://127.0.0.1:5000/getData?&symbol=BNBEUR")
getHistoricalData("http://127.0.0.1:5000/getData?&symbol=XRPEUR")
getHistoricalData("http://127.0.0.1:5000/getData?&symbol=SOLEUR")
getHistoricalData("http://127.0.0.1:5000/getData?&symbol=ADAEUR")
getHistoricalData("http://127.0.0.1:5000/getData?&symbol=TRXEUR")
getHistoricalData("http://127.0.0.1:5000/getData?&symbol=LINKEUR")
getHistoricalData("http://127.0.0.1:5000/getData?&symbol=DOTEUR")
getHistoricalData("http://127.0.0.1:5000/getData?&symbol=LTCEUR")
/**/

const coins = ['BTCEUR', 'ETHEUR', 'BNBEUR', 'XRPEUR', 'SOLEUR', 'ADAEUR', 'TRXEUR', 'LINKEUR', 'DOTEUR', 'LTCEUR'];

for(let i = 0; i < coins.length; i++) {
	//setEwIndexTableContent(coins[i], `http://127.0.0.1:5000/weekPredict?&symbol=${coins[i]}&interval=1h`)
}