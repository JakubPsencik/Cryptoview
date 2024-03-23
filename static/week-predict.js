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

async function setWeekPredictPoints(url) {

	const markers = [];
	const investment = 1000;
	let total = 0;
	let amtOfBase = 0;
	const durationIncrease = 1;
	let duration = 0;
 
	try {

		document.getElementById('WeekPredict-points-div').remove();

		const dv = document.createElement("div");
		dv.id = 'WeekPredict-points-div';

		document.getElementById("WeekPredict-left-1").appendChild(dv);

		let response = await fetch(url);
		response.json().then(async (points) => {
		
		//console.log(points);

		price_chart_14_1_candlestickSeries1.setData(points[2]);
		
		const timestamp = points[0].time;
		increment = 7;
		for(let i = 0; i < points[2].length / 24; i++) {
			
			let date = new Date(timestamp);
			date.setDate(date.getDate() + (i * increment));

			const newTimestamp = date.getTime() / 1000;
			
			//find the record with the timestamp
		
			const result = points[2].find(x => x.time === newTimestamp);
			if(result != undefined) {
				console.log(timestamp, date, newTimestamp, result)
				markers.push({
					id: String("week-predict-" + String(i)),
					time: result.time,
					position: 'aboveBar',
					color: 'yellow',
					shape: 'circle',
					text: "",
					size: 1.0,
				});
			}
			
		}
		/*
		for(let i = 0; i < points[2].length; i++) {
			markers.push({
				id: String("week-predict-" + String(i)),
				time: points[2][i][1] / 1000,
				position: 'aboveBar',
				color: 'yellow',
				shape: 'circle',
				text: String(points[2][i][0]),
				size: 1.0,
			});

			//if((i % 7) == 0) {
			date = new Date((points[2][i][1]));
			dateString = date.toLocaleDateString();
		
			dt = `${dateString}`;

			amtOfBase += investment / parseFloat(points[2][i][3])
			total += investment;

			InitializeWeekPredictPointRecord(("week-predict-point-" + i), dt, total, parseFloat(amtOfBase).toFixed(4), duration)

			duration += durationIncrease;
			//}
			
		}
		*/
		//buy point
		markers.push({
			id: String("week-predict-min"),
			time: (points[0].time / 1000),
			position: 'aboveBar',
			color: 'green',
			shape: 'circle',
			text: ''/*String(parseFloat(points[0].close).toFixed(2) + ' €')*/,
			size: 2.0,
		});

		//sell point
		markers.push({
			id: String("week-predict-max"),
			time: points[1].time / 1000,
			position: 'aboveBar',
			color: 'red',
			shape: 'circle',
			text: ''/*String(parseFloat(points[1].close).toFixed(2) + ' €')*/,
			size: 2.0,
		});
		
		price_chart_14_1_candlestickSeries1.setMarkers(markers);

		begin = String(new Date(points[0].time)).substring(0, String(new Date(points[0].time)).indexOf("GMT"));
		end = String(new Date(points[1].time)).substring(0, String(new Date(points[1].time)).indexOf("GMT"));

		document.getElementById("week-predict-info-div").innerHTML = 
		'<span style="color: white;">' 
		+ 'Buy at: ' 
		+ begin
		+ '<br> Sell at: ' 
		+ end;
	});
		
	} catch (error) {
		console.log(error);
	}
}

function InitializeWeekPredictPointRecord(id, _time, _total, amtOfBase, _duration) {

	const dv = document.createElement("div");
	dv.id = id;
	dv.classList.add("test");

	// Calculate the total width of the div.
	const totalWidth = document.getElementById('WeekPredict-left-side').offsetWidth;
	const elementWidth = (totalWidth / 4);

	var time = document.createElement("span");
	var duration = document.createElement("span");
	var invested = document.createElement("span");
	var balance = document.createElement("span");

	// Set widget text and styling
	time.innerHTML = (`${String(_time)}`);
	duration.innerHTML = (`${_duration} d`);
	invested.innerHTML = (`${_total} €`);
	balance.innerHTML = (`${amtOfBase} BTC`);

	time.classList.add("pg4span_symbol");
	duration.classList.add("test1");
	invested.classList.add("test1");
	balance.classList.add("test1");

	time.style.width = elementWidth + 'px';
	duration.style.width = elementWidth + 'px';
	duration.style.justifyContent = "center";

	invested.style.width = elementWidth + 'px';
	invested.style.justifyContent = "center";

	balance.style.width = elementWidth + 'px';
	balance.style.justifyContent = "center";

	// Append the span element to an existing element
	dv.append(time);
	dv.append(duration);
	dv.append(invested);
	dv.append(balance);

	document.getElementById("WeekPredict-points-div").appendChild(dv);
}