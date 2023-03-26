var binanceSocket

var url = createurl()
display_data(url)
display_cryptoview_data("http://127.0.0.1:5000/as")
//displayPriceChartsData("http://127.0.0.1:5000/lastPrices")
displayPriceChartsDataPage4("http://127.0.0.1:5000/lastPrices")
displayDataPG2("http://127.0.0.1:5000/view")
display_savings_staking_data("http://127.0.0.1:5000/savings")


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

async function display_data(url) {
	try {
		let response = await fetch(url);
		response.json().then((r) => {

			var candleSticksData = r.map((datapoint) => ({
				time:  datapoint.time,
				open:  Number(datapoint.open),
				high:  Number(datapoint.high),
				low:   Number(datapoint.low),
				close: Number(datapoint.close)
			}));

			candlesticksSeries.setData(candleSticksData);
			
			//PROLOZENI KRIVKOU
			// Convert the candlestick data for use with a line series
			var lineData = r.map((datapoint) => ({
				time: datapoint.time,
				value: Number(datapoint.close),
			})); 
			//chart2
			LineSeries.setData(lineData);

		});
	} catch (error) {
		console.log(error);
	}

}

async function displayPriceChartsData(url) {
	try {
		let response = await fetch(url);
		response.json().then((r) => {
			//if not swapped, dates are backwards
			r.reverse();
			//console.log(r)
			pair = r.filter((line => line.pairname == 'jasmybtc'));
			//console.log(pair)
			var pairData = pair.map((datapoint) => ({
				time: datapoint.date_begin,
				value: Number(datapoint.fixed_deposit_total_in_eur),
			}));

			price_chart_1_LineSeries = price_chart_1.addLineSeries({
				lastValueVisible: false, // hide the last value marker for this series
				crosshairMarkerVisible: true, // hide the crosshair marker for this series
				color: "white",
			});
			price_chart_1_LineSeries.setData(pairData);

			pair = r.filter((line => line.pairname == 'ampbtc'));
			//console.log(pair)
			pairData = pair.map((datapoint) => ({
				time: datapoint.date_begin,
				value: Number(datapoint.fixed_deposit_total_in_eur),
			}));
			price_chart_1_LineSeries1 = price_chart_1.addLineSeries({
				lastValueVisible: false, // hide the last value marker for this series
				crosshairMarkerVisible: true, // hide the crosshair marker for this series
				color: "yellow",
			});
			price_chart_1_LineSeries1.setData(pairData);

			pair = r.filter((line => line.pairname == 'cosbtc'));
			//console.log(pair)
			pairData = pair.map((datapoint) => ({
				time: datapoint.date_begin,
				value: Number(datapoint.fixed_deposit_total_in_eur),
			})); 
			price_chart_1_LineSeries2 = price_chart_1.addLineSeries({
				lastValueVisible: false, // hide the last value marker for this series
				crosshairMarkerVisible: true, // hide the crosshair marker for this series
				color: "red",
			});
			price_chart_1_LineSeries2.setData(pairData);

			pair = r.filter((line => line.pairname == 'linabtc'));
			//console.log(pair)
			pairData = pair.map((datapoint) => ({
				time: datapoint.date_begin,
				value: Number(datapoint.fixed_deposit_total_in_eur),
			})); 
			price_chart_1_LineSeries3 = price_chart_1.addLineSeries({
				lastValueVisible: false, // hide the last value marker for this series
				crosshairMarkerVisible: true, // hide the crosshair marker for this series
				color: "green",
			});
			price_chart_1_LineSeries3.setData(pairData);


			pair = r.filter((line => line.pairname == 'snmbusd'));
			if(pair.length > 4) {
				pair = pair.slice(0,4)
			}
			
			//console.log(pair)
			pairData = pair.map((datapoint) => ({
				time: datapoint.date_begin,
				value: Number(datapoint.fixed_deposit_total_in_eur),
			})); 
			price_chart_1_LineSeries4 = price_chart_1.addLineSeries({
				lastValueVisible: false, // hide the last value marker for this series
				crosshairMarkerVisible: true, // hide the crosshair marker for this series
				color: "orange",
			});
			price_chart_1_LineSeries4.setData(pairData);

		});
	} catch (error) {
		console.log(error);
	}
}

