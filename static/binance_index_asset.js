async function displayBinanceIndexAssetData(url) {

	const divsToRender = 1;
	var divsRenderedCounter = 0;
	var indexAssetRowDivNumber = 1;

	try {
		
		let response = await fetch(url);
		response.json().then(async (data) => {
			//console.log(data)
			//<div id="binance_index_asset_row_div_1" class="binance_index_asset_row_div"></div>

			var divName = `binance_index_asset_row_div_${indexAssetRowDivNumber}`
			var div = document.createElement('div');
			div.id = divName
			div.classList.add("binance_index_asset_row_div");
			document.getElementById("binance_index_asset_main_div").appendChild(div);
			indexAssetRowDivNumber += 1;
			for (let i = 0; i < data.length; i++) {

				createAssetDiv(data[i], div);
				divsRenderedCounter += 1;

				if(divsRenderedCounter == divsToRender) {
					div = document.createElement('div');
					divName = `binance_index_asset_row_div_${indexAssetRowDivNumber}`;
					div.id = divName
					div.classList.add("binance_index_asset_row_div");
					document.getElementById("binance_index_asset_main_div").appendChild(div);
					divsRenderedCounter = 0;
					indexAssetRowDivNumber += 1;
				}
			}
		});

	} catch (error) {
		console.log("error in: binance_index_asset.js")
		console.log(error);
	}
}

