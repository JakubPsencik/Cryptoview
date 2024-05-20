async function displayBinanceCmcEwIndex(url) {
	
	try {
		let response = await fetch(url);
		response.json().then(async (r) => {
		
			const div1 = document.getElementById("binance_cmc_ew_index_coin_div_1");
			const div2 = document.getElementById("binance_cmc_ew_index_coin_div_2");

			for (let i = 0; i < r.length/2; i++) {

				let wrapper = document.createElement("div");
				wrapper.classList.add("binance_cmc_ew_index_img_wrapper");

				let img = document.createElement("img");
				img.setAttribute("src", `static/img/${r[i]}.png`);
				img.setAttribute("loading", 'lazy');
				img.setAttribute("class", 'binance_cmc_ew_index_img');

				let coinName = document.createElement("span");
				coinName.innerHTML = r[i];
				coinName.classList.add("binance_cmc_ew_index_img_name");

				wrapper.append(img);
				wrapper.append(coinName);

				div1.append(wrapper);
			}

			for (let i = r.length/2; i < r.length; i++) {

				let wrapper = document.createElement("div");
				wrapper.classList.add("binance_cmc_ew_index_img_wrapper");

				let img = document.createElement("img");
				img.setAttribute("src", `static/img/${r[i]}.png`);
				img.setAttribute("loading", 'lazy');
				img.setAttribute("class", 'binance_cmc_ew_index_img');

				let coinName = document.createElement("span");
				coinName.innerHTML = r[i];
				coinName.classList.add("binance_cmc_ew_index_img_name");

				wrapper.append(img);
				wrapper.append(coinName);

				div2.append(wrapper);
			}
		});

	} catch (error) {
		console.log(error);
	}
}