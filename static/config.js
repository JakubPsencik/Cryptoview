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

const autoInvest = new AutoInvest("http://127.0.0.1:5000/autoinvest");
autoInvest.displayAutoInvestTable();

/* 
Slide 3
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

const simpleEarn = new SimpleEarn("http://127.0.0.1:5000/simpleearn");
simpleEarn.displaySimpleEarnTable();

/* Slide x - Creating Index Linked Plan
*/
displayBinanceIndexAssetData("http://127.0.0.1:5000/binanceIndexAsset");

/* Slide 3 - Rebalancing bot
*/
$(document).ready(async () => {

	investment = document.getElementById("rebalance-investment").value;
	selectElement = document.getElementById("rebalance-interval");
	_interval = selectElement.options[selectElement.selectedIndex].value;
	start_date = document.getElementById("rebalance-start-date").value;
	end_date = document.getElementById("rebalance-end-date").value;

	var rebalance_url = "http://127.0.0.1:5000/rebalance?"
		+ "&investment=" + investment
		+ "&interval=" + _interval
		+ "&start=" + start_date
		+ "&end=" + end_date;
<<<<<<< HEAD
		
	//setRebalancePoints(rebalance_url);
=======

		//http://127.0.0.1:5000/rebalance?&investment=1000&interval=1d&start=2024-04-01T10:00&end=2024-04-15T10:00&coins=BTC,ETH&allocations=50,50&intervalOption=1d
		
	setRebalancePoints(rebalance_url);
>>>>>>> main
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
	
	//InitializeSpotDCAHeader();
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

	setSpotGridPoints(SpotGrid_url);
});

rb_displayBinanceIndexAssetData("http://127.0.0.1:5000/binanceIndexAsset");

displayBinanceCmcEwIndex("http://127.0.0.1:5000/CMC");

$(document).ready(async () => {
	await fetch("http://127.0.0.1:5000/binanceIndexAssetCoins");
});
