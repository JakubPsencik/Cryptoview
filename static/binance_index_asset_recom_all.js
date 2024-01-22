async function displayBinanceIndexAssetRecomAllData(url) {

	try {
		
		let response = await fetch(url);
		response.json().then(async (data) => {
			console.log(data)
		});

	} catch (error) {
		console.log("error in: binance_index_asset_recom_all.js")
		console.log(error);
	}
}