
/**
 * Handler for Auto Invest table
 */

class AutoInvest {

	constructor(url) {
		this.url = url;
	}

	async displayAutoInvestTable() {
		try {
			let response = await fetch(this.url);
			response.json().then((r) => {
			this.createAutoInvestTable(r)
			});
		} catch (error) {
			console.log(error);
		}
	}

	async createAutoInvestTable(response) {

		let table = document.getElementById("auto_invest_table")
	
		let tr = document.createElement("tr");
		let name_td = document.createElement("td");
		let img_td = document.createElement("td");
		let interval_td = document.createElement("td");
		let profit_td = document.createElement("td");
	
		name_td.innerHTML = "Coin"
		profit_td.innerHTML = "APR"
		interval_td.innerHTML = "Duration(Days)"
	
		tr.appendChild(img_td)
		tr.appendChild(name_td)
		tr.appendChild(profit_td)
		tr.appendChild(interval_td)
		
		table.appendChild(tr)
	
		for(let i = 0; i < 10; i++) {
			this.addAutoInvestTableRow(response[i].asset, response[i].interval, response[i].profit , `${response[i].asset}.png`);
		}
	}

	async addAutoInvestTableRow(asset, interval, profit, imgname) {
	
		let table = document.getElementById("auto_invest_table")
	
		let tr = document.createElement("tr");
		let name_td = document.createElement("td");
		let img_td = document.createElement("td");
		let interval_td = document.createElement("td");
		let profit_td = document.createElement("td");
	
		name_td.innerHTML += asset.replace(/"/g,'')
		name_td.setAttribute("class", "info-label")
	
		let img = document.createElement("img");
		img.setAttribute("src", `static/img/${imgname}`);
		img.setAttribute("loading", 'lazy');
		img.setAttribute("class", 'pg4_table_img');
	
		img_td.appendChild(img)
		
		interval_td.innerHTML = interval
		interval_td.setAttribute("class", "interval")
	
		profit_td.innerHTML = `${profit} %`
		profit_td.setAttribute("class", "profit")
	
		tr.appendChild(img_td)
		tr.appendChild(name_td)
		tr.appendChild(profit_td)
		tr.appendChild(interval_td)
		
		table.appendChild(tr)
	}
}