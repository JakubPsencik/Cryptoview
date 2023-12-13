const _options = {
	layout: {
		background: { color: "#0B0E11" },
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
};




async function createChart(options, parentElement) {
	const chart = LightweightCharts.createChart(document.getElementById(parentElement));
	chart.applyOptions(options);

	return chart;
}

async function buildCharts(data) {
	var binance_div_test = document.getElementById("binance-div-test");

	var wrapper = document.createElement("div");
	wrapper.classList.add("binance-ew-index-wrapper");

	var chart = await createChart(_options, binance_div_test.id);
	chart.applyOptions({
		width: "500px",
		height: "200px"
	});
	const lineSeries = chart.addLineSeries({});

	lineSeries.setData(data)

	wrapper.append(chart);
	binance_div_test.appendChild(wrapper);

}

async function createImages() {
	
	//for(int i = 0)
	var image = new Image();
	image.src = "/static/img/btc.png";
	image.alt = "An image of a bitcoin";
	image.width = "20px";
	image.height = "20px";
	var wrapper = document.getElementById("binance-ew-index-outer-wrapper");
	wrapper.append(image);
}

async function getHistoricalData(url) {

	const markers = [];
 
	try {
		let response = await fetch(url);
		response.json().then(async (points) => {
			
			chartData = points.slice(0, (points.length-2)); // Output: [2, 3]

			console.log(points)

			if(url.includes("BTCEUR")) {
				var chart = LightweightCharts.createChart(document.getElementById(`binance-container1`));
				chart.applyOptions(_options);
				const lineSeries = chart.addLineSeries({});
				lineSeries.applyOptions({
					type: "line",
					color: "red", // Set the line color to red
					lineWidth: 2, // Set the line width to 2 pixels
				});
				lineSeries.setData(chartData);

				// Zoom out the candlestick series to a specific time range.
				chart.timeScale().setVisibleRange({
					from: points[0].time,
					to: points[points.length-1].time,
				});

				setEwIndexTableContent('BTCEUR', points);
			}

			if(url.includes("ETHEUR")) {
				var chart = LightweightCharts.createChart(document.getElementById(`binance-container2`));
				chart.applyOptions(_options);
				const lineSeries = chart.addLineSeries({});
				lineSeries.setData(points);
				lineSeries.applyOptions({
					type: "line",
					color: "red", // Set the line color to red
					lineWidth: 2, // Set the line width to 2 pixels
				});
				// Zoom out the candlestick series to a specific time range.
				chart.timeScale().setVisibleRange({
					from: points[0].time,
					to: points[points.length-1].time,
				});

				setEwIndexTableContent('ETHEUR', points);
			}

			if(url.includes("BNBEUR")) {
				var chart = LightweightCharts.createChart(document.getElementById(`binance-container3`));
				chart.applyOptions(_options);
				const lineSeries = chart.addLineSeries({});
				lineSeries.setData(points);
				lineSeries.applyOptions({
					type: "line",
					color: "red", // Set the line color to red
					lineWidth: 2, // Set the line width to 2 pixels
				});
				// Zoom out the candlestick series to a specific time range.
				chart.timeScale().setVisibleRange({
					from: points[0].time,
					to: points[points.length-1].time,
				});

				setEwIndexTableContent('BNBEUR', points);
			}
				
			if(url.includes("XRPEUR")) {
				var chart = LightweightCharts.createChart(document.getElementById(`binance-container4`));
				chart.applyOptions(_options);
				const lineSeries = chart.addLineSeries({});
				lineSeries.setData(points);
				lineSeries.applyOptions({
					type: "line",
					color: "red", // Set the line color to red
					lineWidth: 2, // Set the line width to 2 pixels
				});
				// Zoom out the candlestick series to a specific time range.
				chart.timeScale().setVisibleRange({
					from: points[0].time,
					to: points[points.length-1].time,
				});

				setEwIndexTableContent('XRPEUR', points);
			}

			if(url.includes("SOLEUR")) {
				var chart = LightweightCharts.createChart(document.getElementById(`binance-container5`));
				chart.applyOptions(_options);
				const lineSeries = chart.addLineSeries({});
				lineSeries.setData(points);
				lineSeries.applyOptions({
					type: "line",
					color: "red", // Set the line color to red
					lineWidth: 2, // Set the line width to 2 pixels
				});
				// Zoom out the candlestick series to a specific time range.
				chart.timeScale().setVisibleRange({
					from: points[0].time,
					to: points[points.length-1].time,
				});

				setEwIndexTableContent('SOLEUR', points);
			}

			if(url.includes("ADAEUR")) {
				var chart = LightweightCharts.createChart(document.getElementById(`binance-container6`));
				chart.applyOptions(_options);
				const lineSeries = chart.addLineSeries({});
				lineSeries.setData(points);
				lineSeries.applyOptions({
					type: "line",
					color: "red", // Set the line color to red
					lineWidth: 2, // Set the line width to 2 pixels
				});
				// Zoom out the candlestick series to a specific time range.
				chart.timeScale().setVisibleRange({
					from: points[0].time,
					to: points[points.length-1].time,
				});

				setEwIndexTableContent('ADAEUR', points);
			}

			if(url.includes("TRXEUR")) {
				var chart = LightweightCharts.createChart(document.getElementById(`binance-container7`));
				chart.applyOptions(_options);
				const lineSeries = chart.addLineSeries({});
				lineSeries.setData(points);
				lineSeries.applyOptions({
					type: "line",
					color: "red", // Set the line color to red
					lineWidth: 2, // Set the line width to 2 pixels
				});
				// Zoom out the candlestick series to a specific time range.
				chart.timeScale().setVisibleRange({
					from: points[0].time,
					to: points[points.length-1].time,
				});

				setEwIndexTableContent('TRXEUR', points);
			}

			if(url.includes("LINKEUR")) {
				var chart = LightweightCharts.createChart(document.getElementById(`binance-container8`));
				chart.applyOptions(_options);
				const lineSeries = chart.addLineSeries({});
				lineSeries.setData(points);
				lineSeries.applyOptions({
					type: "line",
					color: "red", // Set the line color to red
					lineWidth: 2, // Set the line width to 2 pixels
				});
				// Zoom out the candlestick series to a specific time range.
				chart.timeScale().setVisibleRange({
					from: points[0].time,
					to: points[points.length-1].time,
				});

				setEwIndexTableContent('LINKEUR', points);
			}

			if(url.includes("DOTEUR")) {
				var chart = LightweightCharts.createChart(document.getElementById(`binance-container9`));
				chart.applyOptions(_options);
				const lineSeries = chart.addLineSeries({});
				lineSeries.setData(points);
				lineSeries.applyOptions({
					type: "line",
					color: "red", // Set the line color to red
					lineWidth: 2, // Set the line width to 2 pixels
				});
				// Zoom out the candlestick series to a specific time range.
				chart.timeScale().setVisibleRange({
					from: points[0].time,
					to: points[points.length-1].time,
				});

				setEwIndexTableContent('DOTEUR', points);
			}

			if(url.includes("LTCEUR")) {
				var chart = LightweightCharts.createChart(document.getElementById(`binance-container10`));
				chart.applyOptions(_options);
				const lineSeries = chart.addLineSeries({});
				lineSeries.setData(points);
				lineSeries.applyOptions({
					type: "line",
					color: "red", // Set the line color to red
					lineWidth: 2, // Set the line width to 2 pixels
				});
				// Zoom out the candlestick series to a specific time range.
				chart.timeScale().setVisibleRange({
					from: points[0].time - 100000000000000,
					to: points[points.length-1].time + 100000000000000,
				});

				setEwIndexTableContent('LTCEUR', points);
			}
			/*
			for(let i = 1; i < 11; i++) {
				var chart = LightweightCharts.createChart(document.getElementById(`binance-container${i}`));
				chart.applyOptions(_options);
				const lineSeries = chart.addLineSeries({});
				lineSeries.setData(points);

				// Zoom out the candlestick series to a specific time range.
				chart.timeScale().setVisibleRange({
					from: points[0].time,
					to: points[points.length-1].time,
				});
			}*/
		
		//buildCharts(points);
	});

	//createImages();
		
	} catch (error) {
		console.log(error);
	}
}

async function getHistoricalDataFromFile(url) {

	const markers = [];
 
	try {
		let response = await fetch(url);
		response.json().then(async (points) => {
			//console.log(points)
			
			for(let i = 1; i < 11; i++) {
				var chart = LightweightCharts.createChart(document.getElementById(`binance-container${i}`));
				chart.applyOptions(_options);
				const lineSeries = chart.addLineSeries({});
				lineSeries.setData(points);

				// Zoom out the candlestick series to a specific time range.
				chart.timeScale().setVisibleRange({
					from: points[0].time,
					to: points[points.length-1].time,
				});
			}
		//buildCharts(points);
	});

	//createImages();
		
	} catch (error) {
		console.log(error);
	}
}


function InitializeBinanceEwIndexRecord(id, _time, _close, _base, _profit) {

	//console.log(id, _time, _close, _base, _profit);
	const dv = document.createElement("div");
	dv.id = id;
	dv.classList.add("test");


	// Calculate the total width of the div.
	const totalWidth = document.getElementById('SpotDCA-left').offsetWidth;
	const elementWidth = (totalWidth / 4);
	//console.log(elementWidth);
	// Divide the total width of the div by the number of spans.
	//const spanWidth = totalWidth / spans.length;

	var time = document.createElement("span");
	var close = document.createElement("span");
	var base = document.createElement("span");
	var profit = document.createElement("span");

	// Set widget text and styling
	time.innerHTML = (`${String(_time)}`);
	close.innerHTML = (`${_close} $`);
	profit.innerHTML = (`${_profit} $`);
	base.innerHTML = (`${_base} $`);

	time.classList.add("pg4span_symbol");
	close.classList.add("test1");
	base.classList.add("test1");
	profit.classList.add("test1");

	time.style.width = elementWidth + 'px';
	close.style.width = elementWidth + 'px';
	base.style.width = elementWidth + 'px';
	profit.style.width = elementWidth + 'px';


	// Append the span element to an existing element
	dv.append(time);
	dv.append(close);
	dv.append(base);
	dv.append(profit);

	document.getElementById("SpotDCA-points-div").appendChild(dv);
	
}