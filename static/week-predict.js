async function setWeekPredictPoints(url) {

	const markers = [];
 
	try {

		let response = await fetch(url);
		response.json().then(async (points) => {
		
		console.log(points);

		price_chart_14_1_candlestickSeries1.setData(points[2]);

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
		/*
		+ ' for '
		+ parseFloat(points[0].close).toFixed(2)
		+ ' € | <br>'*/
		+ '<br> Sell at: ' 
		+ end
		/*
		+ ' for '
		+ parseFloat(points[1].close).toFixed(2) 
		+ ' € | '
		/*+ 'total: ' 
		+ 0
		+ '.0 $ | '
		+ 'profit: ' 
		+ '<span style="color: red;">' 
		+ 0 
		+ '.0 $ ' 
		+ '</span>'
		+ '</span>'*/;
		
		// Zoom out the candlestick series to a specific time range.
		/*price_chart_14_1.timeScale().setVisibleRange({
			from: points[2][0].time / 1000,
			to: points[2][points.length-1].time / 1000,
		});*/
	
	});
		
	} catch (error) {
		console.log(error);
	}
	

}