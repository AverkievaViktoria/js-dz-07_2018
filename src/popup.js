/////////////////////////////// view (отображение)
// функции для работы с окном с отзывами

const jsPopup = document.querySelector('#js-popup');
const jsBtnClose = document.querySelector('#js-btn-close');

// закрыть окно
jsBtnClose.addEventListener('click', (e) => {
    jsPopup.style.display = 'none';
});

// скорректировать положение окна
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

// открыть окно
export const openPopup = (x, y, address) => {
	let pos = checkPopupPosition(x, y, jsPopup.offsetWidth, jsPopup.offsetHeight);
	
	const jsAddress = document.querySelector('#js-address');
	jsAddress.innerHTML = address; 

	const jsReviewsList = document.querySelector('#js-reviews-list');
	jsReviewsList.innerHTML = 'Отзывов пока нет...';

	jsPopup.style.left = pos.x + 'px';
	jsPopup.style.top = pos.y + 'px';

	jsPopup.style.display = 'block';
}

// обработка ввода отзыва 
// - проверяет корректность ввода
// - возвращает объект отзыв для хранения в data
export let handleReview = () => {
    const jsInputName = document.querySelector('#js-input-name');
    const jsInputPlace = document.querySelector('#js-input-place');
    const jsInputReview = document.querySelector('#js-input-review');

    let message = '';
    if (!jsInputName.value) {
        message += 'Не указано имя. ' 
    }
    if (!jsInputPlace.value) {
        message += 'Не указано место. ' 
    }
    if (!jsInputReview.value) {
        message += 'Нет отзыва. ' 
    }
    if (message) {
        alert(message);
        return undefined;
    }

    let review = {};

    review.name = jsInputName.value;
    review.place = jsInputPlace.value;
    review.date = new Date().toLocaleString();
    review.review = jsInputReview.value;

	jsInputName.value = '';
    jsInputPlace.value = '';
    jsInputReview.value = '';

    return review;
}

let currentDrag;
const addListeners = (target) => {
    const handleDragStart = (e) => {
        currentDrag = { source: target, node: e.target };
    }

    const handleDragOver = (e) => {
        if (e.preventDefault) {
            e.preventDefault(); 
        }

        return false;
    }

    const handleDragEnd = (e) => {
        if (currentDrag) {
            e.preventDefault();
            jsPopup.style.left = e.pageX + 'px';
            jsPopup.style.top = e.pageY + 'px';
        }    
    }    
    
    target.addEventListener('dragstart', handleDragStart, false);
    target.addEventListener('dragover', handleDragOver, false);
    target.addEventListener('dragend', handleDragEnd, false);
}
addListeners(jsPopup);
