
const a_input = document.getElementById("auto_invest_calc_amount_search_input");
const a_dropdown = document.getElementById("auto_invest_calc_amount_search_input_list");


a_input.addEventListener("", () => {
	if (a_input.value.length == 0) {
		a_dropdown.innerHTML = "No suggestions found";
	}
});

a_input.addEventListener("input", () => {
	_filterSuggestions(a_input.value);
});

document.getElementById("auto_invest_calc_amount_search_input_result").addEventListener("click", () => {
	document.getElementById("auto_invest_calc_amount_search_input_list_wrapper").style.display = "block";
});

async function _filterSuggestions(inputValue) {
	const filteredSuggestions =  binanceIndexAssetCoins.filter((suggestion) => {
	  return suggestion.toLowerCase().startsWith(inputValue.toLowerCase());
	});

	_displaySuggestions(filteredSuggestions);
}

function _displaySuggestions(suggestionsList) {
	a_dropdown.innerHTML = "";

	if(suggestionsList.length == binanceIndexAssetCoins.length) { 
		return null;
	}

	let counter = 5;

	if (suggestionsList.length < counter) {
		counter = suggestionsList.length;
	}

	if (suggestionsList.length > 0) {
		for (let i = 0; i < counter; i++) {
			
			const wrapper = document.createElement("div");
			wrapper.classList.add("amount_suggestion_wrapper");

			let img = document.createElement("img");
			img.setAttribute("src", `static/img/${suggestionsList[i]}.png`);
			img.setAttribute("loading", 'lazy');
			img.setAttribute("class", 'auto_invest_calc_suggestion_image');

			const coinNameDiv = document.createElement("div");
			coinNameDiv.classList.add("coin_name_div");
			coinNameDiv.textContent = suggestionsList[i];

			wrapper.addEventListener("click", () => {
				document.getElementById("auto_invest_calc_amount_search_img").setAttribute("src", `static/img/${suggestionsList[i]}.png`);
				document.getElementById("auto_invest_calc_amount_search_span").textContent = suggestionsList[i];
				document.getElementById("auto_invest_calc_amount_search_input_list_wrapper").style.display = "none";
			});

			wrapper.append(img);
			wrapper.append(coinNameDiv);
			a_dropdown.appendChild(wrapper);
			
		}
	
	}
}