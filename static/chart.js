var binanceSocket

//var url = createurl()
//display_cryptoview_data("http://127.0.0.1:5000/as")



function createurl() {
	//opt = document.getElementById("kline_trade_option_id").value
	pair = document.getElementById("pair_symbol_option_id").value
	int = document.getElementById("interval_option_id").value
	amount = document.getElementById("data_amount_option_id").value
	var url = "http://127.0.0.1:5000/update?kline_trade_option_name=" + "kline"
		+ "&pair_symbol_option_name=" + pair
		+ "&interval_option_name=" + int
		+ "&data_amount_option_name=" + encodeURIComponent(amount);

	return url;
}

async function getData(url) {
	try {
		let response = await fetch(url);
		response.json().then((r) => {
			console.log(r)
			return r
		});
	} catch (error) {
		console.log(error);
	}
}


async function setLine(color, counter) {

	
	const clr = `${color}`
	pairData = pair.map((datapoint) => ({
		time: datapoint.date_begin,
		value: Number(datapoint.fixed_deposit_total_in_eur),
	})); 

	pairData.sort(function(a,b) {
		return new Date(a.time) - new Date(b.time);
	});


		if (counter < 5) {
			
			price_chart_4_1.addLineSeries({
				lastValueVisible: false, // hide the last value marker for this series
				crosshairMarkerVisible: true, // hide the crosshair marker for this series
				color: clr,
				}).setData(pairData);
		} else if(counter >= 5 && counter < 10) {
			
			price_chart_4_2.addLineSeries({
				lastValueVisible: false, // hide the last value marker for this series
				crosshairMarkerVisible: true, // hide the crosshair marker for this series
				color: clr,
				}).setData(pairData);
		} else if(counter >= 10 && counter < 15) {
			
			price_chart_4_3.addLineSeries({
				lastValueVisible: false, // hide the last value marker for this series
				crosshairMarkerVisible: true, // hide the crosshair marker for this series
				color: clr,
				}).setData(pairData);
		} else if(counter >= 15 && counter < 20) {
			
			price_chart_4_4.addLineSeries({
				lastValueVisible: false, // hide the last value marker for this series
				crosshairMarkerVisible: true, // hide the crosshair marker for this series
				color: clr,
				}).setData(pairData);
		} else {
			
			price_chart_4_1.addLineSeries({
				lastValueVisible: false, // hide the last value marker for this series
				crosshairMarkerVisible: true, // hide the crosshair marker for this series
				color: clr,
				}).setData(pairData);
		}


			
	
}

async function displayPriceChartsDataPage4(url) {
	
	var colors = 
	["#493657","#4C9141","#F80000","#F39F18","#7BE0AD"
	,"#C51D34","#89AC76","#354D73","#256D7B","#BEE5BF"
	,"#DFF3E3","#FFD1BA","#44CFCB","#4EA5D9","#2A4494"
	,"#224870","#122C34","#EA899A","#EAE6CA","#C1876B"]
	
	try {
		//	price_chart_4_1		//page 4 chart	
		let response = await fetch(url);
		response.json().then(async (r) => {
			//if not swapped, dates are backwards
			r.reverse();
			pair_names = r[r.length-1];
			//console.log(pair_names)
			//for through all top 20 pairs
			
			for (let i = 0; i < 20; i++) {

				pair = r.filter(((line) => pair_names[i].includes(line.pairname)));
				if(pair.length > 4) { pair = pair.slice(0,4) }
				//console.log(pair)	
				await setLine(colors[i], i);

				//pg2
				// - tady potrebuju dostat output z .
				//buildRealtimeWidgetPG4(wdArr[i], pair_names[i].toUpperCase(), '1m', 1000, 2)
				buildRealtimeWidgetPG4(`wd${i+1}`, pair_names[i].toUpperCase());

			}
			buildRealtimeWidget('realtimeWidget1', 'BTCEUR', 'BTC', 'EUR', 1000);
			buildRealtimeWidget('realtimeWidget2', 'ETHEUR', 'ETH', 'EUR', 1000);
			buildRealtimeWidget('realtimeWidget3', 'BNBEUR', 'BNB', 'EUR', 1000);
			buildRealtimeWidget('realtimeWidget4', 'XRPEUR', 'XRP', 'EUR', 1000);
			buildRealtimeWidget('realtimeWidget5', 'ADAEUR', 'ADA', 'EUR', 1000);
			BuildTable(pair_names, colors, ["jasmy.png", "pha.png", "btc.png"], "pg4_table")
		});

	} catch (error) {
		console.log("displayPriceChartsDataPage4")
		console.log(error);
	}
}

