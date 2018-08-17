/*
 Страница должна предварительно загрузить список городов из
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 и отсортировать в алфавитном порядке.

 При вводе в текстовое поле, под ним должен появляться список тех городов,
 в названии которых, хотя бы частично, есть введенное значение.
 Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.

 Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 После окончания загрузки городов, надпись исчезает и появляется текстовое поле.

 Разметку смотрите в файле towns-content.hbs

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер

 *** Часть со звездочкой ***
 Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 При клике на кнопку, процесс загруки повторяется заново
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');

/*
 Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 */

var allTowns;

updateTowns();

const btn = document.createElement('button');

btn.innerHTML = 'Обновить список городов';
btn.id = 'update-block';
btn.style.display = 'none';
homeworkContainer.insertBefore(btn, homeworkContainer.childNodes[0]);

/* Блок с кнопкой обновления */
const updateBlock = homeworkContainer.querySelector('#update-block');

function updateTowns() {
    loadTowns()
        .then((data) => {
            loadingBlock.style.display = 'none';
            filterBlock.style.display = 'block';
            filterInput.style.display = 'block';
            filterResult.style.cursor = 'pointer';
            updateBlock.style.display = 'none';
            allTowns = data;
        })
        .catch(() => {
            updateBlock.style.display = 'block';
        });
}    

function loadTowns() {
    return new Promise(function(resolve, reject) {
        let xhr = new XMLHttpRequest();

        xhr.open('GET', 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json', true);
        xhr.responseType = 'json'; 
        
        const transferComplete = () => {
            
            let towns = xhr.response;
            
            if (xhr.status >= 400) {
                reject();
            } else {
                towns.sort(function (a, b) {
                    if (a.name > b.name) {
                        return 1;
                    }
                    if (a.name < b.name) {
                        return -1;
                    }

                    return 0;
                });

                resolve(towns);
            }
  
        };
        const transferFailed = () => {
            reject();
        };
        const transferCanceled = () => {
            reject();
        };

        xhr.addEventListener('load', transferComplete, false);
        xhr.addEventListener('error', transferFailed, false);
        xhr.addEventListener('abort', transferCanceled, false);
        xhr.send();
    });            
}

/*
 Функция должна проверять встречается ли подстрока chunk в строке full
 Проверка должна происходить без учета регистра символов

 Пример:
   isMatching('Moscow', 'moscow') // true
   isMatching('Moscow', 'mosc') // true
   isMatching('Moscow', 'cow') // true
   isMatching('Moscow', 'SCO') // true
   isMatching('Moscow', 'Moscov') // false
 */
function isMatching(full, chunk) {
    chunk = chunk.toLowerCase();
    full = full.toLowerCase();

    if (full.indexOf(chunk) < 0) {

        return false;
    }
        
    return true;  
}

/* Блок с надписью "Загрузка" */
const loadingBlock = homeworkContainer.querySelector('#loading-block');
/* Блок с текстовым полем и результатом поиска */
const filterBlock = homeworkContainer.querySelector('#filter-block');
/* Текстовое поле для поиска по городам */
const filterInput = homeworkContainer.querySelector('#filter-input');
/* Блок с результатами поиска */
const filterResult = homeworkContainer.querySelector('#filter-result');

filterInput.addEventListener('keyup', function(e) {
    // это обработчик нажатия кливиш в текстовом поле
    let str = e.target.value;
    let listFilterResults = '';

    if (str !== '') {
        for (let i = 0; i < allTowns.length; i++) {
            if (isMatching(allTowns[i].name, str)) {
                listFilterResults += '<div>' + allTowns[i].name + '</div>';
            }
        }
    }
    filterResult.innerHTML = listFilterResults;
});  

updateBlock.addEventListener('click', function(e) {
  updateTowns();
});  

export {
    loadTowns,
    isMatching
};