async function createAssetDiv(data, parentDiv) {
	//console.log(data);
	//main div
	const div = document.createElement('div');
	div.classList.add("binance_index_asset_div");
	// name of index
	const nameDiv = document.createElement('div');
	nameDiv.innerHTML = data.name
	nameDiv.classList.add("binance_index_asset_name_div");

	nameDiv.addEventListener("click", () => {
	
		const index_wrapper = document.getElementById("auto_invest_calc_index_wrapper");
		if(index_wrapper.children.length > 2) {
			while (index_wrapper.children.length > 2) {
				index_wrapper.removeChild(index_wrapper.lastChild);
			}
			
		}

		if(data.coins.length < 11) {
			for(let i = 0; i < data.coins.length; i++) {
				createIndexAssetCoinRow(data.coins[i].coin, parseFloat(data.coins[i].allocation)*100);
			}
			const page_binance_index_asset = document.getElementById("page_binance_index_asset");
			page_binance_index_asset.style.display = "none";

			const auto_invest_calc_div = document.getElementById("auto_invest_calc_div");
			auto_invest_calc_div.style.display = "block";

			const index_settings_wrapper = document.getElementById("auto_invest_calc_index_settings_wrapper");
			index_settings_wrapper.style.display = "flex";
			
		} else {
			alert("Index too large, please select another index.");
		}
		
	});

	//coin allocated in index
	const coinsDiv = document.createElement('div');
	coinsDiv.classList.add("binance_index_asset_coins_div");

	var counter = data.coins.length;
	var moreDiv;
	if(data.coins.length > 5) {
		counter = 5;
		moreDiv = document.createElement('div');
		moreDiv.classList.add("moreDiv");
		moreDiv.innerHTML = `+ ${data.coins.length - 5}`
	}


	for(let i = 0; i < counter; i++) {
		let coinDiv = document.createElement('div');
		const imgName = data.coins[i].coin + ".png";
		let img = document.createElement("img");
		img.setAttribute("src", `static/img/${imgName}`);
		img.setAttribute("loading", 'lazy');
		img.setAttribute("class", 'pg4_table_img');
		//img.classList.add("binance_index_asset_coin_img");

		coinDiv.append(img)

		coinsDiv.appendChild(coinDiv);
		if(i == counter-1 && moreDiv != undefined) {
			coinsDiv.append(moreDiv)
		}
	}

	const viewAllocationsDiv = document.createElement('div');
	viewAllocationsDiv.classList.add("binance_index_asset_view_allocation_div");

	let allocationButton = document.createElement("button");
	allocationButton.classList.add("binance_index_asset_view_allocation_button");

	allocationButton.innerHTML = "Allocation";

	allocationButton.onclick = async function() {
		let allocationDetailsDiv = document.createElement("div");
		allocationDetailsDiv.classList.add("binance_index_asset_allocation_details_div");

		const labelDiv = document.createElement('div');
		labelDiv.innerHTML = "Portfolio Allocation";
		labelDiv.classList.add("binance_index_asset_portfolio_allocation_label");
		allocationDetailsDiv.appendChild(labelDiv);

		const spaceDiv = document.createElement('div');
		spaceDiv.classList.add("binance_index_asset_portfolio_allocation_space_div");

		allocationDetailsDiv.appendChild(spaceDiv);
		
		
		for(let i = 0; i < data.coins.length; i++) {
			const imgName = data.coins[i].coin + ".png";
			let img = document.createElement("img");
			img.setAttribute("src", `static/img/${imgName}`);
			img.setAttribute("loading", 'lazy');
			img.setAttribute("class", 'pg4_table_img');
			//img.classList.add("binance_index_asset_coin_img");
			
			const coinAllocDetailDiv = document.createElement('div');
			coinAllocDetailDiv.classList.add("binance_index_asset_Allocation_detail_row");
			
			coinAllocDetailDiv.appendChild(img);
			const nameDiv = document.createElement('div');
			nameDiv.innerHTML = data.coins[i].coin;
		
			coinAllocDetailDiv.appendChild(nameDiv);

			try {
		
				let response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${data.coins[i].coin}USDT`);
				response.json().then(async (r) => {
					const price = parseFloat(r.price).toFixed(4);
					const exchangeRateDiv = document.createElement('div');
					exchangeRateDiv.innerHTML = `${price} USDT`;
					coinAllocDetailDiv.appendChild(exchangeRateDiv);
				});
		
			} catch (error) {
				
			};
		
			const allocationDiv = document.createElement('div');
			let allocValue = parseFloat(data.coins[i].allocation) * 100;
			allocationDiv.innerHTML =  allocValue + " %";
		
			coinAllocDetailDiv.appendChild(allocationDiv);
			
			allocationDetailsDiv.append(coinAllocDetailDiv);
		}

		// Create an overlay
		let overlay = document.createElement("div");
		overlay.classList.add("overlay");

		// Create a cancel button
		let cancelButton = document.createElement("span");
		cancelButton.innerHTML = "Cancel";
		cancelButton.classList.add("binance_index_asset_view_allocation_cancel_button");

		// Add an onclick event to the cancel button
		cancelButton.onclick = function() {
			// Hide the div when cancel is clicked
			overlay.remove();
			allocationDetailsDiv.remove();
		};

		// Append the cancel button to the div
		allocationDetailsDiv.appendChild(cancelButton);

		// Append the div to the document or a specific element
		document.getElementById("page_auto_invest_calc").appendChild(overlay);
		document.getElementById("page_auto_invest_calc").appendChild(allocationDetailsDiv);
	};

	viewAllocationsDiv.appendChild(allocationButton);
	
	let detailButton = document.createElement("button");
	detailButton.classList.add("binance_index_asset_view_detail_button");

	detailButton.innerHTML = "Show detail";

	detailButton.onclick = async function() {
		let indexDetailsDiv = document.createElement("div");
		indexDetailsDiv.classList.add("binance_index_asset_index_details_div");

		const labelDiv = document.createElement('div');
		labelDiv.innerHTML = "Index Detail";
		labelDiv.classList.add("binance_index_asset_portfolio_allocation_label");
		indexDetailsDiv.appendChild(labelDiv);

		/* implementovat funk */
		createInfoDivs(indexDetailsDiv, data);

		// Create an overlay
		let overlay = document.createElement("div");
		overlay.classList.add("overlay");

		// Create a cancel button
		let cancelButton = document.createElement("span");
		cancelButton.innerHTML = "Cancel";
		cancelButton.classList.add("binance_index_asset_view_allocation_cancel_button");

		// Add an onclick event to the cancel button
		cancelButton.onclick = function() {
			// Hide the div when cancel is clicked
			overlay.remove();
			indexDetailsDiv.remove();
		};

		// Append the cancel button to the div
		indexDetailsDiv.appendChild(cancelButton);

		// Append the div to the document or a specific element
		document.getElementById("page_auto_invest_calc").appendChild(overlay);
		document.getElementById("page_auto_invest_calc").appendChild(indexDetailsDiv);
	};

	viewAllocationsDiv.appendChild(detailButton);

	let priceTrendChartButton = document.createElement("button");
	priceTrendChartButton.classList.add("binance_index_asset_view_price_trend_button");

	priceTrendChartButton.innerHTML = "Price Trend";

	priceTrendChartButton.onclick = async function() {
		let indexDetailsDiv = document.createElement("div");
		indexDetailsDiv.classList.add("binance_index_asset_index_details_div");

		const labelDiv = document.createElement('div');
		labelDiv.innerHTML = "Price Visualization";
		labelDiv.classList.add("binance_index_asset_portfolio_allocation_label");
		indexDetailsDiv.appendChild(labelDiv);

		/* implementovat funk */
		//createInfoDivs(indexDetailsDiv, data);
		const chartdivWrapper = document.createElement('div');
		chartdivWrapper.classList.add("binance_index_asset_getPriceTrendDataWrapper");

		data.coins.forEach(async coin => {
			try {
				let result = await getPriceTrendData(chartdivWrapper, coin, `http://127.0.0.1:5000/getData?&symbol=${coin.coin}EUR`, true);
				if(result == -1) {
					await getPriceTrendData(chartdivWrapper, coin, `http://127.0.0.1:5000/getData?&symbol=${coin.coin}USDT`, false);
				}
			} catch (error) {
				console.log(error);
			}
		});

		indexDetailsDiv.appendChild(chartdivWrapper);

		// Create an overlay
		let overlay = document.createElement("div");
		overlay.classList.add("overlay");

		// Create a cancel button
		let cancelButton = document.createElement("span");
		cancelButton.innerHTML = "Cancel";
		cancelButton.classList.add("binance_index_asset_view_allocation_cancel_button");

		// Add an onclick event to the cancel button
		cancelButton.onclick = function() {
			// Hide the div when cancel is clicked
			overlay.remove();
			indexDetailsDiv.remove();
		};

		// Append the cancel button to the div
		indexDetailsDiv.appendChild(cancelButton);

		// Append the div to the document or a specific element
		document.getElementById("page_auto_invest_calc").appendChild(overlay);
		document.getElementById("page_auto_invest_calc").appendChild(indexDetailsDiv);
	};

	viewAllocationsDiv.appendChild(priceTrendChartButton);

	div.appendChild(nameDiv);
	div.appendChild(coinsDiv);
	div.appendChild(viewAllocationsDiv);

	parentDiv.appendChild(div);
}