async function setLine(color) {

	const clr = `${color}`
	pairData = pair.map((datapoint) => ({
		time: datapoint.date_begin,
		value: Number(datapoint.fixed_deposit_total_in_eur),
	})); 

	pairData.sort(function(a,b) {
		return new Date(a.time) - new Date(b.time);
	});

	price_chart_4_1.addLineSeries({
	lastValueVisible: false, // hide the last value marker for this series
	crosshairMarkerVisible: true, // hide the crosshair marker for this series
	color: clr,
	}).setData(pairData);

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
			pair_names = r[r.length-1]
			//console.log(pair_names)
			//for through all top 20 pairs
			for (let i = 0; i < 20; i++) {

				pair = r.filter(((line) => pair_names[i].includes(line.pairname)));
				if(pair.length > 4) { pair = pair.slice(0,4) }
				//console.log(pair)	
				await setLine(colors[i]);

			}
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
			console.log(r)
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
	tr.appendChild(img_td)

	table.appendChild(tr)
}

//page4 - table  builder
async function BuildTable(names, colors, imgnames, tableName) {

	let counter = 0;
	for(let i = 0; i < 20; i++) {

		AddTableRow(names[i], colors[i], imgnames[counter], tableName)
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
			BuildTablePG5(r, ["jasmy.png", "pha.png", "btc.png"])
	
		});
	} catch (error) {
		console.log(error);
	}
}

