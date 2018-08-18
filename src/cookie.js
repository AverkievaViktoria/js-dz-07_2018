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

const getCookies = () => {

    return document.cookie.split('; ').reduce((prev, curr) => {
        const [name, value] = curr.split('=');
       
        if (name != '') {
            prev[name] = value;

            return prev;
        }
    }, {});
}

function updateItems() {
    let allCookies = getCookies();

    // очистить таблицу с куками
    listTable.innerHTML = '';

    for (var cookieName in allCookies) {
        if ( allCookies.hasOwnProperty(cookieName) ) {
            let str = filterNameInput.value;
            let flg = true;

            if ( !isMatching(cookieName, str) && !isMatching(allCookies[cookieName], str) ) {
                flg = false;        
            }
            createItem(listTable, cookieName, allCookies[cookieName], flg);
        }
    }
}

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

// вывести доступные куки
updateItems();

