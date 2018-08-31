import { 
    isEmptyObject,
    showPopup
} from './utils';

import './styles/styles.scss';

const jsMap = document.querySelector('#map');
const jsPopup = document.querySelector('#js-popup');
// закрыть окно с отзывами
const jsBtnClose = document.querySelector('#js-btn-close');
// адрес места
const jsAddress = document.querySelector('#js-address');
// список отзывов
const jsReviewsList = document.querySelector('#js-reviews-list');

// добавить отзыв
const jsBtnAdd = document.querySelector('#js-btn-add');

// постоянное хранилище
let storage = localStorage;

jsBtnClose.addEventListener('click', (e) => {
    jsPopup.style.display = 'none';
});

jsBtnAdd.addEventListener('click', (e) => {
    console.log('jsBtnAdd');
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
        return;
    }

    //console.log(jsAddress.innerHTML);
    let review = handleReview(jsInputName.value, jsInputPlace.value, jsInputReview.value);
    //console.log('jsBtnAdd ', data);
    setPlaceMarkWithReview(review, jsAddress.innerHTML, []);
    createReview(jsAddress.innerHTML);
    //console.log('jsBtnAdd ', data);

    jsInputName.value = '';
    jsInputPlace.value = '';
    jsInputReview.value = '';
});

import renderFn from './templates/review-template.hbs';

/////////////////////////////// model (данные)
let data = [];
/*
let placemark = {};
placemark.geo = [1, 1];
placemark.address = 'address';
placemark.reviews = [];
    let review = {};
    review.name = 'inputName';
    review.place = 'inputPlace';
    review.date = new Date().toLocaleString();
    review.review = 'inputReview';
placemark.reviews.push(review);
data.push(placemark);
*/
// setReview после ввода отзыва, сохранить в data
// возвращает объект
let handleReview = (inputName, inputPlace, inputReview) => {
    let review = {};

    review.name = inputName;
    review.place = inputPlace;
    review.date = new Date().toLocaleString();
    review.review = inputReview;

    return review;
}
let addReview = (review, address, coords) => {
    let placemark = {};

    placemark.geo = coords;
    placemark.address = address;
    if (isEmptyObject(review)) {
        console.log('empty');
        placemark.reviews = [];
        console.log('push review', review);
        placemark.reviews.push(review);
    }

    return placemark;
}    

const setPlaceMarkWithReview = (review, address, coords) => {
    // найти заданный placemark по адресу, добавить в него отзыв
    let isAddressExists = false;
    data.forEach(placemark => {
        if (placemark.address == address) {
            placemark.reviews.push(review);
            console.log('dataforEach = ', data);
            isAddressExists = true;
            return;
        }
    });
    // если ничего не нашли - создать
    if (!isAddressExists) {
        data.push(addReview(review, address, coords));
        console.log('data = ', data);
    }
}

// создавать из стораджа
const array = require('./data.js');
// console.log('array = ', array);

const reviewsHtml = renderFn({ items: array });
jsReviewsList.innerHTML = reviewsHtml;

const createReview = (placemarkgl, address) => {
    console.log('createReview: ', data);
    let is = false;

    // найти нужный пласемарк в data по адресу
    data.forEach(placemark => {
        if (placemark.reviews.length > 0) {
            if (placemark.address === address) {

                console.log('placemark: ', placemark);
                const reviewsHtml = renderFn({ items: placemark.reviews });
                console.log('reviewsHtml: ', reviewsHtml);
                jsReviewsList.innerHTML = reviewsHtml; 

                // сюда адрес из отзыва
                placemarkgl.options.set('balloonContentHeader', placemark.address);
                
                // сюда отзыв
                placemarkgl.options.set('balloonContentFooter', placemark.reviews[0]);

                is = true;
                return;
            }
        }    
    });
    if (!is) {
        jsReviewsList.innerHTML = 'Пока нет отзывов...';
    }

    console.log('jsReviewsList: ', jsReviewsList);
}

const init = () => {
    const map = new ymaps.Map('map', {
        center: [59.738750, 30.388758],
        zoom: 15,
        controls: [] //['typeSelector', 'zoomControl']
    });

    const clusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        clusterBalloonPanelMaxMapArea: 0,
        clusterBalloonContentLayoutWidth: 200,
        clusterBalloonContentLayoutHeight: 200,
        clusterBalloonPagerSize: 5,
        preset: 'islands#invertedOrangeClusterIcons'
      });
    map.geoObjects.add(clusterer);

    /*clusterer.events.add('click', (e) => {
        console.log('Кликнут кластер') ;    
    });*/

    // клик на карусели кластера
    map.balloon.events.add('click', (e) => {
        console.log('клик на карусели кластера');
        console.log(e);
        const coords = e.get('coords');
        console.log('coords ', coords);
//!!!!!!!!!!!!!!! здесь не определить координаты
        ymaps.geocode(coords).then((res) => {
            let firstGeoObject = res.geoObjects.get(0);
            address = firstGeoObject.getAddressLine();
            jsAddress.innerHTML = address; // todo // дублирование кода1
            createReview();
            showPopup(jsPopup, e.get('domEvent').get('pageX'), e.get('domEvent').get('pageY'), array);                
        });    
    });

    map.events.add('click', e => {
        // клик на пустом месте
        console.log('click');
        const coords = e.get('coords');
        console.log('coords = ', coords);

        // получить адрес по координатам
        let address;
        ymaps.geocode(coords).then((res) => {
            let firstGeoObject = res.geoObjects.get(0);
            address = firstGeoObject.getAddressLine();
            console.log(address);

            const placemark = new ymaps.Placemark(coords, {
                hintContent: address,
                balloonContentHeader: '', // сюда адрес из отзыва
                balloonContentBody: address,
                balloonContentFooter: '', // сюда отзыв
                preset: 'islands#violetIcon',
            });
            clusterer.add(placemark);            

            setPlaceMarkWithReview({}, address, coords);
           
            placemark.events.add('click', e => {
                console.log(e);
                const coords = e.get('coords');
                console.log('placemark coords ', coords);
                ymaps.geocode(coords).then((res) => {
                    let firstGeoObject = res.geoObjects.get(0);
                    address = firstGeoObject.getAddressLine();
                    jsAddress.innerHTML = address; // todo // дублирование кода1
                    createReview(placemark, address);
                
                    showPopup(jsPopup, e.get('domEvent').get('pageX'), e.get('domEvent').get('pageY'), array);                
                }); 
            });

            // если новая метка
            jsAddress.innerHTML = address; //todo // дублирование кода1
            createReview(placemark, address);
            showPopup(jsPopup, e.get('domEvent').get('pageX'), e.get('domEvent').get('pageY'), array);
        });
    })
}
ymaps.ready(init);