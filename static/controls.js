document.onkeydown = moveSlide;

pgNum = 0

function moveSlide(e) {

	e = e || window.event;
	
	if (e.keyCode == '37' && (pgNum != 0)) {
	// left arrow
	slide('prev')
	pgNum -= 1
	//console.log(`left arrow pressed, ${pgNum}`)
	}
	else if(e.keyCode == '39' && (pgNum == 11)) {
		slide('next')
		pgNum = 0
		//console.log(`right arrow pressed, ${pgNum}`)
	}
	else if (e.keyCode == '39') {
		// right arrow
		slide('next')
		pgNum += 1
		//console.log(`right arrow pressed, ${pgNum}`)
	
	}

}