//page4 - table  builder
async function BuildTablePG5(response, imgnames) {

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



async function display_cryptoview_data(url) {
	try {
		let response = await fetch(url);
		response.json().then((r) => {
			let infotable = document.getElementById("infotable");
			let infodiv2 = document.getElementById("infodiv2");
			var pairNames = [];
			var tradeCounts = [];
			var barColors = ["red", "green","blue","orange","brown"];

			//console.log(r)
			
			let tmp_str = `Did you know that if you were to trade ${r[0][1]} against ${r[0][2]} this month
							and your initial deposit was €100,
							your deposit would increase by up to ${r[0][6]}% to €${100 * r[0][6]}.`

			infodiv2.innerHTML += tmp_str

			var body = document.createElement("tbody")

			body.setAttribute("id", "body1");
			for(let i = 0; i < r.length; i++) {
				var row = document.createElement("tr");

				row.setAttribute("id", "row"+(i+1));
				var th = document.createElement("th");
				//row.scope = "row"
				
				th.setAttribute("scope", "row");
				th.innerHTML = i+1;
				th.id = "row"+(i+1);

				let pair = document.createElement("td");
				pair.id = "pair"+(i+1);
				pair.innerHTML = r[i][0];


				let base = document.createElement("td");
				base.id = "base"+(i+1)
				//base.innerHTML = r[i][1];
				let baseicon = document.createElement("img");
				baseicon.setAttribute("width", "24px");
				baseicon.setAttribute("height", "24px");
				baseicon.setAttribute("src", `static/img/${(r[i][1]).toLowerCase()}.png`);
				//baseicon.setAttribute("src", `static/img/bitshares-bts-logo.svg`);
				baseicon.setAttribute("loading", 'lazy');
				//baseicon.setAttribute("src", `{{url_for('static', filename='img/${(r[i][1]).toLowerCase()}.png')}}`)
				base.appendChild(baseicon);

				let quote = document.createElement("td");
				quote.id = "quote"+(i+1);
				//quote.innerHTML = r[i][2];
				let quoteicon = document.createElement("img");
				quoteicon.setAttribute("width", "24px");
				quoteicon.setAttribute("height", "24px");
				quoteicon.setAttribute("src", `static/img/${(r[i][2]).toLowerCase()}.png`)
				quoteicon.setAttribute('loading', 'lazy')
				//${(r[i][2]).toLowerCase()}
				quote.appendChild(quoteicon);

				let interest = document.createElement("td");
				interest.id = "interest"+(i+1)+"%"
				interest.innerHTML = r[i][6];
				

				row.appendChild(th)
				row.appendChild(pair);
				row.appendChild(base);
				row.appendChild(quote);
				row.appendChild(interest);

				body.appendChild(row)
				
				infotable.appendChild(body);

				pairNames.push(r[i][0])
				tradeCounts.push(r[i][7])
			}

			//info chart with trades amount
			const trades_amount_info_chart = new Chart(document.getElementById("myChart"), {
				type: "bar",
				data: {
				  labels: pairNames,
				  datasets: [{
					backgroundColor: barColors,
					data: tradeCounts
				  }]
				},
				options: {
				  legend: {display: false},
				  title: {
					display: true,
					text: "amount of trades for each pair from last month"
				  }
				}
			});		
		});
	} catch (error) {
		console.log(error);
	}
}

async function refreshSocket(socket, url) {
	//refresh socket
	socket = new WebSocket(url);

	socket.onmessage = await function(event) {
		var message = JSON.parse(event.data)
		var candlestick = message.k;
		
		candleSeries.update({
			time: candlestick.t / 1000,
			open: candlestick.o,
			high: candlestick.h,
			low: candlestick.l,
			close: candlestick.c
		})
	}
}

//Display data clicked
document.getElementById("display_data_bn").addEventListener("click", function () {
	const url = createurl()
	display_data(url)
	
});

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

	//let ctx = document.getElementById('myChart').getContext('2d');


	// Create the Lightweight Chart within the container element
	const chart = LightweightCharts.createChart(
		document.getElementById('pg6_lightweightchart'),
		{
		layout: {
			background: { color: "#131722" },
			textColor: "#C3BCDB",
		},
		grid: {
			vertLines: { color: "#434651" },
			horzLines: { color: "#434651" },
		},
		}
	);

	// Setting the border color for the vertical axis
	chart.priceScale().applyOptions({
		borderColor: "#71649C",
		barSpacing: 20,
	});

	// Setting the border color for the horizontal axis
	chart.timeScale().applyOptions({
		borderColor: "#71649C",
	});

	// Adjust the starting bar width (essentially the horizontal zoom)
	chart.timeScale().applyOptions({
		barSpacing: 15,
	});

	// Get the current users primary locale
	const currentLocale = window.navigator.languages[0];
	// Create a number format using Intl.NumberFormat
	const myPriceFormatter = Intl.NumberFormat(currentLocale, {
		style: "currency",
		currency: "EUR", // Currency for data points
	}).format;

	// Apply the custom priceFormatter to the chart
	chart.applyOptions({
		localization: {
		priceFormatter: myPriceFormatter,
		},
	});

	// Customizing the Crosshair
	chart.applyOptions({
		crosshair: {
		// Change mode from default 'magnet' to 'normal'.
		// Allows the crosshair to move freely without snapping to datapoints
		mode: LightweightCharts.CrosshairMode.Normal,

		// Vertical crosshair line (showing Date in Label)
		vertLine: {
			width: 8,
			color: "#C3BCDB44",
			style: LightweightCharts.LineStyle.Solid,
			labelBackgroundColor: "#9B7DFF",
		},

		// Horizontal crosshair line (showing Price in Label)
		horzLine: {
			color: "#9B7DFF",
			labelBackgroundColor: "#9B7DFF",
		},
		},
	});

	const DFAlineSeries = chart.addLineSeries({
	color: 'rgba(99, 255, 132, 0.8)',
	lineWidth: 3,
	});

	let data = [];
	for (let i = 0; i < dates.length; i++) {
	data.push({ time: dates[i], value: values[i] });
	}

	DFAlineSeries.setData(data);
	
	/*
	const BTCEURlineSeries = chart.addLineSeries({
		color: 'rgba(99, 255, 132, 0.8)',
		lineWidth: 3,
	});

	data = [];
	for (let i = 0; i < prices.length; i++) {
		data.push({ time: new Date(prices[i][0]), value: prices[i][1] });
	}

	BTCEURlineSeries.setData(data);*/

	// fit the chart to its content
	//chart.fitContent();
});


//HTML------------------------------------------------------------------------------------------------------------


// Create the Lightweight Chart within the container element
var chart2 = LightweightCharts.createChart(
	document.getElementById('container'),
	{
		layout: {
			background: { color: "#222" },
			textColor: "#C3BCDB",
		},
		grid: {
			vertLines: { color: "#444" },
			horzLines: { color: "#444" },
		},
	}
);

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
	barSpacing: 50,
});


