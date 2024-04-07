const input = document.getElementById("auto_invest_calc_search_input");
const dropdown = document.getElementById("auto_invest_calc_search_input_list");

const addCoinsButton = document.getElementById("auto_invest_calc_add_coins_bn");
const recomCoinsButton = document.getElementById("auto_invest_calc_recom_coins_bn");

const selectedInterval = document.getElementById("auto_invest_calc_interval_selector_button_wrapper");

addCoinsButton.addEventListener("click", () => {

	document.getElementById("auto_invest_calc_search_div").style.display = "block";
	document.getElementById("auto_invest_calc_search_bar_wrapper").style.display = "inline-flex";
	document.getElementById("auto_invest_calc_search_input_list").style.display = "block";

});

document.addEventListener("click", (event) => {
  const target = event.target;
  const searchBarWrapper = document.getElementById("auto_invest_calc_search_bar_wrapper");
  const searchInputList = document.getElementById("auto_invest_calc_search_input_list");
  const wrapper = document.getElementById("auto_invest_calc_search_div");

  if (target !== addCoinsButton && !searchBarWrapper.contains(target) && !searchInputList.contains(target) && !wrapper.contains(target)) {
	searchBarWrapper.style.display = "none";
	searchInputList.style.display = "none";
	wrapper.style.display = "none";
  }

});

recomCoinsButton.addEventListener("click", () => {
	const page_binance_index_asset = document.getElementById("page_binance_index_asset");
	const auto_invest_calc_div = document.getElementById("auto_invest_calc_div");

	page_binance_index_asset.style.display = "block";
	page_binance_index_asset.style.zIndex = "998";

	auto_invest_calc_div.style.display = "none";
});

document.getElementById("binance_index_asset_cancel_button").addEventListener("click", () => {
	const page_binance_index_asset = document.getElementById("page_binance_index_asset");
	page_binance_index_asset.style.display = "none";

	const auto_invest_calc_div = document.getElementById("auto_invest_calc_div");
	auto_invest_calc_div.style.display = "block";
});

intervalButtons = document.getElementsByClassName("auto_invest_calc_interval_selector_button");
let activeButton = document.getElementsByClassName("auto_invest_calc_interval_selector_button")[0];

const localTimeSelector = document.getElementById("auto_invest_calc_interval_detail_selector_localTime_wrapper");
const daysInWeekSelector = document.getElementById("auto_invest_calc_interval_selector_days_button_wrapper");
const daysInMonthSelector = document.getElementById("auto_invest_calc_interval_detail_selector_daysInMonth_wrapper");

for (let i = 0; i < intervalButtons.length; i++) {

	intervalButtons[i].addEventListener('click', function() {
		if (activeButton) {
			activeButton.classList.remove("active");
			activeButton.style.border = "1px solid rgb(71, 77, 87)";
		}

		intervalButtons[i].classList.add("active");
		intervalButtons[i].style.border = "1px solid var(--bn-yellow)";
		activeButton = intervalButtons[i];

		if(intervalButtons[i].innerHTML.includes("Daily")) {

			localTimeSelector.style.display = "flex";
			daysInWeekSelector.style.display = "none";
			daysInMonthSelector.style.display = "none";

		} else if(intervalButtons[i].innerHTML.includes("Weekly")) {

			localTimeSelector.style.display = "flex";
			daysInWeekSelector.style.display = "flex";
			daysInMonthSelector.style.display = "none";

		} else if(intervalButtons[i].innerHTML.includes("Monthly")) {

			localTimeSelector.style.display = "flex";
			daysInWeekSelector.style.display = "none";
			daysInMonthSelector.style.display = "flex";

		}
	});
};

const dailyHoursInput = document.getElementById("auto_invest_calc_interval_detail_selector_hours_input");

dailyHoursInput.addEventListener("input", () => {
	if(dailyHoursInput.value > 23) { dailyHoursInput.value = 23; }
	if(dailyHoursInput.value < 0) { dailyHoursInput.value = 0; }
});


