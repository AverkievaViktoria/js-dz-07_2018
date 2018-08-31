/*

https://tech.yandex.ru/maps/doc/jsapi/2.1/dg/concepts/controls/standard-docpage/

*/
export const isEmptyObject = (obj) => {
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            return false;
        }
    }
    return true;
}

const checkPopupPosition = (x, y, w, h) => {
	// размер окна браузера
	const width=document.body.clientWidth; // ширина  
	const height=document.body.clientHeight; // высота

	// значения по-умолчанию
	if ((h==0)||(w==0)) {
		h = 550;
		w = 380;
	}

	if ((x+w) > width) {
		x = width - w;
	}
	if ((y+h) > height) {
		y = height - h;
	}

	return {x, y};
}


export const showPopup = (jsPopup, x, y, data) => {
	let pos = checkPopupPosition(x, y, jsPopup.offsetWidth, jsPopup.offsetHeight);
	
	jsPopup.style.left = pos.x + 'px';
	jsPopup.style.top = pos.y + 'px';

	jsPopup.style.display = 'block';
}
