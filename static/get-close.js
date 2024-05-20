async function getClose(url, rebalanceUrl, coinNames) {
	
	//HODL & DCA
	try {
		let response = await fetch(url);
		response.json().then((r) => {
			console.log(r);

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
	
		
		let startData = points[points.length - 1][0];
		let endData = points[points.length - 1][points[points.length - 1].length - 1];
		
		data = [];
		
		for(let i = 0; i < startData.coinAmounts.length; i++) {
			data.push([
				coinNames[i],
				parseFloat(startData.coinAmounts[i]).toFixed(2),
				parseFloat(endData.coinAmounts[i]).toFixed(2),
				(parseFloat(endData.coinAmounts[i]).toFixed(2) - parseFloat(startData.coinAmounts[i]).toFixed(2)),
			]);
		}

		createGetCloseTable(data, "rebalance_table");
	
	});

	} catch (error) {
		console.log(error);
	}
}

async function createGetCloseTable(data, tableName) {
	console.log(tableName , data);
	let table = document.getElementById(tableName)
	table.innerHTML = "";

	let tr = document.createElement("tr");
	let img_td = document.createElement("td");
	let name_td = document.createElement("td");
	let invested_td = document.createElement("td");
	let balance_td = document.createElement("td");
	let profit_td = document.createElement("td");

	img_td.classList.add("custom-tr");
	name_td.classList.add("custom-tr");
	invested_td.classList.add("custom-tr");
	balance_td.classList.add("custom-tr");
	profit_td.classList.add("custom-tr");


	name_td.innerHTML = "Coin"
	invested_td.innerHTML = "Invested"
	profit_td.innerHTML = "Profit"
	balance_td.innerHTML = "Balance"

	tr.appendChild(img_td)
	tr.appendChild(name_td)
	tr.appendChild(invested_td)
	tr.appendChild(balance_td)
	tr.appendChild(profit_td)

	
	table.appendChild(tr)

	tr = document.createElement("tr");
	tr.style.borderTop = "1px dashed";
	tr.style.marginTop = "1rem";
	tr.classList.add("custom-tr");
	let fill_td = document.createElement("td");
	let invested_total_td = document.createElement("td");
	let balance_total_td = document.createElement("td");
	let profit_total_td = document.createElement("td");

	fill_td.innerHTML = "Total: ";
	sum = 0;
	data.forEach(d => {
		sum += parseFloat(d[1]);
	});

	invested_total_td.innerHTML = parseFloat(sum).toFixed(2) + " $"

	sum = 0;
	data.forEach(d => {
		sum += parseFloat(d[2]);
	});
	const balance_total = sum;
	balance_total_td.innerHTML = parseFloat(sum).toFixed(2) + " $"

	sum = 0;
	data.forEach(d => {
		sum += parseFloat(d[3]);
	});

	profit_total_percentage = parseFloat((sum / balance_total) * 100).toFixed(2);
	
	console.log(profit_total_percentage);

	if(sum > 0) {
		profit_total_td.innerHTML =  "+ " + parseFloat(sum).toFixed(2) + " $" + " (" + profit_total_percentage + " %)";
		profit_total_td.style.color = "limegreen";
	} else if(sum < 0) {
		profit_total_td.innerHTML =  parseFloat(sum).toFixed(2) + " $" + " (" + profit_total_percentage + " %)";
		profit_total_td.style.color = "red";
	} else {
		profit_total_td.innerHTML =  parseFloat(sum).toFixed(2) + " $" + " (" + profit_total_percentage + " %)";
	}

	tr.appendChild(document.createElement("td"));
	tr.appendChild(fill_td);
	tr.appendChild(invested_total_td);
	tr.appendChild(balance_total_td);
	tr.appendChild(profit_total_td);

	table.appendChild(tr);

	for(let i = 0; i < data.length; i++) {
		this.addGetCloseDcaTableRow(tableName, data[i][0], parseFloat(data[i][1]).toFixed(2), parseFloat(data[i][2]).toFixed(2), parseFloat(data[i][3]).toFixed(2));
	}
}

async function addGetCloseDcaTableRow(tableName, coinName, invested, balance, profit) {

	let table = document.getElementById(tableName)

	let tr = document.createElement("tr");
	let img_td = document.createElement("td");
	let name_td = document.createElement("td");
	let invested_td = document.createElement("td");
	let balance_td = document.createElement("td");
	let profit_td = document.createElement("td");

	name_td.innerHTML = coinName
	name_td.setAttribute("class", "custom-tr")

	let img = document.createElement("img");
	img.setAttribute("src", `static/img/${coinName}.png`);
	img.setAttribute("loading", 'lazy');
	img.setAttribute("class", 'pg4_table_img');

	img_td.appendChild(img)

	invested_td.innerHTML = invested + ' $'
	invested_td.setAttribute("class", "custom-tr")
	
	balance_td.innerHTML = `${balance} $`
	balance_td.setAttribute("class", "custom-tr")

	profit_td.innerHTML = `${profit} $`
	profit_td.setAttribute("class", "custom-tr")

	tr.appendChild(img_td)
	tr.appendChild(name_td)
	tr.appendChild(invested_td)
	tr.appendChild(balance_td)
	tr.appendChild(profit_td)

	
	table.appendChild(tr)
}