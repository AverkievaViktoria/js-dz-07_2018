import { 
    isEmptyObject,
    openPopup,
    handleReview
} from './utils';

import './styles/styles.scss';
import renderFnReview from './templates/review-template.hbs';
import renderFnClusterer from './templates/clusterer-template.hbs';

let map;
let clusterer;

// текущие параметры объекта, с которым работаем
let coords_gl = [0, 0];
let address_gl = '';
let placemark_gl;
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
        //console.log('coord = ', coord);    
        //console.log('coords_gl = ', coords_gl);    

        setPlaceMarkWithReview(review, address_gl, coords_gl);
        updateReviews(address_gl); // перерисовать отзывы
        updateClusterer(placemark_gl);
    }
});

const createPlacemark = () => {
    const placemark = new ymaps.Placemark(coords_gl, {
        hintContent: address_gl,
        preset: 'islands#violetIcon',
    }, {
        hasBalloon: false,
        openBalloonOnClick: false,
        hasHint: false
    });
    placemark.properties.set('myAddress', address_gl);

    updateClusterer(placemark);
    clusterer.add(placemark);    
    placemark_gl = placemark;        
   
    placemark.events.add('click', e => {
        address_gl = e.get('target').properties.get('myAddress');
//        coords_gl = e.get('target').properties.get('myCoords');

        openPopup(e.get('domEvent').get('pageX'), e.get('domEvent').get('pageY'), address_gl);
        updateReviews(address_gl);
        updateClusterer(placemark);
        placemark_gl = placemark;        
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

// возвращает placemark при совпадении адреса и координат
const findPlacemark = (address) => {
    let result_placemark;
    data.forEach(placemark => {
        if (placemark.address == address) {
            result_placemark = placemark;
            return;
        }
    });   

    return result_placemark;
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

const updateClusterer = (placemark) => {
    let dataPlacemark = findPlacemark(address_gl);
    let clustererHtml =  '<div class="clasterer-address">' + dataPlacemark.address + '</div>';

    clustererHtml += renderFnClusterer({ items: dataPlacemark.reviews });
    placemark.properties.set('balloonContentBody', clustererHtml);
}

const updateReviews = (address) => {
    // список отзывов
    const jsReviewsList = document.querySelector('#js-reviews-list');
    let is = false;

    // найти нужный placemark в data по адресу
    data.forEach(placemark => {
        if (placemark.reviews.length > 0) {
            if (placemark.address === address) {
                const reviewsHtml = renderFnReview({ items: placemark.reviews });

                jsReviewsList.innerHTML = reviewsHtml; 
                is = true;

                return;
            }
        }    
    });
    if (!is) {
        jsReviewsList.innerHTML = 'Пока нет отзывов...';
    }
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
        controls: ['typeSelector', 'zoomControl']
        }, {
           openBalloonOnClick: false,
    });

    var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
        '<div class="balloon_body">{{ properties.balloonContentBody|raw }}</div>',
        {
            build: function () {
                this.constructor.superclass.build.call(this);

                const href = this.getParentElement().querySelector('.clasterer-address');
                console.log('href = ', href);
                href.addEventListener('click', (e) => {
                    address_gl = e.target.innerHTML;
                    openPopup(e.pageX, e.pageY, address_gl);
                    updateReviews(address_gl);
                });
            },            
        }
    );

    clusterer = new ymaps.Clusterer({
        preset: 'islands#invertedOrangeClusterIcons',
        groupByCoordinates: false,
        clusterDisableClickZoom: true,
        clusterHideOnBalloonOpen: false,
        geoObjectsHideIconOnBalloonOpen: false,
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        clusterBalloonItemContentLayout: customItemContentLayout,
      });
    map.geoObjects.add(clusterer);

    map.events.add('click', e => {
        // клик на пустом месте карты
        coords_gl = e.get('coords');
       
        ymaps.geocode(coords_gl).then((res) => {
            let firstGeoObject = res.geoObjects.get(0);
            address_gl = firstGeoObject.getAddressLine();

            openPopup(e.get('domEvent').get('pageX'), e.get('domEvent').get('pageY'), address_gl);
            updateReviews(address_gl);
        });    
    })
}

ymaps.ready(async () => {
    init();
});    
