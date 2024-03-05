/**
 * Handler for Rebalancing bot chart
 *
 */

var price_chart_11_3 = LightweightCharts.createChart(
	document.getElementById('container11_3'),
	{
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
	}
);

var price_chart_11_4 = LightweightCharts.createChart(
	document.getElementById('container11_4'),
	{
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
	}
);
// Create a candlesticks series
const candlestickSeries1 = price_chart_11_3.addCandlestickSeries({
upColor: "green",
downColor: "red",
});

// Create a candlesticks series
const candlestickSeries2 = price_chart_11_4.addCandlestickSeries({
	upColor: "yellow",
	downColor: "purple",
});

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
		/**/
		document.getElementById("rebalancing-info-div").innerHTML = 
		'<span style="color: red;">' 
		+ String(Math.round(points[2][points.length-1].QuoteTotal) + '.0 $') 
		+ '</span>';

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

// input form handler

const rb_input = document.getElementById("rebalancing_bot_search_input");
const rb_dropdown = document.getElementById("rebalancing_bot_search_input_list");

const rb_addCoinsButton = document.getElementById("rebalancing_bot_add_coins_bn");
const rb_recomCoinsButton = document.getElementById("rebalancing_bot_recom_coins_bn");

//const selectedInterval = document.getElementById("rebalancing_bot_interval_selector_button_wrapper");

rb_addCoinsButton.addEventListener("click", () => {

	document.getElementById("rebalancing_bot_search_div").style.display = "block";
	document.getElementById("rebalancing_bot_search_bar_wrapper").style.display = "inline-flex";
	document.getElementById("rebalancing_bot_search_input_list").style.display = "block";

});

document.addEventListener("click", (event) => {
  const target = event.target;
  const searchBarWrapper = document.getElementById("rebalancing_bot_search_bar_wrapper");
  const searchInputList = document.getElementById("rebalancing_bot_search_input_list");
  const wrapper = document.getElementById("rebalancing_bot_search_div");

  if (target !== rb_addCoinsButton && !searchBarWrapper.contains(target) && !searchInputList.contains(target) && !wrapper.contains(target)) {
	searchBarWrapper.style.display = "none";
	searchInputList.style.display = "none";
	wrapper.style.display = "none";
  }

});

rb_recomCoinsButton.addEventListener("click", () => {
	const page_binance_index_asset = document.getElementById("rebalance_page_binance_index_asset");
	const rebalancing_bot_div = document.getElementById("rebalance_settings_div");

	page_binance_index_asset.style.display = "block";
	page_binance_index_asset.style.zIndex = "998";

	rebalancing_bot_div.style.display = "none";
});

document.getElementById("binance_index_asset_cancel_button").addEventListener("click", () => {
	const page_binance_index_asset = document.getElementById("page_binance_index_asset");
	page_binance_index_asset.style.display = "none";

	const rebalancing_bot_div = document.getElementById("rebalance_settings_div");
	rebalancing_bot_div.style.display = "block";
});

const rb_selected_coins_in_index_wrapper = document.getElementById("rebalancing_bot_index_wrapper");

if (rb_selected_coins_in_index_wrapper.children.length > 2) {
	const index_settings_wrapper = document.getElementById("rebalancing_bot_index_settings_wrapper");
	index_settings_wrapper.style.display = "flex";
}

input.addEventListener("input", () => {
	rbFilterSuggestions(input.value);
});

async function rbFilterSuggestions(inputValue) {
	const filteredSuggestions =  binanceIndexAssetCoins.filter((suggestion) => {
	  return suggestion.toLowerCase().startsWith(inputValue.toLowerCase());
	});

	rbDisplaySuggestions(filteredSuggestions);
}