//change scale
document.getElementById("set_pricescalemode_bn").addEventListener("click", function() {
	selected = document.getElementById("priceScaleModeSelect").value;
	
	if(selected == "normal")
		chart2.applyOptions({
			rightPriceScale: {
				mode: LightweightCharts.PriceScaleMode.Normal
			}
		});
	else if(selected == "logarithmic")
	chart2.applyOptions({
		rightPriceScale: {
			mode: LightweightCharts.PriceScaleMode.Logarithmic
		}
	});
	else if(selected == "percentage")
	chart2.applyOptions({
		rightPriceScale: {
			mode: LightweightCharts.PriceScaleMode.Percentage
		}
	});
});

// Setting the border color for the vertical axis
chart2.priceScale().applyOptions({
	borderColor: "#71649C",
});

// Setting the border color for the horizontal axis
chart2.timeScale().applyOptions({
	borderColor: "#71649C",
});

// Adjust the starting bar width (essentially the horizontal zoom)
chart2.timeScale().applyOptions({
	barSpacing: 10,
});

// Get the current users primary locale - device language
const currentLocale = window.navigator.languages[0];
// Create a number format using Intl.NumberFormat
const myPriceFormatter = Intl.NumberFormat(currentLocale, {
	style: "currency",
	currency: "EUR", // Currency for data points
}).format;/** */

// Apply the custom priceFormatter to the chart
chart2.applyOptions({
	localization: {
		//priceFormatter: myPriceFormatter,
	},
});

// Customizing the Crosshair
chart2.applyOptions({
	crosshair: {
		// Change mode from default 'magnet' to 'normal'.
		// Allows the crosshair to move freely without snapping to datapoints
		mode: LightweightCharts.CrosshairMode.Magnet,

		// Vertical crosshair line (showing Date in Label)
		vertLine: {
			width: 8,
			color: "#C3BCDB44",
			style: LightweightCharts.LineStyle.Solid,
			labelBackgroundColor: "#9B7DFF",
		},

		// Horizontal crosshair line (showing Price in Label)
		horzLine: {
			color: "#9B7DFF",
			labelBackgroundColor: "#9B7DFF",
		},
	},
});


// Create the Main Series (Candlesticks)
var candlesticksSeries;
candlesticksSeries = chart2.addCandlestickSeries();

// Add an area series to the chart2,
// Adding this before we add the candlestick chart2
// so that it will appear beneath the candlesticks
var LineSeries;
LineSeries = chart2.addLineSeries({
	lastValueVisible: false, // hide the last value marker for this series
	crosshairMarkerVisible: false, // hide the crosshair marker for this series
	color: "white", // hide the line
	//topColor: "rgba(56, 33, 110,0.6)",
	//bottomColor: "rgba(56, 33, 110, 0.1)",
});


// Set the data for the Main Series
//candlesticksSeries.setData(candleStickData);

// Changing the Candlestick colors
candlesticksSeries.applyOptions({
	wickUpColor: "rgb(54, 116, 217)",
	upColor: "rgb(54, 116, 217)",
	wickDownColor: "rgb(225, 50, 85)",
	downColor: "rgb(225, 50, 85)",
	borderVisible: false,
});

// Adjust the options for the priceScale of the candlesticksSeries
candlesticksSeries.priceScale().applyOptions({
	autoScale: true, // disables auto scaling based on visible content
	scaleMargins: {
		top: 0.1,
		bottom: 0.2,
	},
});

candlesticksSeries.setMarkers([
	{
		time: 	Date.now(),
		position: 'aboveBar',
		color: 'blue',
		shape: 'arrowDown',
	},
	{
		time: 1666855800,
		position: 'belowBar',
		color: 'red',
		shape: 'arrowUp',
		id: 'id3',
	},
	{
		time: 1666855800,
		position: 'belowBar',
		color: 'orange',
		shape: 'circle',
		id: 'id4',
		text: 'example',
		size: 2,
	},
]);

chart2.subscribeCrosshairMove(param => {
	if (param.hoveredMarkerId != undefined)
		console.log(param);
});

chart2.subscribeClick(param => {
	if (param.hoveredMarkerId != undefined)
		console.log(param);
});

// Adding a window resize event handler to resize the chart when
// the window size changes.
// Note: for more advanced examples (when the chart doesn't fill the entire window)
// you may need to use ResizeObserver -> https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
window.addEventListener("resize", () => {
	//chart2.resize(window.innerWidth, window.innerHeight);
});