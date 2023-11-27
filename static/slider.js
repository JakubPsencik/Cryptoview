const pages = document.querySelectorAll(".page");
const translateAmount = 100;
let translate = 0;
let pageNumber = 1;

slide = (direction) => {
	//console.log('before: ', pageNumber);

	if(direction === "next") {
		
		if(pageNumber === 7) {
			translate += translateAmount * (pageNumber-1);
			pageNumber = 1;
		} else {
			translate -= translateAmount
			pageNumber += 1;
		}
		
	} 
	//previous
	else {
		//pageNumber += 1;
		if(pageNumber === 1) {
			translate -= translateAmount * (pageNumber-1);
			pageNumber = 7;
		} else {
			//console.log(`translate at 4: ${translate}, translateAmount at 4: ${translateAmount}`)
			translate += translateAmount;
			pageNumber -= 1;

		}
		
	}
	
	pages.forEach(
		pages => (pages.style.transform = `translateX(${translate}%)`)

	)
	
	//console.log('after: ', pageNumber);
}