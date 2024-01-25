/**
 * Handler for Rebalancing bot chart
 *
 */

//Rebalance
document.getElementById("bn_rebalance").addEventListener("click", function () {
	
	coin1 = document.getElementById("rebalance-coin1").value;
	alloc1 = document.getElementById("rebalance-coin1-allocation").value;
	coin2 = document.getElementById("rebalance-coin2").value;
	alloc2 = document.getElementById("rebalance-coin2-allocation").value;
	investment = document.getElementById("rebalance-investment").value;
	ratio = document.getElementById("rebalance-ratio").value;
	selectElement = document.getElementById("rebalance-interval");
	_interval = selectElement.options[selectElement.selectedIndex].value;
	start_date = document.getElementById("rebalance-start-date").value;
	end_date = document.getElementById("rebalance-end-date").value;


	var rebalance_url = "http://127.0.0.1:5000/rebalance?"
		+ "&coin1=" + coin1
		+ "&alloc1=" + alloc1
		+ "&coin2=" + coin2
		+ "&alloc2=" + alloc2
		+ "&investment=" + investment
		+ "&ratio=" + ratio
		+ "&interval=" + _interval
		+ "&start=" + start_date
		+ "&end=" + end_date;
	
	setRebalancePoints(rebalance_url);
});

async function setRebalancePoints(url) {

	const markers = [];

	try {
		let response = await fetch(url);
		response.json().then(async (points) => {
		
		candlestickSeries1.setData(points[0])
		candlestickSeries2.setData(points[1])
		//console.log("rebalancing bot initialized...");
		//console.log(points)
		var marker = {}
		for(let i = 0; i < points[2].length; i+= 20) {
			
			if(points[2][i].Rebalance == 0) {
				marker = {
					id: String("rebalancePoint" + i),
					time: points[2][i].time1 / 1000,
					position: 'belowBar',
					color: 'yellow',
					shape: 'circle',
					text: String(Math.round(points[2][i].QuoteTotal) + '.0 $'),
					size: 0.5,
				};
			} else {
				marker = {
					id: String("rebalancePoint" + i),
					time: points[2][i].time1 / 1000,
					position: 'aboveBar',
					color: 'red',
					shape: 'circle',
					text: String(Math.round(points[2][i].QuoteTotal) + '.0 $'),
					size: 0.5,
				};
			}
			

			markers.push(marker);
		}
		//console.log(markers)
		candlestickSeries1.setMarkers(markers);
		candlestickSeries2.setMarkers(markers);
		/*
		document.getElementById("rebalancing-info-div").innerHTML = 
		'<span style="color: red;">' 
		+ String(Math.round(points[2][points.length-1].QuoteTotal) + '.0 $') 
		+ '</span>';*/

		price_chart_11_3.timeScale().setVisibleRange({
			from: points[0][0].time,
			to: points[0][points[0].length-1].time,
		});	

		price_chart_11_4.timeScale().setVisibleRange({
			from: points[1][0].time,
			to: points[1][points[1].length-1].time,
		});	
	
	});

	} catch (error) {
		console.log(error);
	}

}