// todo что-то недоудаляется,
// todo мусор в таблице
// фильтр
/*
если при добавлении указано имя существующей cookie, то в таблице не должно быть дублей
HeadlessChrome 0.0.0 (Windows 10 0.0.0)
AssertionError: в таблице обнаружен дубль
at Context.<anonymous> (webpack:///test/cookie.js:99:19 <- test/cookie.js:1089:30)

Фильтрация
✖ выводить список cookie, имя или значение которых соответствует фильтру
HeadlessChrome 0.0.0 (Windows 10 0.0.0)
AssertionError: 2 == 1
at Context.<anonymous> (webpack:///test/cookie.js:165:23 <- test/cookie.js:1157:34)

✖ добавлять cookie в таблицу, только если значение cookie соответствует фильтру
HeadlessChrome 0.0.0 (Windows 10 0.0.0)
AssertionError: 2 == 1
at Context.<anonymous> (webpack:///test/cookie.js:185:23 <- test/cookie.js:1177:34)

✖ не добавлять cookie в таблицу, если значение cookie не соответствует фильтру
HeadlessChrome 0.0.0 (Windows 10 0.0.0)
AssertionError: 2 == 1
at Context.<anonymous> (webpack:///test/cookie.js:210:23 <- test/cookie.js:1202:34)

✖ удалить cookie из табилицы, если ее значение перестало соответствовать фильтр
HeadlessChrome 0.0.0 (Windows 10 0.0.0)
AssertionError: 4 == 2
at Context.<anonymous> (webpack:///test/cookie.js:239:23 <- test/cookie.js:1231:34)*/

//http://html-css-php-js.ru/learn/javascript/cookies/get-cookies.html
/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

// возвращает cookie с именем name, если есть, если нет, то undefined
/*function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
function deleteCookie(name) {
  setCookie(name, "", {
    expires: -1
  })
}*/

function createItem(list, name, value) {
  let tr = document.createElement('tr');
    let thName = document.createElement('td');
    let thValue = document.createElement('td');
    let thButton = document.createElement('button');

    thName.className = '';  
    thName.innerHTML = name;
    tr.appendChild(thName);

    thValue.className = '';  
    thValue.innerHTML = value;
    tr.appendChild(thValue);

    thButton.className = 'delete-cookie';  
    thButton.innerHTML = 'удалить';
    tr.appendChild(thButton);
    
  tr.className = '';  
  list.appendChild(tr);
}

function deleteCookieTR(e) {
  e = e || window.event;

  if (e.target.classList.contains('delete-cookie')) {
    console.log(e.target.parentNode);
    console.log(listTable);
    listTable.removeChild(e.target.parentNode);

    var cookieName = e.target.parentNode.children[0].innerHTML;
    var cookieValue = e.target.parentNode.children[1].innerHTML;
    console.log(cookieName);
    console.log(cookieValue);
    document.cookie = cookieName + ' = ' + cookieValue + '; expires = ' + new Date(0);
  }  
}    

homeworkContainer.addEventListener('click', deleteCookieTR);


function setCookie(name, value, options) {
  options = options || {};

  var expires = options.expires;

  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }

  value = encodeURIComponent(value);

  var updatedCookie = name + "=" + value;

  for (var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }

  document.cookie = updatedCookie;
}

function updateItems() {
  // очистить список
  for (let i = 0; i < listTable.children.length; i++)
    listTable.removeChild(listTable.children[i]);

  // пройти по всем кукам
  // получаем строку куков
  let cookieStr = document.cookie;
  // разбиваем на массив
  let cookieArray = cookieStr.split(';');
  // удалим пробельные символы (если они, вдруг, есть) в начале и в конце у каждой куки
  for (let j = 0; j < cookieArray.length; j++) {
    cookieArray[j] = cookieArray[j].replace(/(\s*)\B(\s*)/g, '');
  }

  // результирующий упорядоченный массив
  // каждый элемент будет объектом с методами name и value                                                                       
  // name - имя куки, value - упорядоченный массив значений куки
  let cookieNameArray = new Array({name: '', value: new Array()});    

  // обрабатываем каждую куку
  for (let i = 0; i < cookieArray.length; i++) {
    let keyValue = cookieArray[i].split('='),     // разделяем имя и значение       
    cookieVal = unescape(keyValue[1]).split(';'); // разделяем значения, если они заданы перечнем
    // удаляем пробельные символы  (если они, вдруг, есть) у значений в начале и в конце
    for (let j=0; j<cookieVal.length; j++) {
      cookieVal[j] = cookieVal[j].replace(/(\s*)[\B*](\s*)/g, '');
    }
    keyValue[0] = keyValue[0].replace(/(\s*)[\B]*(\s*)/g, '');
    // вот получился такой cookie-объект
    cookieNameArray[i] = {
      name: keyValue[0],
      value: cookieVal
    };
  };

  console.log('cookies = ', cookieNameArray);

  for (let i = 0; i < cookieNameArray.length; i++) {
    let values = '';
    console.log('coo = ', cookieNameArray[i].name);
    for (let j = 0; j < cookieNameArray[i].value.length; j++) {
      console.log('val = ', cookieNameArray[i].value[j]);
      values += ' ' + cookieNameArray[i].value[j];
    }
    createItem(listTable, cookieNameArray[i].name, values);
  }
}

// вывести доступные куки
updateItems();

filterNameInput.addEventListener('keyup', function(e) {
  // здесь можно обработать нажатия на клавиши внутри текстового поля для фильтрации cookie
  console.log('keyup');
  if (e.keyCode !==13) return;
  if (!e.target.value) return;
  
  let str = e.target.value.toLowerCase();  
  console.log(str);
  for (const item of listTable.children) {
    let cookie = item.children[1].innerHTML.toLowerCase();
    if (cookie.indexOf(str) < 0) {
      //item.style.display = 'none';
      console.log('del', str);
    }
    else {
      //item.style.display = 'flex';
      console.log('add', str);
    }
  }

  e.target.value = '';
});

addButton.addEventListener('click', () => {
    // здесь можно обработать нажатие на кнопку "добавить cookie"
    if (!addNameInput.value || !addValueInput.value) {
      console.log('пусто!');
      return;
    }  
    console.log('addButton');
    document.cookie = addNameInput.value + ' = ' + addValueInput.value;
    console.log('cookie = ', document.cookie);
    updateItems();
});