daysButtons = document.getElementsByClassName("auto_invest_calc_interval_selector_days_button");
let daysActiveButton = null;

for (let i = 0; i < daysButtons.length; i++) {
	daysButtons[i].addEventListener('click', function() {
		if (daysActiveButton) {
			daysActiveButton.classList.remove("active");
			daysActiveButton.style.border = "1px solid rgb(71, 77, 87)";
		}

		daysButtons[i].classList.add("active");
		daysButtons[i].style.border = "1px solid var(--bn-yellow)";
		daysActiveButton = daysButtons[i];
	});
};

const selected_coins_in_index_wrapper = document.getElementById("auto_invest_calc_index_wrapper");

if (selected_coins_in_index_wrapper.children.length > 2) {
	const index_settings_wrapper = document.getElementById("auto_invest_calc_index_settings_wrapper");
	index_settings_wrapper.style.display = "flex";
}


const binanceIndexAssetCoins = ["BTC", "ETH", "BNB", "SOL", "XRP", "MATIC", "ADA", "DOT", "LTC", "ATOM", "RNDR", "GRT", "INJ", "AGIX", "ROSE", "FET", "OCEAN", "ARKM", "MAV", "PENDLE", "SEI", "CYBER", "WBETH", "XVS", "RDNT", "CAKE", "BSW", "ALPACA", "STG", "ARB", "GMX", "MAGIC", "GNS", "JOE", "SAND", "MANA", "AXS", "GALA", "ILV", "ALICE", "IMX", "YGG", "LINK", "UNI", "LDO", "AAVE", "MKR", "COMP", "OP", "DOGE", "PEPE", "SHIB", "CHZ", "SANTOS", "ALPINE", "PORTO", "LAZIO", "BAR", "ACM", "OG", "PSG", "CITY", "AVAX", "APE", "RPL", "FXS", "LRC", "ANKR", "USDT", "TUSD", "FDUSD", "USDC", "XTZ", "RUNE", "LIT", "TRX", "ORDI", "JTO", "1000SATS", "ACE", "NTRN", "MEME", "TIA", "BEAMX", "FTM", "APT", "NEAR", "FLOKI", "CFX", "WOO", "ANT", "BAKE", "KDA", "IOTX", "STX", "BTTC", "TWT", "OSMO", "ASTR", "STORJ", "QI", "PYR", "MOVR", "SUPER", "DEGO", "NEO", "QTUM", "EOS", "SNT", "BNT", "GAS", "ZRX", "KNC", "FUN", "IOTA", "XVG", "MTL", "ETC", "ZEC", "AST", "DASH", "OAX", "REQ", "VIB", "POWR", "ENJ", "KMD", "NULS", "XMR", "AMB", "BAT", "LSK", "ADX", "XLM", "WAVES", "ICX", "ELF", "RLC", "PIVX", "IOST", "STEEM", "BLZ", "ZIL", "ONT", "WAN", "SYS", "LOOM", "ZEN", "THETA", "QKC", "DATA", "SC", "DENT", "ARDR", "HOT", "VET", "DOCK", "RVN", "DCR", "REN", "ONG", "CELR", "OMG", "PHB", "TFUEL", "ONE", "ALGO", "DUSK", "WIN", "COS", "KEY", "CVC", "BAND", "HBAR", "NKN", "KAVA", "ARPA", "CTXC", "BCH", "TROY", "VITE", "FTT", "EUR", "OGN", "DREP", "WRX", "LTO", "MBL", "COTI", "STPT", "CTSI", "HIVE", "CHR", "BTCUP", "BTCDOWN", "MDT", "STMX", "PNT", "DGB", "SXP", "SNX", "ETHUP", "ETHDOWN", "VTHO", "IRIS", "FIO", "BNBUP", "BNBDOWN", "AVA", "BAL", "YFI", "JST", "CRV", "NMR", "LUNA", "IDEX", "RSR", "PAXG", "WNXM", "TRB", "WBTC", "SUSHI", "KSM", "EGLD", "DIA", "UMA", "BEL", "WING", "OXT", "SUN", "FLM", "SCRT", "ORN", "UTK", "ALPHA", "VIDT", "FIL", "AERGO", "AUDIO", "CTK", "AKRO", "HARD", "SLP", "STRAX", "FOR", "UNFI", "XEM", "SKL", "GLM", "JUV", "1INCH", "REEF", "ATM", "ASR", "CELO", "RIF", "TRU", "DEXE", "CKB", "FIRO", "SFP", "DODO", "FRONT", "UFT", "AUCTION", "PHA", "BADGER", "FIS", "OM", "POND", "LINA", "PERP", "TKO", "PUNDIX", "TLM", "FORTH", "BURGER", "ICP", "AR", "POLS", "MDX", "MASK", "LPT", "ATA", "GTC", "ERN", "KLAY", "BOND", "MLN", "QUICK", "C98", "CLV", "QNT", "FLOW", "MINA", "RAY", "FARM", "MBOX", "GHST", "WAXP", "GNO", "PROM", "XEC", "DYDX", "USDP", "DF", "FIDA", "CVP", "AGLD", "RAD", "BETA", "RARE", "SSV", "CHESS", "DAR", "BNX", "ENS", "KP3R", "VGX", "JASMY", "AMP", "PLA", "ALCX", "BICO", "FLUX", "VOXEL", "HIGH", "CVX", "PEOPLE", "OOKI", "SPELL", "ACH", "GLMR", "LOKA", "API3", "ACA", "XNO", "T", "NBT", "GMT", "BIFI", "MULTI", "MOB", "NEXO", "REI", "GAL", "EPX", "LEVER", "LUNC", "POLYX", "HFT", "HOOK", "HIFI", "PROS", "SYN", "LQTY", "USTC", "ID", "EDU", "SUI", "COMBO", "WLD", "ARK", "CREAM", "GFT", "IQ", "VIC", "BLUR", "VANRY", "AEUR", "BONK", "NFP", "AI", "XAI", "SLM", "FLR", "MANTA", "ALT", "JUP", "PYTH", "RONIN"]


