async function getClose(url, rebalanceUrl) {
	
	//HODL & DCA
	try {
		let response = await fetch(url);
		response.json().then((r) => {
			console.log(r);
			const hodlDiv = document.getElementById('binance_cmc_ew_index_recommend_main_div_1');
			const dcaDiv = document.getElementById('binance_cmc_ew_index_recommend_main_div_2');

			dcaData = r[r.length - 3];
			hodlData = r[r.length - 1];

			createGetCloseTable(dcaData, "dca_table");
			createGetCloseTable(hodlData, "hodl_table");

		});

		
	} catch (error) {
		console.log(error);
	}

	//Rebalance
	try {
		let response = await fetch(rebalanceUrl);
		response.json().then(async (points) => {
		console.log(points);
		const dcaDiv = document.getElementById('binance_cmc_ew_index_recommend_main_div_3');
		//createGetCloseTable(rebalanceData, "rebalance_table");
		
		let startData = points[points.length - 1][0];
		let endData = points[points.length - 1][points[points.length - 1].length - 1];
		
		data = [];

		for(let i = 0; i < startData.coinAmounts.length; i++) {
			data.push([
				"",
				startData.coinAmounts[i],
				endData.coinAmounts[i],
				(endData.coinAmounts[i] - startData.coinAmounts[i]),
			]);
		}
		/*
		QuoteTotal
		: 
		623.9868146423333
		Rebalance
		: 
		0
		coinAmounts
		: 
		(2) [321.0752275413413, 302.91158710099205]
		timestamps
		: 
		(2) [1713056400000, 1713056400000]
		*/
		console.log(data);

		createGetCloseTable(data, "rebalance_table");
	
	});

	} catch (error) {
		console.log(error);
	}
}

async function createGetCloseTable(data, tableName) {

	let table = document.getElementById(tableName)
	table.innerHTML = "";

	let tr = document.createElement("tr");
	let name_td = document.createElement("td");
	let invested_td = document.createElement("td");
	let balance_td = document.createElement("td");
	let profit_td = document.createElement("td");

	name_td.innerHTML = "Coin"
	invested_td.innerHTML = "Invested"
	profit_td.innerHTML = "Profit"
	balance_td.innerHTML = "Balance"

	tr.appendChild(name_td)
	tr.appendChild(invested_td)
	tr.appendChild(balance_td)
	tr.appendChild(profit_td)

	
	table.appendChild(tr)

	for(let i = 0; i < data.length; i++) {
		this.addGetCloseDcaTableRow(tableName, data[i][0], data[i][1], data[i][2], data[i][3]);
	}

	tr = document.createElement("tr");
	tr.style.borderTop = "1px dashed";
	let fill_td = document.createElement("td");
	let invested_total_td = document.createElement("td");
	let balance_total_td = document.createElement("td");
	let profit_total_td = document.createElement("td");

	fill_td.innerHTML = "Total: ";
	sum = 0;
	data.forEach(d => {
		sum += d[1];
	});

	invested_total_td.innerHTML = sum.toFixed(2) + " $"

	sum = 0;
	data.forEach(d => {
		sum += d[2];
	});
	
	balance_total_td.innerHTML = sum.toFixed(2) + " $"

	sum = 0;
	data.forEach(d => {
		sum += d[3];
	});

	if(sum > 0) {
		profit_total_td.innerHTML =  "+ " + sum.toFixed(2) + " $"
		profit_total_td.style.color = "limegreen";
	} else if(sum < 0) {
		profit_total_td.innerHTML =  sum.toFixed(2) + " $"
		profit_total_td.style.color = "red";
	} else {
		profit_total_td.innerHTML =  sum.toFixed(2) + " $"
	}
	


	tr.appendChild(fill_td)
	tr.appendChild(invested_total_td)
	tr.appendChild(balance_total_td)
	tr.appendChild(profit_total_td)

	table.appendChild(tr);
}

async function addGetCloseDcaTableRow(tableName, coinName, invested, balance, profit) {

	let table = document.getElementById(tableName)

	let tr = document.createElement("tr");
	let name_td = document.createElement("td");
	let invested_td = document.createElement("td");
	let balance_td = document.createElement("td");
	let profit_td = document.createElement("td");

	name_td.innerHTML = coinName
	name_td.setAttribute("class", "info-label")

	invested_td.innerHTML = invested + ' $'
	invested_td.setAttribute("class", "info-label")
	
	balance_td.innerHTML = `${balance.toFixed(2)} $`
	balance_td.setAttribute("class", "interval")

	profit_td.innerHTML = `${profit.toFixed(2)} $`
	profit_td.setAttribute("class", "profit")

	tr.appendChild(name_td)
	tr.appendChild(invested_td)
	tr.appendChild(balance_td)
	tr.appendChild(profit_td)

	
	table.appendChild(tr)
}