async function getPriceTrendData(div, coin, url, coinIsTradedAgainstEuro) {
 
	try {
		let response = await fetch(url);
		if(response.status == 500) {
			return -1;
		}
		response.json().then(async (points) => {

			const chartDiv = document.createElement('div');
			chartDiv.classList.add("binance_index_asset_getPriceTrendData");

			let img = document.createElement("img");
			img.setAttribute("src", `static/img/${coin.coin}.png`);
			img.setAttribute("loading", 'lazy');
			img.setAttribute("class", 'pg4_table_img');
			//img.classList.add("binance_index_asset_coin_img");

			const labelDiv = document.createElement('div');
			labelDiv.append(img);
			const quoteCurrency = coinIsTradedAgainstEuro ? "EUR" : "USDT";
			labelDiv.innerHTML += `<span style="margin-left: 10px"></span><strong>${coin.coin} (${quoteCurrency})</strong>`;
			div.appendChild(labelDiv);

			chartData = points.slice(0, (points.length-2));
			
			var chart = LightweightCharts.createChart(chartDiv);
			chart.applyOptions(_options);
			const lineSeries = chart.addLineSeries({});
			lineSeries.applyOptions({
				type: "line",
				color: "red", // Set the line color to red
				lineWidth: 2,
				autoSize: true,
				timeScale: {
					timeVisible: true,  // Display time on the time scale
					secondsVisible: false,  // Do not display seconds
				}, // Set the line width to 2 pixels
			});
			lineSeries.setData(chartData);
			
			// Zoom out the candlestick series to a specific time range.
			chart.timeScale().setVisibleRange({
				from: chartData[0].time,
				to: chartData[chartData.length-1].time,
			});
			
			//setEwIndexTableContent(`${coin}EUR`, points);
			div.appendChild(chartDiv);

	});
		
	} catch (error) {
		console.log(error);
		return null;
	}
}

