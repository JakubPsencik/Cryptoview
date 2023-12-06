/**
 * Handler for Top 10! table
 *
 */

async function displayTop10(url) {
	
	var colors = 
	["#493657","#4C9141","#F80000","#F39F18","#7BE0AD"
	,"#C51D34","#89AC76","#354D73","#256D7B","#BEE5BF"
	,"#DFF3E3","#FFD1BA","#44CFCB","#4EA5D9","#2A4494"
	,"#224870","#122C34","#EA899A","#EAE6CA","#C1876B"]
	
	try {
		//OUR TOP...! page
		let response = await fetch(url);
		response.json().then(async (r) => {
			//console.log("top 10 table initialized...");
			//if not swapped, dates are backwards
			//r.reverse();
			pair_names = r[r.length-2]
			//console.log(pair_names)
			//console.log(r)
			let markers = await checkViewData(r)
			//console.log(markers)
			arr = r.slice(2,22)
			var compound = []
			var fixed = []
			for(let i = 0; i < arr.length; i++) {
				compound.push(arr[i].compound_interest_total_in_eur);
				fixed.push(arr[i].fixed_deposit_total_in_eur)
			}
			
			BuildTablePG2(pair_names, compound, fixed, markers, ["jasmy.png", "pha.png", "btc.png"], "pg2_table")

		});

	} catch (error) {
		console.log("error in: displayPriceChartsDataPage4")
		console.log(error);
	}
}


async function BuildTablePG2(names, compound, fixed, markers, imgnames, tableName) {

	//console.log(markers)
	let table = document.getElementById(tableName)

	let tr = document.createElement("tr");
	let name_td = document.createElement("td");
	let img_td = document.createElement("td");
	let compound_td = document.createElement("td");
	let fixed_td = document.createElement("td");
	let daily = document.createElement("td");
	let weekly = document.createElement("td");
	let monthly = document.createElement("td");

	name_td.innerHTML = "Pair"
	compound_td.innerHTML = "Compound Interest"
	fixed_td.innerHTML = "Fixed Deposit"
	daily.innerHTML = "In daily"
	weekly.innerHTML = "In weekly"
	monthly.innerHTML = "In monthly"

	tr.appendChild(img_td)
	tr.appendChild(name_td)
	tr.appendChild(compound_td)
	tr.appendChild(fixed_td)
	tr.appendChild(daily)
	tr.appendChild(weekly)
	tr.appendChild(monthly)

	table.appendChild(tr)
	let counter = 0;
	for(let i = 0; i < 10; i++) {
		
		AddTableRowPG2(markers[i].name, compound[i], fixed[i], [markers[i].daily,markers[i].weekly,markers[i].monthly], imgnames[counter], tableName)
		counter+=1;
		if(counter == 3) {
			counter = 0
		}
	}

}

async function checkViewData(response) {
	
	var daily = response[1];
	var weekly = response[23];
	var monthly = response[45];
	var markers = [];

	// Loop through each string value in array1
	for (let i = 0; i < daily.length; i++) {
		const currentValue = daily[i];

		const valDaily = "check.png";
		
		// Check if currentValue is present in array2 and array3
		if (weekly.includes(currentValue)) { valWeekly = "check.png" }
		else { valWeekly = "cross.svg"; }
			
		if (monthly.includes(currentValue)) { valMonthly = "check.png" }
		else { valMonthly = "cross.svg"; }

		currentMarkerRow = {
			"name": currentValue,
			"daily": valDaily,
			"weekly": valWeekly,
			"monthly": valMonthly,
		}

		markers.push(currentMarkerRow)
	}

	return markers;
}

async function AddTableRowPG2(name, compound, fixed, markers, imgname, tableName) {
	
	let table = document.getElementById(tableName)

	let tr = document.createElement("tr");
	let name_td = document.createElement("td");
	let img_td = document.createElement("td");
	let compound_td = document.createElement("td");
	let fixed_td = document.createElement("td");
	let daily = document.createElement("td");
	let weekly = document.createElement("td");
	let monthly = document.createElement("td");

	name_td.innerHTML += name.replace(/"/g,'');
	name_td.setAttribute("class", "info-label");


	compound_td.innerHTML = `${compound.toFixed(2)} %`
	compound_td.setAttribute("class", "profit")
	if(compound > 1.0) {
		compound_td.setAttribute("style", "color: rgb(8,153,129, 1.0);")
	} else {
		compound_td.setAttribute("style", "color: rgb(242,54,69, 0.8)")
	}

	fixed_td.innerHTML = `${fixed.toFixed(2)} %`
	fixed_td.setAttribute("class", "profit")
	if(fixed > 1.0) {
		fixed_td.setAttribute("style", "color: rgb(8,153,129, 1.0);")
	} else {
		fixed_td.setAttribute("style", "color: rgb(242,54,69, 0.8)")
	}

	let img = document.createElement("img");
	img.setAttribute("src", `static/img/${imgname}`);
	img.setAttribute("loading", 'lazy');
	img.setAttribute("class", 'pg4_table_img');

	img_td.appendChild(img)

	var daily_mark = document.createElement("img");
	daily_mark.setAttribute("src", `static/img/${markers[0]}`);
	daily_mark.setAttribute("loading", 'lazy');
	if(markers[0].includes("check")) { daily_mark.setAttribute("class", 'pg2_table_img_mark_green'); }
	else { daily_mark.setAttribute("class", 'pg2_table_img_mark_red'); }
	
	var weekly_mark = document.createElement("img");
	weekly_mark.setAttribute("src", `static/img/${markers[1]}`);
	weekly_mark.setAttribute("loading", 'lazy');
	if(markers[1].includes("check")) { weekly_mark.setAttribute("class", 'pg2_table_img_mark_green'); }
	else { weekly_mark.setAttribute("class", 'pg2_table_img_mark_red'); }

	var monthly_mark = document.createElement("img");
	monthly_mark.setAttribute("src", `static/img/${markers[2]}`);
	monthly_mark.setAttribute("loading", 'lazy');
	if(markers[2].includes("check")) { monthly_mark.setAttribute("class", 'pg2_table_img_mark_green'); }
	else { monthly_mark.setAttribute("class", 'pg2_table_img_mark_red'); }

	daily.appendChild(daily_mark)
	weekly.appendChild(weekly_mark)
	monthly.appendChild(monthly_mark)

	tr.appendChild(img_td)
	tr.appendChild(name_td)
	tr.appendChild(compound_td)
	tr.appendChild(fixed_td)
	tr.appendChild(daily)
	tr.appendChild(weekly)
	tr.appendChild(monthly)

	table.appendChild(tr)
}