input.addEventListener("input", () => {
	filterSuggestions(input.value);
});

async function filterSuggestions(inputValue) {
	const filteredSuggestions =  products.filter((suggestion) => {
		return suggestion.toLowerCase().startsWith(inputValue.toLowerCase());
	});

	displaySuggestions(filteredSuggestions);
}

function displaySuggestions(suggestionsList) {
	dropdown.innerHTML = "";

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
		img.setAttribute("class", 'auto_invest_calc_suggestion_image');


		const coinNameDiv = document.createElement("div");
		coinNameDiv.classList.add("coin_name_div");
		coinNameDiv.textContent = suggestion;

		coinDiv.addEventListener("click", () => {
			const index_wrapper = document.getElementById("auto_invest_calc_index_wrapper");
	
			const newWrapper = coinDiv.cloneNode(true);
			newWrapper.classList.add("selected_coin_wrapper");

			if(index_wrapper.children.length < 12) {

				const allocationInput = document.createElement("input");
				allocationInput.setAttribute("data-bn-type", "input");
				allocationInput.setAttribute("placeholder", "Enter at least 10%");
				allocationInput.setAttribute("class", "auto_invest_calc_allocation_input");
				allocationInput.setAttribute("value", "10");

				allocationInput.addEventListener("input", (event) => {
					let inputValue = event.target.value;
					inputValue = inputValue.replace(/[^0-9]/g, ""); // Remove non-numeric characters
					inputValue = Math.min(Math.max(parseInt(inputValue), 0), 100); // Restrict the value between 0 and 100
					event.target.value = inputValue;
				});
				newWrapper.appendChild(allocationInput);
		
				const percentDiv = document.createElement("div");
				percentDiv.classList.add("auto_invest_calc_percent");
				percentDiv.textContent = "%";
				newWrapper.appendChild(percentDiv);

				
				const removeButton = document.createElement("button");
				removeButton.classList.add("auto_invest_calc_remove_button");
				removeButton.textContent = "X";
				newWrapper.appendChild(removeButton);

				removeButton.addEventListener("click", () => {
					newWrapper.remove();
					if(index_wrapper.children.length == 2) {
						document.getElementById("auto_invest_calc_no_coins_selected").style.display = "block";
						document.getElementById("auto_invest_calc_index_settings_wrapper").style.display = "none";
					}
					
				});

				//add coin to and index
				index_wrapper.appendChild(newWrapper);
				document.getElementById("auto_invest_calc_no_coins_selected").style.display = "none";
			}
			const index_settings_wrapper = document.getElementById("auto_invest_calc_index_settings_wrapper");
			if(index_wrapper.children.length > 2) {
				index_settings_wrapper.style.display = "flex";
			}
			
		});

		coinDiv.append(img);
		coinDiv.append(coinNameDiv);
		dropdown.appendChild(coinDiv);
	});
	} else {
		document.getElementById("auto_invest_calc_no_coins_selected").style.display = "block";
	}
}