async function createInfoDivs(indexDetailsDiv, data) {

	const infoDiv1 = document.createElement('div');
	infoDiv1.id = `binance_index_asset_index_detailsInfoDiv1`;
	infoDiv1.innerHTML = `<strong>Minute</strong> investing`;
	infoDiv1.classList.add("binance_index_asset_index_detailsInfoDiv");
	await fillInfoDivWithIndexStatistics(infoDiv1, data.indexLabel, "minute");

	data.coins.forEach(coin => {
		fillInfoDivWithCoinStatistics_Minute(infoDiv1, coin.coin);
	});

	const infoDiv2 = document.createElement('div');
	infoDiv2.id = `binance_index_asset_index_detailsInfoDiv2`;
	infoDiv2.innerHTML = `<strong>Hour</strong> investing`;
	infoDiv2.classList.add("binance_index_asset_index_detailsInfoDiv");
	await fillInfoDivWithIndexStatistics(infoDiv2, data.indexLabel, "hour");

	data.coins.forEach(coin => {
		fillInfoDivWithCoinStatistics_Hour(infoDiv2, coin.coin);
	});

	const wrapper1 = document.createElement('div');
	wrapper1.classList.add("binance_index_asset_index_detailsInfoDivWrapper");

	wrapper1.appendChild(infoDiv1);
	wrapper1.appendChild(infoDiv2);

	const infoDiv3 = document.createElement('div');
	infoDiv3.id = `binance_index_asset_index_detailsInfoDiv3`;
	infoDiv3.innerHTML = `<strong>Week</strong> investing`;
	infoDiv3.classList.add("binance_index_asset_index_detailsInfoDiv");
	await fillInfoDivWithIndexStatistics(infoDiv3, data.indexLabel, "week");

	data.coins.forEach(coin => {
		fillInfoDivWithCoinStatistics_Week(infoDiv3, coin.coin);
	});

	const infoDiv4 = document.createElement('div');
	infoDiv4.id = `binance_index_asset_index_detailsInfoDiv4`;
	infoDiv4.innerHTML = `<strong>Month</strong> investing`;
	infoDiv4.classList.add("binance_index_asset_index_detailsInfoDiv");
	await fillInfoDivWithIndexStatistics(infoDiv4, data.indexLabel, "month");

	data.coins.forEach(coin => {
		fillInfoDivWithCoinStatistics_Month(infoDiv4, coin.coin);
	});
/*
	data.coins.forEach(() => async function(coin) {
		await fillInfoDivWithCoinStatistics(infoDiv4, coin.coin);
	});*/

	const wrapper2 = document.createElement('div');
	wrapper2.classList.add("binance_index_asset_index_detailsInfoDivWrapper");

	wrapper2.appendChild(infoDiv3);
	wrapper2.appendChild(infoDiv4);

	indexDetailsDiv.appendChild(wrapper1);
	indexDetailsDiv.appendChild(wrapper2);

}

async function fillInfoDivWithCoinStatistics_Minute(div, coin) {
	
	var labelRendered = false;
	const url = `http://127.0.0.1:5000/binanceIndexAssetRecommendMinute?&queryParam="${coin}"`;
	console.log(url);
	try {
		
		let response = await fetch(url);
		response.json().then(async (data) => {
			console.log(data)

			data.forEach(record => {
				if(!labelRendered) {

					let img = document.createElement("img");
					img.setAttribute("src", `static/img/${coin}.png`);
					img.setAttribute("loading", 'lazy');
					img.setAttribute("class", 'pg4_table_img');
					//img.classList.add("binance_index_asset_coin_img");

					const labelDiv = document.createElement('div');
					labelDiv.classList.add("img-wrapper");
					labelDiv.append(img);
					div.appendChild(labelDiv);
					labelRendered = true;
				}

				const recommendDataDiv = document.createElement("div");
				recommendDataDiv.classList.add("binance_index_asset_index_recom_all_recomendCoinDataDiv");

				recommendDataDiv.innerHTML = `
				<strong>${record.year  == "9999" ? "2022 - 2024" : record.year}</strong> <label style="width: 10px"></label> ${record.amount.toFixed(5)} ${record.asset_label} | trades: ${record.num_of_trades} | close: ${record.close_eur} € | profit: ${record.amount_eur.toFixed(2)} € ( ${record.profit.toFixed(2)} %) <br>
				`;
				div.appendChild(recommendDataDiv);
			});

		});

	} catch (error) {
		console.log("error in: binance_index_asset.js")
		console.log(error);
	}
}

async function fillInfoDivWithCoinStatistics_Hour(div, coin) {
	
	var labelRendered = false;
	const url = `http://127.0.0.1:5000/binanceIndexAssetRecommendHour?&queryParam="${coin}"`;
	console.log(url);
	try {
		
		let response = await fetch(url);
		response.json().then(async (data) => {
			console.log(data)

			data.forEach(record => {
				if(!labelRendered) {

					let img = document.createElement("img");
					img.setAttribute("src", `static/img/${coin}.png`);
					img.setAttribute("loading", 'lazy');
					img.setAttribute("class", 'pg4_table_img');
					//img.classList.add("binance_index_asset_coin_img");

					const labelDiv = document.createElement('div');
					labelDiv.classList.add("img-wrapper");
					labelDiv.append(img);
					div.appendChild(labelDiv);
					labelRendered = true;
				}

				const recommendDataDiv = document.createElement("div");
				recommendDataDiv.classList.add("binance_index_asset_index_recom_all_recomendCoinDataDiv");

				recommendDataDiv.innerHTML = `
				<strong>${record.year  == "9999" ? "2022 - 2024" : record.year}</strong> <label style="width: 10px"></label> ${record.amount.toFixed(5)} ${record.asset_label} | trades: ${record.num_of_trades} | close: ${record.close_eur} € | profit: ${record.amount_eur.toFixed(2)} € ( ${record.profit.toFixed(2)} %) <br>
				`;
				div.appendChild(recommendDataDiv);
			});

		});

	} catch (error) {
		console.log("error in: binance_index_asset.js")
		console.log(error);
	}
}

