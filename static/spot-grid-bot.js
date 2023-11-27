/**
 * Handler for Spot Grid bot chart
 *
 */

//Spot Grid
document.getElementById("bn_SpotGrid").addEventListener("click", function () {

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
	
	console.log(SpotGrid_url)

	//delete chart
	const container13_1 = document.getElementById('container13_1');
	container13_1.remove();
	
	//create again
	const newContainer13_1 = document.createElement('div');
	newContainer13_1.id = 'container13_1';

	//add back to page
	document.getElementById("spot-grid-div").appendChild(newContainer13_1);

	setSpotGridPoints(SpotGrid_url);

});

async function setSpotGridPoints(SpotGrid_url) {

	//create chart
	var price_chart_13_1 = LightweightCharts.createChart(
		document.getElementById('container13_1'),
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
	const price_chart_13_1_candlestickSeries1 = price_chart_13_1.addCandlestickSeries({
		upColor: "green",
		downColor: "red",
	});
	//created

	const markers = [];
 
	try {
		let response = await fetch(SpotGrid_url);
		response.json().then(async (points) => {
		//console.log(points)
		
		//console.log(points[0].l)
		const price_lines = []
		const markers = []

		console.log("spot grid bot initialized...");

		//points
		document.getElementById("SpotGrid-lower").value =  points[0].close;
		document.getElementById("SpotGrid-upper").value = points[0].time;

		//upper
		price_chart_13_1_candlestickSeries1.createPriceLine({
			price: points[0].close,
			color: 'white',
			lineWidth: 2,
			lineStyle: LightweightCharts.LineStyle.Dotted,
			axisLabelVisible: true,
			title: 'Lower',
			lineVisible: true,
		});

		//lower
		price_chart_13_1_candlestickSeries1.createPriceLine({
			price: points[0].time,
			color: 'white',
			lineWidth: 2,
			lineStyle: LightweightCharts.LineStyle.Dotted,
			axisLabelVisible: true,
			title: 'Upper',
			lineVisible: true,
		});


		for(let i = 0; i < points[0].quote; i++) {

			price_chart_13_1_candlestickSeries1.createPriceLine({
				price: points[0].close + ((i+1) * points[0].base),
				color: 'white',
				lineWidth: 2,
				lineStyle: LightweightCharts.LineStyle.Dotted,
				axisLabelVisible: true,
				title: '',
				lineVisible: true,
			});

		}
		
		//---------------------------------------------------------------------------------
		

		let counter = 1;
		while (points[counter].hasOwnProperty('base')) {

			//console.log(points[counter].order)
			if(points[counter].order == 0) {
				markers.push({
					id: String("spotGridPoint" + counter),
					time: points[counter].time / 1000,
					position: 'aboveBar',
					color: 'green',
					shape: 'circle',
					text: '',
					size: 2.0,
				});
			} else if (points[counter].order == 1) {
				markers.push({
					id: String("spotGridPoint" + counter),
					time: points[counter].time / 1000,
					position: 'aboveBar',
					color: 'red',
					shape: 'circle',
					text: '',
					size: 2.0,
				});
			} else if (points[counter].order == 2){
				//tady handle toho profitu
				//console.log(points[counter])
				document.getElementById("spotGrid-info-div").innerHTML = 
				'<span style="color: white;">'
				+ 'investment: '
				+ points[counter].close + ' $ | '
				+ 'total: ' + (points[counter].time).toFixed(4) + ' $ | '
				+ 'profit: ' 
				+ '</span>'
				+ '<span style="color: red;">' 
				+ String(((points[counter].time) - points[counter].close).toFixed(4) + ' $') 
				+ '</span>';
			}
			counter += 1;
		}
		
		//entry point
		markers.push({
			id: String("spotGridPoint" + 0),
			time: points[counter][0].time,
			position: 'aboveBar',
			color: 'yellow',
			shape: 'circle',
			text: 'Entry Point',
			size: 2.0,
		});

		price_chart_13_1_candlestickSeries1.setData(points[counter])
		price_chart_13_1_candlestickSeries1.setMarkers(markers);
		
		// Zoom out the candlestick series to a specific time range.
		price_chart_13_1.timeScale().setVisibleRange({
			
			from: points[counter][0].time,
			to: points[counter][points[counter].length-1].time,
		});
		
	});
	
	} catch (error) {
		console.log(error);
	}
}