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

				/*pair = r.filter(((line) => pair_names[i].includes(line.pairname)));
				if(pair.length > 4) { pair = pair.slice(0,4) }
				//console.log(pair)	
				await setLine(colors[i], i);*/

				//pg2
				// - tady potrebuju dostat output z .
				//buildRealtimeWidgetPG4(wdArr[i], pair_names[i].toUpperCase(), '1m', 1000, 2)
				buildRealtimeWidgetPG4(`wd${i+1}`, pair_names[i].toUpperCase());

			}
			/*buildRealtimeWidget('realtimeWidget1', 'BTCEUR', 'BTC', 'EUR', 1000);
			buildRealtimeWidget('realtimeWidget2', 'ETHEUR', 'ETH', 'EUR', 1000);
			buildRealtimeWidget('realtimeWidget3', 'BNBEUR', 'BNB', 'EUR', 1000);
			buildRealtimeWidget('realtimeWidget4', 'XRPEUR', 'XRP', 'EUR', 1000);
			buildRealtimeWidget('realtimeWidget5', 'ADAEUR', 'ADA', 'EUR', 1000);*/
			//BuildTable(pair_names, colors, ["jasmy.png", "pha.png", "btc.png"], "pg4_table")
		});

	} catch (error) {
		console.log("displayPriceChartsDataPage4")
		console.log(error);
	}
}

async function displayDataauto_invest(url) {
	
	try {
		
		let response = await fetch(url);
		response.json().then(async (r) => {
			
			let markers = await checkViewData(r)

			const startingDate = new Date("2023-01-01");
			const endingDate = new Date("2023-03-01");
			
			/*setDfaLineChart(lw_dfa_1_lineSeries,startingDate,endingDate,100,`https://api.binance.com/api/v3/klines`,`${markers[0].name.replace(/"/g,'').toUpperCase()}`,'1d',100);
			setDfaLineChart(lw_dfa_2_lineSeries,startingDate,endingDate,100,`https://api.binance.com/api/v3/klines`,`${markers[1].name.replace(/"/g,'').toUpperCase()}`,'1d',100);
			setDfaLineChart(lw_dfa_3_lineSeries,startingDate,endingDate,100,`https://api.binance.com/api/v3/klines`,`${markers[2].name.replace(/"/g,'').toUpperCase()}`,'1d',100);
			setDfaLineChart(lw_dfa_4_lineSeries,startingDate,endingDate,100,`https://api.binance.com/api/v3/klines`,`${markers[3].name.replace(/"/g,'').toUpperCase()}`,'1d',100);*/
		});

	} catch (error) {
		console.log("error in: displayPriceChartsDataPage5")
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

async function displayDataPG6(url) {
	try {
		let response = await fetch(url);
		response.json().then((r) => {

			/*setLiveCharts(lw_live_1,lw_live_1_lineSeries,`${r[0].asset.toLowerCase()}busd`)
			setLiveCharts(lw_live_2,lw_live_2_lineSeries,`${r[1].asset.toLowerCase()}busd`)
			setLiveCharts(lw_live_3,lw_live_3_lineSeries,`${r[2].asset.toLowerCase()}busd`)
			setLiveCharts(lw_live_4,lw_live_4_lineSeries,`${r[3].asset.toLowerCase()}busd`)*/
	
		});
	} catch (error) {
		console.log(error);
	}
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

async function setLiveCharts(chart, series, pair) {
	
	
	// Create a WebSocket connection to Binance API
	var wsurl = `wss://stream.binance.com:9443/ws/${pair}@trade`;
	const live_socket = new WebSocket(wsurl);
	
	// Handle incoming data from the WebSocket
	live_socket.onmessage = event => {
		const trade = JSON.parse(event.data);
		const price = parseFloat(trade.p);

		// Update the chart with the new price
		chart.timeScale().scrollToRealTime();
		chart.applyOptions({ priceFormat: { type: 'custom', minMove: '0.01', formatter: () => price.toFixed(2) } });
		chart.priceScale().applyOptions({PriceScaleMargins: {top: 0.1,bottom: 0.1,}});
		// Update the line series with the new price
		series.update({ time: (new Date(trade.T) / 1000), value: price });

	}

};

async function getBinanceKlineData(symbol, interval, startDate, endDate) {
	const baseUrl = "https://api.binance.com/api/v3/klines";

	// Convert start and end dates to timestamps in milliseconds
	const startTimestamp = new Date(startDate).getTime();
	const endTimestamp = new Date(endDate).getTime();
	//console.log(startTimestamp)
	//console.log(endTimestamp)
	// Construct the URL
	const url = `${baseUrl}?symbol=${symbol}&interval=${interval}&startTime=${startTimestamp}&endTime=${endTimestamp}`;

	try {
		// Make the API request using fetch
		const response = await fetch(url);

		if (response.ok) {
			// If the response is successful, parse and return formatted data
			const rawData = await response.json();

			// Map raw data to the desired format
			const formattedData = rawData.map(entry => ({
				open: parseFloat(entry[1]),
				high: parseFloat(entry[2]),
				low: parseFloat(entry[3]),
				close: parseFloat(entry[4]),
				time: Math.floor(entry[0] / 1000), // Convert timestamp to seconds
			}));

			return formattedData;
		} else {
			// If the response is not successful, log an error message
			console.error(`Failed to retrieve data. Status code: ${response.status}`);
			return null;
		}
	} catch (error) {
		// Handle any network or parsing errors
		console.error("An error occurred:", error);
		return null;
	}
}

function formatDateTime(timestamp) {
	const date = new Date(timestamp);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');  // Months are zero-based
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


//HTML------------------------------------------------------------------------------------------------------------

var price_chart_14_1 = LightweightCharts.createChart(
	document.getElementById('container14_1'),
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
		timeScale: {
			timeVisible: true,  // Display time on the time scale
			secondsVisible: false,  // Do not display seconds
		},
	}
);

// Create a candlesticks series
const price_chart_14_1_candlestickSeries1 = price_chart_14_1.addCandlestickSeries({
	upColor: "green",
	downColor: "red",
});

// Adding a window resize event handler to resize the chart when
// the window size changes.
// Note: for more advanced examples (when the chart doesn't fill the entire window)
// you may need to use ResizeObserver -> https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
window.addEventListener("resize", () => {
	//chart2.resize(window.innerWidth, window.innerHeight);
});