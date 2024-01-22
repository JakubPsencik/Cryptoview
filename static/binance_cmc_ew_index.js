async function displayBinanceCmcEwIndex(url) {
	
	try {
		let response = await fetch(url);
		response.json().then(async (r) => {
		
			const div1 = document.createElement("div");
			//div1.classList.add("");
			const div2 = document.createElement("div");
			//div2.classList.add("");

			for (let i = 0; i < r.length/2; i++) {
				let img = document.createElement("img");
				img.setAttribute("src", `static/img/${r[i]}.png`);
				img.setAttribute("loading", 'lazy');
				img.setAttribute("class", 'binance_cmc_ew_index_img');
				div1.append(img);
			}

			for (let i = r.length/2; i < r.length; i++) {
				let img = document.createElement("img");
				img.setAttribute("src", `static/img/${r[i]}.png`);
				img.setAttribute("loading", 'lazy');
				img.setAttribute("class", 'binance_cmc_ew_index_img');
				div2.append(img);
			}

			document.getElementById("binance_cmc_ew_index_wrapper_div").appendChild(div1);
			document.getElementById("binance_cmc_ew_index_wrapper_div").appendChild(div2);

		});

	} catch (error) {
		console.log(error);
	}
}