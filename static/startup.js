products = []

const getProducts = async function() {
	try {
		let response = await fetch("http://127.0.0.1:5000/products");
		let data = await response.json();
		return data;
	} catch (error) {
		console.log(error);
		throw error; // Optionally rethrow the error if needed
	}
};

(async () => {
	try {
		const result = await getProducts();
		products = result;
		console.log(result);
	} catch (error) {
		console.error("Error fetching products:", error);
	}
})();