/**
 * Handler for Spot DCA bot chart
 *
 */

//Spot DCA
document.getElementById("bn_DCA").addEventListener("click", function () {
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
	
	//console.log(DCA_url)

	setSpotDCAPoints(DCA_url);
});

var price_chart_12_1 = LightweightCharts.createChart(
	document.getElementById('container12_1'),
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
const price_chart_12_1_candlestickSeries1 = price_chart_12_1.addCandlestickSeries({
	upColor: "green",
	downColor: "red",
});

async function setSpotDCAPoints(DCA_url) {

	const markers = [];
 
	try {

		/*
		<div id="SpotDCA-points-div">
		</div>
		*/
		console.log("spot dca bot initalized...");
		document.getElementById('SpotDCA-points-div').remove();

		const dv = document.createElement("div");
		dv.id = 'SpotDCA-points-div';

		document.getElementById("SpotDCA-left-1").appendChild(dv);

		let response = await fetch(DCA_url);
		response.json().then(async (points) => {
		
		//console.log(points)

		price_chart_12_1_candlestickSeries1.setData(points[0]);
		var marker = {}
		
		//entry point
		markers.push({
			id: String("spotDCAPoint" + 0),
			time: points[1].time / 1000,
			position: 'aboveBar',
			color: 'green',
			shape: 'circle',
			text: String(points[1].amtOfBase + " / " + Math.round(points[1].profit) + '.0 $'),
			size: 2.0,
		});

		var date = new Date(points[1].time);
		var dateString = date.toLocaleDateString();
		var timeString = date.toLocaleTimeString();
		timeString = timeString.substring(0, (timeString.length-2))
		var dt = `${dateString}-${timeString}`;

		InitializeSpotDCAPointRecord(`SpotDCA-record${points[1]}`,dt, parseFloat(points[1].close).toFixed(2), parseFloat(points[1].amtOfBase).toFixed(4), parseFloat(points[1].profit).toFixed(2));
		

		for(let i = 2; i < points.length-2; i++) {
			//console.log(points[i].time / 1000)
			if(points[i].DCA == 1) {
				//console.log(points[i])
				marker = {
					id: String("spotDCAPoint" + i),
					time: points[i].time / 1000,
					position: 'aboveBar',
					color: 'red',
					shape: 'circle',
					text: '',
					size: 0.5,
				};
				//text: String(points[i].amtOfBase + " / " + Math.round(points[i].profit) + '.0 $'),
				markers.push(marker);

				const date = new Date((points[i].time));
				var dateString = date.toLocaleDateString();
				var timeString = date.toLocaleTimeString();
				timeString = timeString.substring(0, (timeString.length-2))
				const dt = `${dateString}-${timeString}`;
				//console.log(dateString, timeString) 

				InitializeSpotDCAPointRecord(`SpotDCA-record${i}`,(dt), parseFloat(points[i].close).toFixed(2), parseFloat(points[i].amtOfBase).toFixed(4), parseFloat(points[i].profit).toFixed(2));
			} else if (points[i].DCA == 0) {
				//console.log(points[i])
				marker = {
					id: String("spotDCAPoint" + i),
					time: points[i].time / 1000,
					position: 'aboveBar',
					color: 'green',
					shape: 'circle',
					text: '',
					size: 0.5,
				};
				//text: String(points[i].amtOfBase + " / " + Math.round(points[i].profit) + '.0 $'),
				markers.push(marker);

				const date = new Date((points[i].time));
				var dateString = date.toLocaleDateString();
				var timeString = date.toLocaleTimeString();
				timeString = timeString.substring(0, (timeString.length-2))
				const dt = `${dateString}-${timeString}`;
				//console.log(dateString, timeString) 

				InitializeSpotDCAPointRecord(`SpotDCA-record${i}`,(dt), parseFloat(points[i].close).toFixed(2), parseFloat(points[i].amtOfBase).toFixed(4), parseFloat(points[i].profit).toFixed(2));
			}
		}

		markers.push({
			id: String("spotDCAPoint" + (points.length-2)),
			time: points[points.length-2].time / 1000,
			position: 'aboveBar',
			color: 'green',
			shape: 'circle',
			text: String(points[points.length-2].amtOfBase + " / " +Math.round(points[points.length-2].profit) + '.0 $'),
			size: 2.0,
		});

		date = new Date((points[points.length-2].time));
		dateString = date.toLocaleDateString();
		timeString = date.toLocaleTimeString();
		timeString = timeString.substring(0, (timeString.length-2))
		dt = `${dateString}-${timeString}`;

		InitializeSpotDCAPointRecord(`SpotDCA-record${points.length-2}`,dt, parseFloat(points[points.length-2].close).toFixed(2), parseFloat(points[points.length-2].amtOfBase).toFixed(4), parseFloat(points[points.length-2].profit).toFixed(2));
		
		//console.log(markers)
		price_chart_12_1_candlestickSeries1.setMarkers(markers);

		const investment = parseInt(base_order) + (parseInt(order_size) * parseInt(number_of_orders));
		const total = Math.round(points[points.length-2].profit);
		const profit = total - investment

		document.getElementById("spotDCA-info-div").innerHTML = 
		'<span style="color: white;">' 
		+ 'investment: ' 
		+ investment 
		+ '.0 $ | '
		+ 'total: ' 
		+ total 
		+ '.0 $ | '
		+ 'profit: ' 
		+ '<span style="color: red;">' 
		+ profit 
		+ '.0 $ ' 
		+ '</span>'
		+ '</span>';
		
		// Zoom out the candlestick series to a specific time range.
		price_chart_12_1.timeScale().setVisibleRange({
			from: points[1].time / 1000,
			to: points[points.length-2].time / 1000,
		});
	
	});
		
	} catch (error) {
		console.log(error);
	}
	

}

function InitializeSpotDCAPointRecord(id, _time, _close, _base, _profit) {

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