var binanceSocket

var url = createurl()
display_data(url)
display_cryptoview_data("http://127.0.0.1:5000/as")
//downloadImage('https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=023')

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

async function downloadImage(url) {
	fetch(url, {
	  mode : 'no-cors',
	})
	  .then(response => response.blob())
	  .then(blob => {
	  let blobUrl = window.URL.createObjectURL(blob);
	  blobUrl = blobUrl.substring(blobUrl.lastIndexOf("/"));

	  const res = url.replace(/^.*[\\\/]/, '') + blobUrl
	  console.log(res);
	  let a = document.createElement('a');
	  a.download = 'bitcoin-btc-logo.svg?v=002';
	  a.href = 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=002';
	  a.attribute = 'bitcoin-btc-logo.svg?v=002'
	  console.log(a);
	  document.body.appendChild(a);
	  a.click();
	  a.remove();
	})
  }

async function display_data(url) {
	try {
		let response = await fetch(url);
		response.json().then((r) => {

			var fd = r.map((datapoint) => ({
				time:  datapoint.time,
				open:  Number(datapoint.open),
				high:  Number(datapoint.high),
				low:   Number(datapoint.low),
				close: Number(datapoint.close)
			}));

			candlesticksSeries.setData(fd);
			
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
				//infotable.innerHTML += (r[i][0]).toUpperCase() + "<br>"
				var row = document.createElement("tr")

				row.setAttribute("id", "row"+(i+1));
				var th = document.createElement("th");
				//row.scope = "row"
				
				th.setAttribute("scope", "row");
				th.innerHTML = i+1
				th.id = "row"+(i+1);

				let pair = document.createElement("td");
				pair.id = "pair"+(i+1)                    
				pair.innerHTML = r[i][0];


				let base = document.createElement("td");
				base.id = "base"+(i+1)
				//base.innerHTML = r[i][1];
				let baseicon = document.createElement("img");
				baseicon.setAttribute("width", "24px");
				baseicon.setAttribute("height", "24px");
				baseicon.setAttribute("src", `static/img/${(r[i][1]).toLowerCase()}.png`)
				baseicon.setAttribute("loading", 'lazy')
				//baseicon.setAttribute("src", `{{url_for('static', filename='img/${(r[i][1]).toLowerCase()}.png')}}`)
				base.appendChild(baseicon);

				let quote = document.createElement("td");
				quote.id = "quote"+(i+1)                    
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

			const chrt = new Chart(document.getElementById("myChart"), {
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
			
			//document.body.appendChild(chrt)
			
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