async function checkViewData(response) {
	
	var daily = response[1];
	var weekly = response[23];
	var monthly = response[45];
	var markers = [];

	// Loop through each string value in array1
	for (let i = 0; i < daily.length; i++) {
		const currentValue = daily[i];

		const valDaily = "check.png";
		
		// Check if currentValue is present in array2 and array3
		if (weekly.includes(currentValue)) { valWeekly = "check.png" }
		else { valWeekly = "cross.svg"; }
			
		if (monthly.includes(currentValue)) { valMonthly = "check.png" }
		else { valMonthly = "cross.svg"; }

		currentMarkerRow = {
			"name": currentValue,
			"daily": valDaily,
			"weekly": valWeekly,
			"monthly": valMonthly,
		}

		markers.push(currentMarkerRow)
	}

	return markers;
}

async function displayDataPG2(url) {
	
	var colors = 
	["#493657","#4C9141","#F80000","#F39F18","#7BE0AD"
	,"#C51D34","#89AC76","#354D73","#256D7B","#BEE5BF"
	,"#DFF3E3","#FFD1BA","#44CFCB","#4EA5D9","#2A4494"
	,"#224870","#122C34","#EA899A","#EAE6CA","#C1876B"]
	
	try {
		//OUR TOP...! page
		let response = await fetch(url);
		response.json().then(async (r) => {
		
			//if not swapped, dates are backwards
			//r.reverse();
			pair_names = r[r.length-2]
			//console.log(pair_names)
			//console.log(r)
			let markers = await checkViewData(r)
			//console.log(markers)
			arr = r.slice(2,22)
			var compound = []
			var fixed = []
			for(let i = 0; i < arr.length; i++) {
				compound.push(arr[i].compound_interest_total_in_eur);
				fixed.push(arr[i].fixed_deposit_total_in_eur)
			}
			
			BuildTablePG2(pair_names, compound, fixed, markers, ["jasmy.png", "pha.png", "btc.png"], "pg2_table")

			const startingDate = new Date("2023-01-01");
			const endingDate = new Date("2023-03-01");
			
			setDfaLineChart(lw_dfa_1_lineSeries,startingDate,endingDate,100,`https://api.binance.com/api/v3/klines`,`${markers[0].name.replace(/"/g,'').toUpperCase()}`,'1d',100);
			setDfaLineChart(lw_dfa_2_lineSeries,startingDate,endingDate,100,`https://api.binance.com/api/v3/klines`,`${markers[1].name.replace(/"/g,'').toUpperCase()}`,'1d',100);
			setDfaLineChart(lw_dfa_3_lineSeries,startingDate,endingDate,100,`https://api.binance.com/api/v3/klines`,`${markers[2].name.replace(/"/g,'').toUpperCase()}`,'1d',100);
			setDfaLineChart(lw_dfa_4_lineSeries,startingDate,endingDate,100,`https://api.binance.com/api/v3/klines`,`${markers[3].name.replace(/"/g,'').toUpperCase()}`,'1d',100);
		});

	} catch (error) {
		console.log("displayPriceChartsDataPage4")
		console.log(error);
	}
}

//page4 - table row builder
async function AddTableRow(name, color, imgname, tableName) {
	let table = document.getElementById(tableName)

	let tr = document.createElement("tr");
	let name_td = document.createElement("td");
	let color_td = document.createElement("td");
	let img_td = document.createElement("td");

	name_td.innerHTML += name
	
	color_td.innerHTML += `<span class="dot" style="background-color: ${color}; vertical-align: middle;"></span>`

	let img = document.createElement("img");
	img.setAttribute("src", `static/img/${imgname}`);
	img.setAttribute("loading", 'lazy');
	img.setAttribute("class", 'pg4_table_img');

	img_td.appendChild(img)

	tr.appendChild(name_td)
	tr.appendChild(color_td)
	//tr.appendChild(img_td)

	table.appendChild(tr)
}

