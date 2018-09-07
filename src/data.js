// ///////////////////////////// model (данные)
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

export const isEmptyObject = (obj) => {
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            return false;
        }
    }
    
    return true;
}

export const addReview = (review, address, coords) => {
    let placemark = {};

    placemark.geo = coords;
    placemark.address = address;
    placemark.reviews = [];
    placemark.reviews.push(review);

    return placemark;
}    

// возвращает placemark при совпадении адреса и координат
export const findPlacemark = (data, address) => {
    let resultPlacemark;

    data.forEach(placemark => {
        if (placemark.address == address) {
            resultPlacemark = placemark;

            return;
        }
    });   

    return resultPlacemark;
}