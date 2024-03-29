function buildRealtimeWidget(widgetID, symbol, base, quote, refreshInterval) {
	
	try {
		const wsurl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker`;
		const socket = new WebSocket(wsurl);

		socket.addEventListener('message', (event) => {
	
			const data = JSON.parse(event.data);

			const kline = data;
			const currentPrice = parseFloat(kline.c);
			const previousPrice = parseFloat(kline.o);
			const priceChangePercentage = ((currentPrice - previousPrice) / previousPrice) * 100;
			const priceChangeAmount = currentPrice - previousPrice;

			// Set up widget elements
			const widget = $(`#${widgetID}`);
			const title = widget.find('h2');
			const price = widget.find('span').eq(0);
			const percentage = widget.find('span').eq(1);
			const amount = widget.find('span').eq(2);

			// Set widget text and styling
			title.text(`${base}`);
			price.text(currentPrice.toFixed(2) + ` ${quote}`);
			percentage.text(priceChangePercentage.toFixed(2) + '%');
			amount.text(priceChangeAmount.toFixed(2) + ` ${quote}`);

			if (priceChangeAmount > 0) {
				widget.addClass('positive');
				widget.removeClass('negative');
			} else if (priceChangeAmount < 0) {
				widget.addClass('negative');
				widget.removeClass('positive');
			} else {
				widget.removeClass('positive');
				widget.removeClass('negative');
			}

			// Close the WebSocket connection
			socket.close();
		});

		socket.onerror = () => {
			console.log('error')
		}

	} catch (error) {
		//pass
	}
	
}

function buildRealtimeWidgetPG4(widgetID, symbol) {
	// Set up Binance API request parameters
	var symbol = symbol;
	
	//const wsurl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker`;
	//const socket = new WebSocket(wsurl);

	//socket.addEventListener('open', (event) => {
	InitializeWidget(widgetID, symbol);
	//});

	// When a new message is received from Binance, update the widget with the new data
	/*socket.addEventListener('message', (event) => {
		
		const data = JSON.parse(event.data);
		fillWidget(widgetID, data);
	});*/
}

function fillWidget(widgetID, data) {
		
	// Extract the relevant data from the message
	const symbol = data.s;
	const currentprice = parseFloat(data.c);
	const priceChange = parseFloat(data.p);
	const percentChange = parseFloat(data.P);

	// Set up widget elements
	var widget = $(`#${widgetID}`);
	// Delete all the children of the div element
	widget.empty();

	var title = $("<span>");
	var price = $("<span>");
	var percentage = $("<span>");
	var amount = $("<span>");

	// Set widget text and styling
	title.text( `${symbol}`);
	title.css('font-size', '10px');
	price.text(currentprice.toFixed(2));
	amount.text(priceChange.toFixed(2));
	percentage.text(percentChange.toFixed(2) + '%');

	title.addClass("pg4span_symbol");
	price.addClass("test1");
	percentage.addClass("test1");
	amount.addClass("test1");

	// Append the span element to an existing element
	widget.append(title);
	widget.append(price);
	widget.append(amount);
	widget.append(percentage);

	widget.addClass('positive');

	if (percentChange > 0) {
		widget.addClass('positive');
		widget.removeClass('negative');
		//percentage.text('+ ' + priceChangePercentage.toFixed(2) + '%');
	} else if (percentChange < 0) {
		widget.addClass('negative');
		widget.removeClass('positive');
		//percentage.text('- ' + priceChangePercentage.toFixed(2) + '%');
	} else {
		widget.removeClass('positive');
		widget.removeClass('negative');
	}
}

function InitializeWidget(widgetID, symbol) {

	// Set up widget elements
	var widget = $(`#${widgetID}`);
	// Delete all the children of the div element
	widget.empty();

	var title = $("<span>");
	var price = $("<span>");
	var percentage = $("<span>");
	var amount = $("<span>");

	// Set widget text and styling
	title.text( `${symbol}`);
	title.css('font-size', '10px');
	price.text('-');
	amount.text('-');
	percentage.text('- %');

	title.addClass("pg4span_symbol");
	price.addClass("test1");
	percentage.addClass("test1");
	amount.addClass("test1");

	// Append the span element to an existing element
	widget.append(title);
	widget.append(price);
	widget.append(amount);
	widget.append(percentage);
}