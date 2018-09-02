/*
todo
- проверить совпадение координат, доп к адресу
- карусель!!!
- сохранять в localStorage и загружать оттуда
*/
import { 
    isEmptyObject,
    openPopup,
    handleReview
} from './utils';

import './styles/styles.scss';
import renderFn from './templates/review-template.hbs';

let map;
let clusterer;

// текущие параметры объекта, с которым работаем
let coords_gl = [0, 0];
let address_gl = '';
///let id_gl;

const jsMap = document.querySelector('#map');



// постоянное хранилище
let storage = localStorage;


const cache = new Map();

// добавить отзыв
const jsBtnAdd = document.querySelector('#js-btn-add');
jsBtnAdd.addEventListener('click', (e) => {
    let review = handleReview();
    if (review) {
        const coord = geocode(address_gl);
        console.log('coord = ', coord);    
        console.log('coords_gl = ', coords_gl);    


        setPlaceMarkWithReview(review, address_gl, coords_gl);
        updateReviews(address_gl); // перерисовать отзывы
    }
});

const createPlacemark = () => {
    const placemark = new ymaps.Placemark(coords_gl, {
        hintContent: address_gl,
        preset: 'islands#violetIcon',

        balloonContentHeader: 'место из отзыва', // сюда место из отзыва
        balloonContentBody: '<strong>' + address_gl + '</strong>',
        balloonContentFooter: 'отзыв', // сюда отзыв
    });
    //placemark.properties.set('myId', 1);
    placemark.properties.set('myAddress', address_gl);
//    placemark.properties.set('myCoords', coords_gl);

    clusterer.add(placemark);            
   
    placemark.events.add('click', e => {
        address_gl = e.get('target').properties.get('myAddress');
//        coords_gl = e.get('target').properties.get('myCoords');

        openPopup(e.get('domEvent').get('pageX'), e.get('domEvent').get('pageY'), address_gl);
        updateReviews(address_gl);
    });
};

/////////////////////////////// model (данные)
let data = [];
/*
let placemark = {};
placemark.id = 1; - не нужен! поиск по адресу
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

let addReview = (review, address, coords) => {
    let placemark = {};

    placemark.geo = coords;
    placemark.address = address;
    placemark.reviews = [];
    placemark.reviews.push(review);

    return placemark;
}    

const setPlaceMarkWithReview = (review, address, coords) => {
    // найти в data заданный placemark по адресу, добавить в него отзыв
    let isAddressExists = false;
    data.forEach(placemark => {
        if (placemark.address == address) {
            placemark.reviews.push(review);
            isAddressExists = true;
            return;
        }
    });
    // если ничего не нашли - создать
    if (!isAddressExists) {
        data.push(addReview(review, address, coords));
        createPlacemark();
    }
}

const updateReviews = (address) => {
    // список отзывов
    const jsReviewsList = document.querySelector('#js-reviews-list');
    let is = false;

    // найти нужный placemark в data по адресу
    data.forEach(placemark => {
        if (placemark.reviews.length > 0) {
            if (placemark.address === address) {
                const reviewsHtml = renderFn({ items: placemark.reviews });

                jsReviewsList.innerHTML = reviewsHtml; 

              ///  clusterer.options.set(
               ///     'clusterBalloonItemContentLayout', ymaps.templateLayoutFactory.createClass(reviewsHtml)
               /// );
                // сюда адрес из отзыва
                //placemarkgl.options.set('balloonContentHeader', placemark.address);
                
                // сюда отзыв
                //placemarkgl.options.set('balloonContentFooter', placemark.reviews[0]);

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


function geocode(address) {
    if (cache.has(address)) {
        return cache.get(address);
    }

    cache.set(address, ymaps.geocode(address)
        .then(result => {
            const points = result.geoObjects.toArray();

            if (points.length) {
                return points[0].geometry.getCoordinates();
            }
        }));

    return cache.get(address);
}

const init = () => {
    map = new ymaps.Map('map', {
        center: [59.738750, 30.388758],
        zoom: 15,
        controls: [] //['typeSelector', 'zoomControl']
        }, {
           openBalloonOnClick: false,
    });

    // https://yandex.ru/blog/mapsapi/56ed6c086b7e47acba2cf190
    // Создаем собственный макет с информацией о выбранном геообъекте.
    var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
    // Флаг "raw" означает, что данные вставляют "как есть" без экранирования html.
            '<h2 class="ballon_header">{{ properties.balloonContent|raw }}</h2>' +
            '<div class="ballon_body">{{ properties.balloonContentBody|raw }}</div>' +
            '<div class="ballon_footer">{{ properties.balloonContentFooter|raw }}</div>'

    );

    clusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        clusterBalloonPanelMaxMapArea: 0,
        clusterBalloonContentLayoutWidth: 200,
        clusterBalloonContentLayoutHeight: 200,
        clusterBalloonItemContentLayout: customItemContentLayout,
        clusterBalloonPagerSize: 5,
        openBalloonOnClick: false,
        preset: 'islands#invertedOrangeClusterIcons'
      });
    map.geoObjects.add(clusterer);

    /*clusterer.events.add('click', (e) => {
        console.log('Кликнут кластер') ;    
    });*/

    // клик на карусели  todo
    map.balloon.events.add('click', (e) => {
        console.log('карусель', e, e.get('target'));   
    });

    map.events.add('click', e => {
        // клик на пустом месте карты
        coords_gl = e.get('coords');
       
        ymaps.geocode(coords_gl).then((res) => {
            let firstGeoObject = res.geoObjects.get(0);
            address_gl = firstGeoObject.getAddressLine();

            openPopup(e.get('domEvent').get('pageX'), e.get('domEvent').get('pageY'), address_gl);
        });    
    })
}




ymaps.ready(async () => {
    init();
});    

