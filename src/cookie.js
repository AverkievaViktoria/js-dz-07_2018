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

function createItem(list, name, value, showFlg = true) {
    let tr = document.createElement('tr');
    let thName = document.createElement('td');
    let thValue = document.createElement('td');
    let thButton = document.createElement('button');

    thName.innerHTML = name;
    tr.appendChild(thName);

    thValue.innerHTML = value;
    tr.appendChild(thValue);

    thButton.className = 'delete-cookie';  
    thButton.innerHTML = 'удалить';
    tr.appendChild(thButton);
    
    list.appendChild(tr);
    
    if (!showFlg) {
        tr.style.display = 'none';
    }

}

function deleteCookieTR(e) {
    e = e || window.event;

    if (e.target.classList.contains('delete-cookie')) {
        listTable.removeChild(e.target.parentNode);
        
        var cookieName = e.target.parentNode.children[0].innerHTML;
        var cookieValue = e.target.parentNode.children[1].innerHTML;

        document.cookie = cookieName + ' = ' + cookieValue + '; expires = ' + new Date(0);
    }  
}    

homeworkContainer.addEventListener('click', deleteCookieTR);

function updateItems() {
    // очистить список
    for (let i = 0; i < listTable.children.length; i++) {
        listTable.removeChild(listTable.children[i]);
    }

    // пройти по всем кукам
    // получаем строку куков
    let cookieStr = document.cookie;
    //console.log('cookieStr = ', cookieStr);

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
    }

    // очистить таблицу с куками
    listTable.innerHTML = '';
    for (let i = 0; i < cookieNameArray.length; i++) {
        let values = '';

        for (let j = 0; j < cookieNameArray[i].value.length; j++) {
            values += ' ' + cookieNameArray[i].value[j];
        }
        let str = filterNameInput.value;
        let flg = true;

        if (!isMatching(cookieNameArray[i].name, str)) {
            flg = false;        
        }
        createItem(listTable, cookieNameArray[i].name, values, flg);
    }
}

// вывести доступные куки
updateItems();

filterNameInput.addEventListener('keyup', function(e) {
    // здесь можно обработать нажатия на клавиши внутри текстового поля для фильтрации cookie
    let str = e.target.value;  

    for (const item of listTable.children) {
        let cookie = item.children[0].innerHTML;
        
        if (isMatching(cookie, str)) {
            item.style.display = 'table-row';
        } else {
            item.style.display = 'none';
        }
    }
});

addButton.addEventListener('click', () => {
    // здесь можно обработать нажатие на кнопку "добавить cookie"
    if (!addNameInput.value || !addValueInput.value) {

        return;
    }  
    document.cookie = addNameInput.value + ' = ' + addValueInput.value;
    updateItems();
});

function isMatching(full, chunk) {
    chunk = chunk.toLowerCase();
    full = full.toLowerCase();

    if (full.indexOf(chunk) < 0) {

        return false;
    }
        
    return true;  
}