const auto_invest_calc_interval_detail_selector_hours_input = document.getElementById("auto_invest_calc_interval_detail_selector_hours_input");

auto_invest_calc_interval_detail_selector_hours_input.addEventListener("change", function() {
	auto_invest_calc_interval_detail_selector_hours_input.value = this.value;
});

const auto_invest_calc_interval_detail_selector_DateFrom_input = document.getElementById("auto_invest_calc_interval_detail_selector_DateFrom_input");

auto_invest_calc_interval_detail_selector_DateFrom_input.addEventListener("change", function() {
	auto_invest_calc_interval_detail_selector_DateFrom_input.value = this.value;
});

const auto_invest_calc_interval_detail_selector_dayInMonth_input = document.getElementById("auto_invest_calc_interval_detail_selector_dayInMonth_input");

auto_invest_calc_interval_detail_selector_dayInMonth_input.addEventListener("change", function() {
	auto_invest_calc_interval_detail_selector_dayInMonth_input.value = this.value;
});


document.getElementById("auto_invest_calc_confirm_button1").addEventListener("click", () => { 
	
	recurringCycle = [];
	coinNames = [];
	allocationValues = [];
	const allocs = document.getElementsByClassName("auto_invest_calc_allocation_input");
	const coins = document.getElementsByClassName("coin_name_div");
	let sum = 0;
	for (let i = 0; i < allocs.length; i++) { 
		sum += parseInt(allocs[i].value);
		allocationValues.push(allocs[i].value);
		coinNames.push(coins[i].innerText);
	}

	recurringCycle.push(coinNames, allocationValues);

	if(sum != 100) {
		alert("Allocation sum must be 100!");
	} else {
		alert("Index linked plan created.");
		var tmp = document.getElementsByClassName("active");
		var actives = [];
		for (let i = 0; i < tmp.length; i++) 
			actives.push(tmp[i].innerText);
		
		actives.forEach(active => {
			if (active.includes('Daily')) {
				recurringCycle.push('Daily');
			} else if (active.includes('Weekly')) {
				recurringCycle.push("Weekly");
				recurringCycle.push(actives[1]);
			} else if (active.includes('Monthly')) {
				recurringCycle.push('Monthly');
			}
		});


		const investment = document.getElementById("auto_invest_calc_props_input").value;
		recurringCycle.push(investment);

		const daysInMonth = document.getElementById("auto_invest_calc_interval_detail_selector_dayInMonth_input").value;
		recurringCycle.push(daysInMonth);

		const hours = document.getElementById("auto_invest_calc_interval_detail_selector_hours_input").value;
		recurringCycle.push(hours);

		const startDate = document.getElementById("auto_invest_calc_interval_detail_selector_DateFrom_input").value;
		recurringCycle.push(startDate);

		console.log(recurringCycle);


		var rebalance_url = "http://127.0.0.1:5000/rebalance?"
		+ "&investment=" + investment
		+ "&interval=" + _interval
		+ "&start=" + startDate
		+ "&end=" + new Date().toISOString().slice(0, 16);
		+ "&coins=" + coinNames
		+ "&allocations=" + allocationValues
		+ "&intervalOption=" + "1";

		/* 
		var rebalance_url = "http://127.0.0.1:5000/rebalance?"
		+ "&coin1=" + coin1
		+ "&alloc1=" + alloc1
		+ "&coin2=" + coin2
		+ "&alloc2=" + alloc2
		+ "&investment=" + investment
		+ "&ratio=" + ratio
		+ "&interval=" + _interval
		+ "&start=" + start_date
		+ "&end=" + end_date
		+ "&coins=" + coins
		+ "&allocations=" + allocations
		+ "&intervalOption=" + rebalanceIntervalOptionValue;*/

		console.log(rebalance_url);
		
		//setRebalancePoints(rebalance_url);

	}
	
});

