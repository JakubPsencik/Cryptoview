/**
 * Handler for Rebalancing bot chart
 *
 */

const settings = {
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

charts = []

//Rebalance
document.getElementById("bn_rebalance").addEventListener("click", function () {

	//tady dostat ty coiny
	const coinWrapper = document.getElementById("rebalancing_bot_index_wrapper");

	// Get all child nodes
	var childNodes = coinWrapper.childNodes;

	var coins = [];
	var allocations = []

	for (var i = 5; i < childNodes.length; i++) {
		const indexRow = childNodes[i];

		const coinName = indexRow.childNodes[1].innerHTML;
		const coinAlloc = indexRow.childNodes[2].value;

		coins.push(coinName);
		allocations.push(coinAlloc);
	}
	
	const investment = document.getElementById("rebalance-investment").value;
	const selectElement = document.getElementById("rebalance-interval");
	const _interval = selectElement.options[selectElement.selectedIndex].value;
	const start_date = document.getElementById("rebalance-start-date").value;
	const end_date = document.getElementById("rebalance-end-date").value;

	var rebalanceIntervalOptionValue = "";


	rebalanceIntervalTimeOption = document.getElementById("rebalance-interval-time-option-radio-value");
	rebalanceIntervalPercentageOption = document.getElementById("rebalance-interval-percentage-option-radio-value");

	if (rebalanceIntervalTimeOption.checked) { rebalanceIntervalOptionValue = (document.getElementById("rebalance-interval-time-option")).value; } 
	else if (rebalanceIntervalPercentageOption.checked) { rebalanceIntervalOptionValue = (document.getElementById("rebalance-interval-percentage-option")).value; }

	var rebalance_url = "http://127.0.0.1:5000/rebalance?"
		+ "&investment=" + investment
		+ "&interval=" + _interval
		+ "&start=" + start_date
		+ "&end=" + end_date
		+ "&coins=" + coins
		+ "&allocations=" + allocations
		+ "&intervalOption=" + rebalanceIntervalOptionValue;
<<<<<<< HEAD

	console.log(rebalance_url);
=======
>>>>>>> main
	
	setRebalancePoints(rebalance_url);
});

async function setRebalancePoints(url) {

	const chartWrapper = document.getElementById("rebalancing_bot_chart_wrapper");
	while (chartWrapper.children.length > 1) {
		chartWrapper.removeChild(chartWrapper.lastChild);
	}

	try {
		let response = await fetch(url);
		response.json().then(async (points) => {
<<<<<<< HEAD
		console.log(points);
=======
>>>>>>> main
		for (let i = 0; i < points.length -1; i++) {
			
			var div = document.createElement("div");
			div.id = 'container11_' + i;

			div.classList.add("price-info-chart");
			chartWrapper.appendChild(div);

			const chart = LightweightCharts.createChart(div, settings);
			
			const candlestickSeries = chart.addCandlestickSeries({upColor: "green", downColor: "red"});

			candlestickSeries.setData(points[i]);
			
			chart.timeScale().setVisibleRange({
				from: points[i][0].time,
				to: points[i][points[i].length-1].time,
			});

			const idx = points.length - 1;
	
			var markers = []
			var marker = {}
			const increment = Math.round(points[idx].length / 5);
	
			//predelat aby pro kazdou series byly spravne markery
			//console.log(points[idx][0].coinAmounts);

			for(let j = 0; j < points[idx].length; j += points.length-1) {
				
				if(points[idx][j].Rebalance == 0) {
					marker = {
						id: String("rebalancePoint" + j),
						time: points[idx][j].timestamps[0] / 1000,
						position: 'belowBar',
						color: 'yellow',
						shape: 'circle',
						text: String(Math.round(points[idx][j].coinAmounts[i]) + '.0 $'),
						size: 0.5,
					};
				} else {
					marker = {
						id: String("rebalancePoint" + i),
						time: points[idx][j].timestamps[0] / 1000,
						position: 'aboveBar',
						color: 'red',
						shape: 'circle',
						text: String(Math.round(points[idx][j].coinAmounts[i]) + '.0 $'),
						size: 0.5,
					};
				}
				markers.push(marker);
				
				/*console.log(`${idx}, ${i}`);
				if(points[idx][i].Rebalance == 1) {
					console.log('creating marker');
					marker = {
						id: String("rebalancePoint" + i),
						time: points[idx][i].timestamps[0] / 1000,
						position: 'aboveBar',
						color: 'red',
						shape: 'circle',
						text: String(Math.round(points[idx][i].QuoteTotal) + '.0 $'),
						size: 0.5,
					};
	
					markers.push(marker);
				}*/
			}
			//console.log(markers)
			candlestickSeries.setMarkers(markers);

		}

		document.getElementById("rebalancing-info-div").innerHTML = 
		'<span style="color: red;">' 
		+ String(Math.round(points[points.length - 1][points[points.length - 1].length-1].QuoteTotal) +'.0 $') 
		+ '</span>';
	
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
	const rebalance_page_binance_index_asset = document.getElementById("rebalance_page_binance_index_asset");
	const rebalancing_bot_div = document.getElementById("rebalance_settings_div");
	const rebalance_binance_index_asset_main_div = document.getElementById("rebalance_binance_index_asset_main_div");

	rebalance_binance_index_asset_main_div.style.display = "block";

	rebalance_page_binance_index_asset.style.display = "block";
	rebalance_page_binance_index_asset.style.zIndex = "998";

	rebalancing_bot_div.style.display = "none";
});

document.getElementById("rebalance_binance_index_asset_cancel_button").addEventListener("click", () => {
	const page_binance_index_asset = document.getElementById("rebalance_page_binance_index_asset");
	page_binance_index_asset.style.display = "none";

	const rebalancing_bot_div = document.getElementById("rebalance_settings_div");
	rebalancing_bot_div.style.display = "block";

	const rebalance_binance_index_asset_main_div = document.getElementById("rebalance_binance_index_asset_main_div");

	rebalance_binance_index_asset_main_div.style.display = "none";
});

const rb_selected_coins_in_index_wrapper = document.getElementById("rebalancing_bot_index_wrapper");

if (rb_selected_coins_in_index_wrapper.children.length > 2) {
	const index_settings_wrapper = document.getElementById("rebalancing_bot_index_settings_wrapper");
	index_settings_wrapper.style.display = "flex";
}

rb_input.addEventListener("input", () => {
	rbFilterSuggestions(rb_input.value);
});

async function rbFilterSuggestions(inputValue) {
	const filteredSuggestions =  products.filter((suggestion) => {
	  return suggestion.toLowerCase().startsWith(inputValue.toLowerCase());
	});

	rbDisplaySuggestions(filteredSuggestions);
}

function rbDisplaySuggestions(suggestionsList) {
	rb_dropdown.innerHTML = "";

	if(suggestionsList.length == products.length) { 
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
					allocationInput.setAttribute("value", `${inputValue}`);
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
		allocationInput.setAttribute("value", `${inputValue}`);
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