function rbDisplaySuggestions(suggestionsList) {
	rb_dropdown.innerHTML = "";

	if(suggestionsList.length == binanceIndexAssetCoins.length) { 
		return null;
	}

	if (suggestionsList.length > 0) {
	suggestionsList.forEach((suggestion) => {

		const coinDiv = document.createElement("div");
		coinDiv.classList.add("suggestion_wrapper");

		let img = document.createElement("img");
		img.setAttribute("src", `static/img/${suggestion}.png`);
		img.setAttribute("loading", 'lazy');
		img.setAttribute("class", 'rebalancing_bot_suggestion_image');


		const coinNameDiv = document.createElement("div");
		coinNameDiv.classList.add("coin_name_div");
		coinNameDiv.textContent = suggestion;
		/*
		coinNameDiv.addEventListener("click", () => {
		input.value = suggestion;
		rb_dropdown.innerHTML = "";

		});*/

		coinDiv.addEventListener("click", () => {
			const index_wrapper = document.getElementById("rebalancing_bot_index_wrapper");
	
			const newWrapper = coinDiv.cloneNode(true);
			newWrapper.classList.add("selected_coin_wrapper");

			if(index_wrapper.children.length < 12) {

				const allocationInput = document.createElement("input");
				allocationInput.setAttribute("data-bn-type", "input");
				allocationInput.setAttribute("placeholder", "Enter at least 10%");
				allocationInput.setAttribute("class", "rebalancing_bot_allocation_input");
				allocationInput.setAttribute("value", "10");

				allocationInput.addEventListener("input", (event) => {
					let inputValue = event.target.value;
					inputValue = inputValue.replace(/[^0-9]/g, ""); // Remove non-numeric characters
					inputValue = Math.min(Math.max(parseInt(inputValue), 0), 100); // Restrict the value between 0 and 100
					event.target.value = inputValue;
				});
				newWrapper.appendChild(allocationInput);
		
				const percentDiv = document.createElement("div");
				percentDiv.classList.add("rebalancing_bot_percent");
				percentDiv.textContent = "%";
				newWrapper.appendChild(percentDiv);

				
				const removeButton = document.createElement("button");
				removeButton.classList.add("rebalancing_bot_remove_button");
				removeButton.textContent = "X";
				newWrapper.appendChild(removeButton);

				removeButton.addEventListener("click", () => {
					newWrapper.remove();
					if(index_wrapper.children.length == 2) {
						document.getElementById("rebalancing_bot_no_coins_selected").style.display = "block";
						document.getElementById("rebalancing_bot_index_settings_wrapper").style.display = "none";
					}
					
				});

				//add coin to and index
				index_wrapper.appendChild(newWrapper);
				document.getElementById("rebalancing_bot_no_coins_selected").style.display = "none";
			}
			const index_settings_wrapper = document.getElementById("rebalancing_bot_index_settings_wrapper");
			if(index_wrapper.children.length > 2) {
				index_settings_wrapper.style.display = "flex";
			}
			
		});

		coinDiv.append(img);
		coinDiv.append(coinNameDiv);
		rb_dropdown.appendChild(coinDiv);
	});
	} else {
		document.getElementById("rebalancing_bot_no_coins_selected").style.display = "block";
	}
}

async function rb_createIndexAssetCoinRow(coinName, allocation) {

	const coinDiv = document.createElement("div");
	coinDiv.classList.add("suggestion_wrapper");

	let img = document.createElement("img");
	img.setAttribute("src", `static/img/${coinName}.png`);
	img.setAttribute("loading", 'lazy');
	img.setAttribute("class", 'rebalancing_bot_suggestion_image');

	const coinNameDiv = document.createElement("div");
	coinNameDiv.classList.add("coin_name_div");
	coinNameDiv.textContent = coinName;
	
	coinDiv.append(img);
	coinDiv.append(coinNameDiv);

	const index_wrapper = document.getElementById("rebalancing_bot_index_wrapper");

	coinDiv.classList.add("selected_coin_wrapper");

	const allocationInput = document.createElement("input");
	allocationInput.setAttribute("data-bn-type", "input");
	allocationInput.setAttribute("placeholder", "Enter at least 10%");
	allocationInput.setAttribute("class", "rebalancing_bot_allocation_input");
	allocationInput.setAttribute("value", `${allocation}`);

	allocationInput.addEventListener("input", (event) => {
		let inputValue = event.target.value;
		inputValue = inputValue.replace(/[^0-9]/g, ""); // Remove non-numeric characters
		inputValue = Math.min(Math.max(parseInt(inputValue), 0), 100); // Restrict the value between 0 and 100
		event.target.value = inputValue;
	});
	coinDiv.appendChild(allocationInput);

	const percentDiv = document.createElement("div");
	percentDiv.classList.add("rebalancing_bot_percent");
	percentDiv.textContent = "%";
	coinDiv.appendChild(percentDiv);

	
	const removeButton = document.createElement("button");
	removeButton.classList.add("rebalancing_bot_remove_button");
	removeButton.textContent = "X";
	coinDiv.appendChild(removeButton);

	removeButton.addEventListener("click", () => {
		coinDiv.remove();
		if(index_wrapper.children.length == 2) {
			document.getElementById("rebalancing_bot_no_coins_selected").style.display = "block";
			document.getElementById("rebalancing_bot_index_settings_wrapper").style.display = "none";
		}
		
	});

	//add coin to and index
	index_wrapper.appendChild(coinDiv);
	document.getElementById("rebalancing_bot_no_coins_selected").style.display = "none";
}