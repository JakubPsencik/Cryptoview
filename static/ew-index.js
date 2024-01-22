//InitializeWeekPredictPointRecord(("week-predict-point-" + i), dt, total, parseFloat(amtOfBase).toFixed(4), duration)
var headerSet = false;

function extractDayAndHour(timestamp) {
	// Create a new Date object with the given timestamp
	let date = new Date(timestamp);

	// Get the day of the week (0-6, where 0 is Sunday and 6 is Saturday)
	let dayOfWeek = date.getDay();

	// Get the hour (0-23)
	let hour = date.getHours();

	return [ dayOfWeek, hour ];
}

function InitializeEwIndexHeader(timestamps) {

	//console.log(timestamps)

	const dv = document.createElement("div");
	dv.classList.add("test");

	// Calculate the total width of the div.
	const totalWidth = document.getElementById('binance-ew-index-table-content').offsetWidth;
	const elementWidth = (totalWidth / parseInt(timestamps.length));
	let timestamp = document.createElement("span");
	timestamp.style.width = elementWidth + 'px';
	dv.append(timestamp);
	for(let i = 0; i < timestamps.length; i++) {
		let timestamp = document.createElement("span");
		var date = new Date(timestamps[i] * 1000);
		var dateString = date.toLocaleDateString();
		var timeString = date.toLocaleTimeString();

		// Remove the '/23' from the year
		var yearWithoutDay = dateString.substring(0, dateString.lastIndexOf('/'));

		// Remove the last two zeros from the time string
		var trimmedTimeString = timeString.slice(0, -6);

		var dt = `${yearWithoutDay}-${trimmedTimeString}`;

		timestamp.innerHTML = (`${String(dt)}`);
		//timestamp.classList.add("pg4span_symbol");
		timestamp.style.width = elementWidth + 'px';
		
		dv.append(timestamp);
		document.getElementById("binance-ew-index-table-content").appendChild(dv);
	}
}

function InitializeEwIndexRowRecord(_coin, data) {

	//console.log(data)

	const dv = document.createElement("div");
	dv.classList.add("test");

	// Calculate the total width of the div.
	const totalWidth = document.getElementById('binance-ew-index-table-content').offsetWidth;
	const elementWidth = (totalWidth / 10);

	let coin = document.createElement("span");
	// Set widget text and styling
	coin.innerHTML = (`${String(_coin)}`);
	coin.classList.add("pg4span_symbol");
	coin.style.width = elementWidth + 'px';
	dv.append(coin);

	const increment = 10;
	let totalInvested = increment;
	let totalOwned = parseFloat(0);

	for(let i = 0; i < data.length; i++) {
		let record = document.createElement("span");
		// Set widget text and styling
		let tmp = parseFloat((increment / data[i].value)).toFixed(4);
		//console.log(tmp);
		//console.log(totalOwned);
		totalOwned += parseFloat(tmp);
		//console.log(totalOwned);
		record.innerHTML = (`${totalInvested} € / ${parseFloat(totalOwned).toFixed(4)}`);
		totalInvested += increment;
		//record.classList.add("pg4span_symbol");
		record.style.width = elementWidth + 'px';
		if(i == (data.length-1)) {
			record.style.background = "red";
		}
		dv.append(record);
	}

	document.getElementById("binance-ew-index-table-content").appendChild(dv);
}

async function setEwIndexTableContent(coin, points) {
	
	var timestamps = [];
	var data = [];

	const lowerPriceIdx = points.length - 2;
	const UpperPriceIdx = points.length - 1;

	let timestampOfLowestAvgPrice = points[lowerPriceIdx].time;
	let timestampOfLowestAvgPriceDayAndHour = extractDayAndHour(timestampOfLowestAvgPrice);

	for(let i = 0; i < (points.length - 3); i++) {
		let tstmp = points[i].time * 1000;
		const dayAndHour = extractDayAndHour(tstmp);

		if((timestampOfLowestAvgPriceDayAndHour[0] == String(dayAndHour[0])) ) {
			data.push(points[i]);
			timestamps.push(points[i].time);
		}
	}


	if(!headerSet) {
		InitializeEwIndexHeader(timestamps);
		headerSet = true;
	}

	InitializeEwIndexRowRecord(coin, data);

}