//page4 - table  builder
async function BuildTable(names, colors, imgnames, tableName) {

	let counter = 0;
	for(let i = 0; i < 20; i++) {

		AddTableRow(names[i].toUpperCase(), colors[i], imgnames[counter], tableName)
		counter+=1;
		if(counter == 3) {
			counter = 0
		}
	}

}

async function AddTableRowPG2(name, compound, fixed, markers, imgname, tableName) {
	
	let table = document.getElementById(tableName)

	let tr = document.createElement("tr");
	let name_td = document.createElement("td");
	let img_td = document.createElement("td");
	let compound_td = document.createElement("td");
	let fixed_td = document.createElement("td");
	let daily = document.createElement("td");
	let weekly = document.createElement("td");
	let monthly = document.createElement("td");

	name_td.innerHTML += name.replace(/"/g,'');
	name_td.setAttribute("class", "info-label");


	compound_td.innerHTML = `${compound.toFixed(2)} %`
	compound_td.setAttribute("class", "profit")
	if(compound > 1.0) {
		compound_td.setAttribute("style", "color: rgb(8,153,129, 1.0);")
	} else {
		compound_td.setAttribute("style", "color: rgb(242,54,69, 0.8)")
	}

	fixed_td.innerHTML = `${fixed.toFixed(2)} %`
	fixed_td.setAttribute("class", "profit")
	if(fixed > 1.0) {
		fixed_td.setAttribute("style", "color: rgb(8,153,129, 1.0);")
	} else {
		fixed_td.setAttribute("style", "color: rgb(242,54,69, 0.8)")
	}

	let img = document.createElement("img");
	img.setAttribute("src", `static/img/${imgname}`);
	img.setAttribute("loading", 'lazy');
	img.setAttribute("class", 'pg4_table_img');

	img_td.appendChild(img)

	var daily_mark = document.createElement("img");
	daily_mark.setAttribute("src", `static/img/${markers[0]}`);
	daily_mark.setAttribute("loading", 'lazy');
	if(markers[0].includes("check")) { daily_mark.setAttribute("class", 'pg2_table_img_mark_green'); }
	else { daily_mark.setAttribute("class", 'pg2_table_img_mark_red'); }
	
	var weekly_mark = document.createElement("img");
	weekly_mark.setAttribute("src", `static/img/${markers[1]}`);
	weekly_mark.setAttribute("loading", 'lazy');
	if(markers[1].includes("check")) { weekly_mark.setAttribute("class", 'pg2_table_img_mark_green'); }
	else { weekly_mark.setAttribute("class", 'pg2_table_img_mark_red'); }

	var monthly_mark = document.createElement("img");
	monthly_mark.setAttribute("src", `static/img/${markers[2]}`);
	monthly_mark.setAttribute("loading", 'lazy');
	if(markers[2].includes("check")) { monthly_mark.setAttribute("class", 'pg2_table_img_mark_green'); }
	else { monthly_mark.setAttribute("class", 'pg2_table_img_mark_red'); }

	daily.appendChild(daily_mark)
	weekly.appendChild(weekly_mark)
	monthly.appendChild(monthly_mark)

	tr.appendChild(img_td)
	tr.appendChild(name_td)
	tr.appendChild(compound_td)
	tr.appendChild(fixed_td)
	tr.appendChild(daily)
	tr.appendChild(weekly)
	tr.appendChild(monthly)

	table.appendChild(tr)
}

//page4 - table  builder
async function BuildTablePG2(names, compound, fixed, markers, imgnames, tableName) {

	//console.log(markers)
	let table = document.getElementById(tableName)

	let tr = document.createElement("tr");
	let name_td = document.createElement("td");
	let img_td = document.createElement("td");
	let compound_td = document.createElement("td");
	let fixed_td = document.createElement("td");
	let daily = document.createElement("td");
	let weekly = document.createElement("td");
	let monthly = document.createElement("td");

	name_td.innerHTML = "Pair"
	compound_td.innerHTML = "Compound Interest"
	fixed_td.innerHTML = "Fixed Deposit"
	daily.innerHTML = "In daily"
	weekly.innerHTML = "In weekly"
	monthly.innerHTML = "In monthly"

	tr.appendChild(img_td)
	tr.appendChild(name_td)
	tr.appendChild(compound_td)
	tr.appendChild(fixed_td)
	tr.appendChild(daily)
	tr.appendChild(weekly)
	tr.appendChild(monthly)

	table.appendChild(tr)
	let counter = 0;
	for(let i = 0; i < 10; i++) {
		
		AddTableRowPG2(markers[i].name, compound[i], fixed[i], [markers[i].daily,markers[i].weekly,markers[i].monthly], imgnames[counter], tableName)
		counter+=1;
		if(counter == 3) {
			counter = 0
		}
	}

}

async function display_savings_staking_data(url) {
	try {
		let response = await fetch(url);
		response.json().then((r) => {

			//console.log(r)
			BuildTablePG3(r, ["jasmy.png", "pha.png", "btc.png"])
	
		});
	} catch (error) {
		console.log(error);
	}
}

//page4 - table  builder
async function BuildTablePG3(response, imgnames) {

	//console.log(markers)
	let table = document.getElementById("pg5_table")

	let tr = document.createElement("tr");
	let name_td = document.createElement("td");
	let img_td = document.createElement("td");
	let interval_td = document.createElement("td");
	let profit_td = document.createElement("td");


	name_td.innerHTML = "Coin"
	profit_td.innerHTML = "APR"
	interval_td.innerHTML = "Duration(Days)"

	tr.appendChild(img_td)
	tr.appendChild(name_td)
	tr.appendChild(profit_td)
	tr.appendChild(interval_td)
	

	table.appendChild(tr)

	let counter = 0;
	for(let i = 0; i < 10; i++) {
		
		AddTableRowPG5(response[i].asset, response[i].interval, response[i].profit ,imgnames[counter])
		counter+=1;
		if(counter == 3) {
			counter = 0
		}
	}
	
	//setLiveCharts(lw_live_1,lw_live_1_lineSeries,`${response[0].asset.toLowerCase()}usdt`)
	//setLiveCharts(lw_live_2,lw_live_2_lineSeries,`${response[1].asset.toLowerCase()}usdt`)
	//setLiveCharts(lw_live_3,lw_live_3_lineSeries,`${response[2].asset.toLowerCase()}usdt`)
	//setLiveCharts(lw_live_4,lw_live_4_lineSeries,`${response[3].asset.toLowerCase()}usdt`)
	const test = 'btc';
	/*------------------------------------------------------------------------------------- */
	const lw_live_1_pair  = `${response[0].asset.toLowerCase()}busd`;
	console.log(lw_live_1_pair);
	// Create a WebSocket connection to Binance API
	var wsurl = `wss://stream.binance.com:9443/ws/${lw_live_1_pair}@trade`;
	const lw_live_1_socket = new WebSocket(wsurl);
	

	// Handle incoming data from the WebSocket
	lw_live_1_socket.onmessage = event => {
		const trade = JSON.parse(event.data);
		const price = parseFloat(trade.p);

		// Update the chart with the new price
		lw_live_1.timeScale().scrollToRealTime();
		lw_live_1.applyOptions({ priceFormat: { type: 'custom', minMove: '0.01', formatter: () => price.toFixed(2) } });
		lw_live_1.priceScale().applyOptions({PriceScaleMargins: {top: 0.1,bottom: 0.1,}});
		// Update the line series with the new price
		lw_live_1_lineSeries.update({ time: (new Date(trade.T) / 1000), value: price });

	}
	/*------------------------------------------------------------------------------------- */

	/*------------------------------------------------------------------------------------- */
	const lw_live_2_pair  = `${response[1].asset.toLowerCase()}busd`;
	
	// Create a WebSocket connection to Binance API
	wsurl = `wss://stream.binance.com:9443/ws/${lw_live_2_pair}@trade`;
	const lw_live_2_socket = new WebSocket(wsurl);
	

	// Handle incoming data from the WebSocket
	lw_live_2_socket.onmessage = event => {
		const trade = JSON.parse(event.data);
		const price = parseFloat(trade.p);

		// Update the chart with the new price
		lw_live_2.timeScale().scrollToRealTime();
		lw_live_2.applyOptions({ priceFormat: { type: 'custom', minMove: '0.01', formatter: () => price.toFixed(2) } });
		lw_live_2.priceScale().applyOptions({PriceScaleMargins: {top: 0.1,bottom: 0.1,}});
		// Update the line series with the new price
		lw_live_2_lineSeries.update({ time: (new Date(trade.T) / 1000), value: price });

	}
	/*------------------------------------------------------------------------------------- */
	/*------------------------------------------------------------------------------------- */
	const lw_live_3_pair  = `${response[2].asset.toLowerCase()}busd`;
	
	// Create a WebSocket connection to Binance API
	wsurl = `wss://stream.binance.com:9443/ws/${lw_live_3_pair}@trade`;
	const lw_live_3_socket = new WebSocket(wsurl);
	

	// Handle incoming data from the WebSocket
	lw_live_3_socket.onmessage = event => {
		const trade = JSON.parse(event.data);
		const price = parseFloat(trade.p);

		// Update the chart with the new price
		lw_live_3.timeScale().scrollToRealTime();
		lw_live_3.applyOptions({ priceFormat: { type: 'custom', minMove: '0.01', formatter: () => price.toFixed(2) } });
		lw_live_3.priceScale().applyOptions({PriceScaleMargins: {top: 0.1,bottom: 0.1,}});
		// Update the line series with the new price
		lw_live_3_lineSeries.update({ time: (new Date(trade.T) / 1000), value: price });

	}
	/*------------------------------------------------------------------------------------- */
	/*------------------------------------------------------------------------------------- */
	const lw_live_4_pair  = `${response[3].asset.toLowerCase()}busd`;
	
	// Create a WebSocket connection to Binance API
	wsurl = `wss://stream.binance.com:9443/ws/${lw_live_4_pair}@trade`;
	const lw_live_4_socket = new WebSocket(wsurl);
	

	// Handle incoming data from the WebSocket
	lw_live_4_socket.onmessage = event => {
		const trade = JSON.parse(event.data);
		const price = parseFloat(trade.p);

		// Update the chart with the new price
		lw_live_4.timeScale().scrollToRealTime();
		lw_live_4.applyOptions({ priceFormat: { type: 'custom', minMove: '0.01', formatter: () => price.toFixed(2) } });
		lw_live_4.priceScale().applyOptions({PriceScaleMargins: {top: 0.1,bottom: 0.1,}});
		// Update the line series with the new price
		lw_live_4_lineSeries.update({ time: (new Date(trade.T) / 1000), value: price });

	}
	/*------------------------------------------------------------------------------------- */
	
}

async function setDfaLineChart(series, startingDate,endingDate,investmentAmount,apiUrl,symbol,interval,limit) {

		// Main code
		let investments = calculateInvestment(startingDate, endingDate, investmentAmount);
		let _url = `${apiUrl}?symbol=${symbol}&interval=${interval}&limit=${limit}`;
	
		fetchData(_url).then(prices => {
			let portfolioData = calculatePortfolioValue(investments, prices);
			let dates = portfolioData.map(item => item.date);
			let values = portfolioData.map(item => item.value);
	
			let data = [];
			for (let i = 0; i < dates.length; i++) {
			data.push({ time: dates[i], value: values[i] });
			}
	
				//DFAlineSeries.setData(data);
			series.setData(data);
	
			
		});

}

async function AddTableRowPG5(asset, interval, profit, imgname) {
	
	let table = document.getElementById("pg5_table")

	let tr = document.createElement("tr");
	let name_td = document.createElement("td");
	let img_td = document.createElement("td");
	let interval_td = document.createElement("td");
	let profit_td = document.createElement("td");

	name_td.innerHTML += asset.replace(/"/g,'')
	name_td.setAttribute("class", "info-label")

	let img = document.createElement("img");
	img.setAttribute("src", `static/img/${imgname}`);
	img.setAttribute("loading", 'lazy');
	img.setAttribute("class", 'pg4_table_img');

	img_td.appendChild(img)
	
	interval_td.innerHTML = interval
	interval_td.setAttribute("class", "interval")

	profit_td.innerHTML = `${profit} %`
	profit_td.setAttribute("class", "profit")

	tr.appendChild(img_td)
	tr.appendChild(name_td)
	tr.appendChild(profit_td)
	tr.appendChild(interval_td)
	

	table.appendChild(tr)
}

// Page 6 DFA chart functionality

// Define variables
const startingDate = new Date("2023-01-01");
const endingDate = new Date("2023-03-01");
const investmentAmount = 100;
const apiUrl = "https://api.binance.com/api/v3/klines";
const symbol = "BTCEUR";
const interval = "1d";
const limit = 100;

// Define functions
function formatDate(date) {
	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	let day = date.getDate();
	return year + "-" + (month < 10 ? "0" : "") + month + "-" + (day < 10 ? "0" : "") + day;
}

function calculateInvestment(startDate, endDate, amount) {
	let investmentArray = [];
	let currentDate = new Date(startDate.getTime());
	while (currentDate <= endDate) {
	let formattedDate = formatDate(currentDate);
	investmentArray.push({
		date: formattedDate,
		investment: amount,
	});
	currentDate.setDate(currentDate.getDate() + 1);
	}
	return investmentArray;
}

function fetchData(url) {
	return fetch(url)
	.then(response => response.json())
	.then(data => data.map(item => [item[0], item[4]]))
	.catch(error => console.log(error));
}

function calculatePortfolioValue(investments, prices) {
	let portfolioValue = 0;
	let totalBitcoinPurchased = 0;
	let portfolioData = [];
	for (let i = 0; i < investments.length; i++) {
	let investmentDate = new Date(investments[i].date);
	let priceDateIndex = prices.findIndex(item => new Date(item[0]) >= investmentDate);
	if (priceDateIndex !== -1) {
		let price = parseFloat(prices[priceDateIndex][1]);
		let bitcoinPurchased = investments[i].investment / price;
		totalBitcoinPurchased += bitcoinPurchased;
		portfolioValue = totalBitcoinPurchased * price;
	}
	portfolioData.push({
		date: investments[i].date,
		value: portfolioValue.toFixed(2),
	});
	}
	return portfolioData;
}

// Main code
let investments = calculateInvestment(startingDate, endingDate, investmentAmount);
let _url = `${apiUrl}?symbol=${symbol}&interval=${interval}&limit=${limit}`;

fetchData(_url).then(prices => {
	let portfolioData = calculatePortfolioValue(investments, prices);
	let dates = portfolioData.map(item => item.date);
	let values = portfolioData.map(item => item.value);

	let data = [];
	for (let i = 0; i < dates.length; i++) {
	data.push({ time: dates[i], value: values[i] });
	}

});

// Create the Lightweight Chart within the container element
const lw_dfa_1 = LightweightCharts.createChart(document.getElementById('lw-dfa-1'));
const lw_dfa_2 = LightweightCharts.createChart(document.getElementById('lw-dfa-2'));
const lw_dfa_3 = LightweightCharts.createChart(document.getElementById('lw-dfa-3'));
const lw_dfa_4 = LightweightCharts.createChart(document.getElementById('lw-dfa-4'));

const lw_live_1 = LightweightCharts.createChart(document.getElementById('lw-live-1'));
const lw_live_2 = LightweightCharts.createChart(document.getElementById('lw-live-2'));
const lw_live_3 = LightweightCharts.createChart(document.getElementById('lw-live-3'));
const lw_live_4 = LightweightCharts.createChart(document.getElementById('lw-live-4'));

const lw_dfa_1_lineSeries = lw_dfa_1.addLineSeries();
const lw_dfa_2_lineSeries = lw_dfa_2.addLineSeries();
const lw_dfa_3_lineSeries = lw_dfa_3.addLineSeries();
const lw_dfa_4_lineSeries = lw_dfa_4.addLineSeries();

const lw_live_1_lineSeries = lw_live_1.addLineSeries();
const lw_live_2_lineSeries = lw_live_2.addLineSeries();
const lw_live_3_lineSeries = lw_live_3.addLineSeries();
const lw_live_4_lineSeries = lw_live_4.addLineSeries();


async function setLiveCharts(chart, series, pair) {
	const livechart = document.getElementById(`${chart}`);
	console.log(`${chart}, ${series}, ${pair}\n`)
	// Create a WebSocket connection to Binance API
	const lsocket = new WebSocket(`wss://stream.binance.com:9443/ws/${pair}@trade`);
	console.log(lsocket);

	// Handle incoming data from the WebSocket
	lsocket.onmessage = event => {
	const trade = JSON.parse(event.data);
	const price = parseFloat(trade.p);

	// Update the chart with the new price
	livechart.timeScale().scrollToRealTime();
	livechart.applyOptions({ priceFormat: { type: 'custom', minMove: '0.01', formatter: () => price.toFixed(2) } });
	livechart.priceScale().applyOptions({
		PriceScaleMargins: {
			top: 0.1,
			bottom: 0.1,
		}
	});

	// Update the line series with the new price
	const timestamp = new Date(trade.T) / 1000;
	series.update({ time: timestamp, value: price });

	// Log the trade details
	console.log(`Trade ID: ${trade.t}, Price: ${price}, timestamp: ${timestamp}`);

	// Handle WebSocket connection errors
	lsocket.onerror = error => {
		console.error('WebSocket error:', error);
	};
	}

};


//HTML------------------------------------------------------------------------------------------------------------




var price_chart_4_1 = LightweightCharts.createChart(
	document.getElementById('container4_1'),
	{
		layout: {
			background: { color: "#131722" },
			textColor: "#C3BCDB",
		},
		grid: {
			vertLines: { color: "#444" },
			horzLines: { color: "#444" },
		},
		autoSize: true,
	}
);

// Customizing the Crosshair
price_chart_4_1.applyOptions({
    crosshair: {
        // Change mode from default 'magnet' to 'normal'.
        // Allows the crosshair to move freely without snapping to datapoints
        mode: LightweightCharts.CrosshairMode.Normal,

        // Vertical crosshair line (showing Date in Label)
        vertLine: {
            width: 8,
            color: '#C3BCDB44',
            style: LightweightCharts.LineStyle.Solid,
            labelBackgroundColor: '#9B7DFF',
        },

        // Horizontal crosshair line (showing Price in Label)
        horzLine: {
            color: '#9B7DFF',
            labelBackgroundColor: '#9B7DFF',
        },
    },
});
price_chart_4_1.timeScale().fitContent();
price_chart_4_1.timeScale().applyOptions({
	barSpacing: 100,
});

price_chart_4_1.applyOptions({
	rightPriceScale: {
		mode: LightweightCharts.PriceScaleMode.Normal
	}
});

var price_chart_4_2 = LightweightCharts.createChart(
	document.getElementById('container4_2'),
	{
		layout: {
			background: { color: "#131722" },
			textColor: "#C3BCDB",
		},
		grid: {
			vertLines: { color: "#444" },
			horzLines: { color: "#444" },
		},
		autoSize: true,
	}
);

price_chart_4_2.timeScale().fitContent();
price_chart_4_2.timeScale().applyOptions({
	barSpacing: 100,
	
});


var price_chart_4_3 = LightweightCharts.createChart(
	document.getElementById('container4_3'),
	{
		layout: {
			background: { color: "#131722" },
			textColor: "#C3BCDB",
		},
		grid: {
			vertLines: { color: "#444" },
			horzLines: { color: "#444" },
		},
		autoSize: true,
	}
);

price_chart_4_3.timeScale().fitContent();
price_chart_4_3.timeScale().applyOptions({
	barSpacing: 100,
});


var price_chart_4_4 = LightweightCharts.createChart(
	document.getElementById('container4_4'),
	{
		layout: {
			background: { color: "#131722" },
			textColor: "#C3BCDB",
		},
		grid: {
			vertLines: { color: "#444" },
			horzLines: { color: "#444" },
		},
		autoSize: true,
	}
);

price_chart_4_4.timeScale().fitContent();
price_chart_4_4.timeScale().applyOptions({
	barSpacing: 100,
});

// Adding a window resize event handler to resize the chart when
// the window size changes.
// Note: for more advanced examples (when the chart doesn't fill the entire window)
// you may need to use ResizeObserver -> https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
window.addEventListener("resize", () => {
	//chart2.resize(window.innerWidth, window.innerHeight);
});