async function getCoins() {
	
	try {
		let response = await fetch("http://127.0.0.1:5000/binanceIndexAssetCoins");
		response.json().then(async (r) => {
			console.log(r);
		});

	} catch (error) {
		console.log(error);
	}
}

async function createIndexAssetCoinRow(coinName, allocation) {

	const coinDiv = document.createElement("div");
	coinDiv.classList.add("suggestion_wrapper");

	let img = document.createElement("img");
	img.setAttribute("src", `static/img/${coinName}.png`);
	img.setAttribute("loading", 'lazy');
	img.setAttribute("class", 'auto_invest_calc_suggestion_image');

	const coinNameDiv = document.createElement("div");
	coinNameDiv.classList.add("coin_name_div");
	coinNameDiv.textContent = coinName;
	
	coinDiv.append(img);
	coinDiv.append(coinNameDiv);

	const index_wrapper = document.getElementById("auto_invest_calc_index_wrapper");

	coinDiv.classList.add("selected_coin_wrapper");

	const allocationInput = document.createElement("input");
	allocationInput.setAttribute("data-bn-type", "input");
	allocationInput.setAttribute("placeholder", "Enter at least 10%");
	allocationInput.setAttribute("class", "auto_invest_calc_allocation_input");
	allocationInput.setAttribute("value", `${allocation}`);

	allocationInput.addEventListener("input", (event) => {
		let inputValue = event.target.value;
		inputValue = inputValue.replace(/[^0-9]/g, ""); // Remove non-numeric characters
		inputValue = Math.min(Math.max(parseInt(inputValue), 0), 100); // Restrict the value between 0 and 100
		event.target.value = inputValue;
	});
	coinDiv.appendChild(allocationInput);

	const percentDiv = document.createElement("div");
	percentDiv.classList.add("auto_invest_calc_percent");
	percentDiv.textContent = "%";
	coinDiv.appendChild(percentDiv);

	
	const removeButton = document.createElement("button");
	removeButton.classList.add("auto_invest_calc_remove_button");
	removeButton.textContent = "X";
	coinDiv.appendChild(removeButton);

	removeButton.addEventListener("click", () => {
		coinDiv.remove();
		if(index_wrapper.children.length == 2) {
			document.getElementById("auto_invest_calc_no_coins_selected").style.display = "block";
			document.getElementById("auto_invest_calc_index_settings_wrapper").style.display = "none";
		}
		
	});

	//add coin to and index
	index_wrapper.appendChild(coinDiv);
	document.getElementById("auto_invest_calc_no_coins_selected").style.display = "none";
}