async function fillInfoDivWithCoinStatistics_Week(div, coin) {
	
	var labelRendered = false;
	const url = `http://127.0.0.1:5000/binanceIndexAssetRecommendWeek?&queryParam="${coin}"`;
	console.log(url);
	try {
		
		let response = await fetch(url);
		response.json().then(async (data) => {
			console.log(data)

			data.forEach(record => {
				if(!labelRendered) {

					let img = document.createElement("img");
					img.setAttribute("src", `static/img/${coin}.png`);
					img.setAttribute("loading", 'lazy');
					img.setAttribute("class", 'pg4_table_img');
					//img.classList.add("binance_index_asset_coin_img");

					const labelDiv = document.createElement('div');
					labelDiv.classList.add("img-wrapper");
					labelDiv.append(img);
					div.appendChild(labelDiv);
					labelRendered = true;
				}

				const recommendDataDiv = document.createElement("div");
				recommendDataDiv.classList.add("binance_index_asset_index_recom_all_recomendCoinDataDiv");

				recommendDataDiv.innerHTML = `
				<strong>${record.year  == "9999" ? "2022 - 2024" : record.year}</strong> <label style="width: 10px"></label> ${record.amount.toFixed(5)} ${record.asset_label} | trades: ${record.num_of_trades} | close: ${record.close_eur} € | profit: ${record.amount_eur.toFixed(2)} € ( ${record.profit.toFixed(2)} %) <br>
				`;
				div.appendChild(recommendDataDiv);
			});

		});

	} catch (error) {
		console.log("error in: binance_index_asset.js")
		console.log(error);
	}
}

async function fillInfoDivWithCoinStatistics_Month(div, coin) {
	
	var labelRendered = false;
	const url = `http://127.0.0.1:5000/binanceIndexAssetRecommendMonth?&queryParam="${coin}"`;
	console.log(url);
	try {
		
		let response = await fetch(url);
		response.json().then(async (data) => {
			console.log(data)

			data.forEach(record => {
				if(!labelRendered) {

					let img = document.createElement("img");
					img.setAttribute("src", `static/img/${coin}.png`);
					img.setAttribute("loading", 'lazy');
					img.setAttribute("class", 'pg4_table_img');
					//img.classList.add("binance_index_asset_coin_img");

					const labelDiv = document.createElement('div');
					labelDiv.classList.add("img-wrapper");
					labelDiv.append(img);
					div.appendChild(labelDiv);
					labelRendered = true;
				}

				const recommendDataDiv = document.createElement("div");
				recommendDataDiv.classList.add("binance_index_asset_index_recom_all_recomendCoinDataDiv");

				recommendDataDiv.innerHTML = `
				<strong>${record.year  == "9999" ? "2022 - 2024" : record.year}</strong> <label style="width: 10px"></label> ${record.amount.toFixed(5)} ${record.asset_label} | trades: ${record.num_of_trades} | close: ${record.close_eur} € | profit: ${record.amount_eur.toFixed(2)} € ( ${record.profit.toFixed(2)} %) <br>
				`;
				div.appendChild(recommendDataDiv);
			});

		});

	} catch (error) {
		console.log("error in: binance_index_asset.js")
		console.log(error);
	}
}

async function fillInfoDivWithIndexStatistics(div, indexLabel, interval) {

	const url = `http://127.0.0.1:5000/binanceIndexRecommend?&indexName="${indexLabel}"&minute="${interval}"`;

	try {
		
		let response = await fetch(url);
		response.json().then(async (data) => {
			//console.log(data)
			const recommendDataDiv = document.createElement("div");
			recommendDataDiv.classList.add("binance_index_asset_index_recom_all_recomendDataDiv");

			recommendDataDiv.innerHTML = `
			<strong>${data[2].year == "9999" ? "2022 - 2024" : data[2].year}</strong> <label style="width: 10px"></label> invested:   ${data[2].invested} € | profit: ${data[2].profitEur.toFixed(2)} € ( ${data[2].profit.toFixed(2)} %) <br>
			`;

			div.appendChild(recommendDataDiv);
		});

	} catch (error) {
		console.log("error in: binance_index_asset.js")
		console.log(error);
	}
}