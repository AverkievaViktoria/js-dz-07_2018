import { 
    // фильтрация списка
    filterFriends
} from './utils';

import './styles/styles.scss';

// указатели
// ///////////////////////////////////////////
// зона оба списка 
const lists = document.querySelector('#js-lists');
// зона левого списка - все друзья 
const listAll = document.querySelector('#js-list-all');
// зона правого списка - выбранные друзья
const listSelected = document.querySelector('#js-list-selected');
// фильтр input для левого списка - все друзья 
const filterAll = document.querySelector('#js-filter-all');
// фильтр input для правого списка - выбранные друзья
const filterSelected = document.querySelector('#js-filter-selected');
// кнопка сохранить списки
const save = document.querySelector('#js-save');

// переменные
// ///////////////////////////////////////////
// постоянное хранилище
let storage = localStorage;
// список друзей
var data = [
    /*{
        id: 0,
        first_name: 'Иван',
        last_name: 'Петров',
        photo_100: './src/images/no_photo.jpg',
        selected: false
    }
    */
];

// обработчики
// ///////////////////////////////////////////
// фильтрация левого списка
filterAll.addEventListener('keyup', e => {
    filterFriends(document.querySelector('#js-list-all'), e.target.value);
});
// фильтрация правого списка
filterSelected.addEventListener('keyup', e => {
    filterFriends(document.querySelector('#js-list-selected'), e.target.value);
});
// сохранить списки в localStorage
save.addEventListener('click', () => {
    //console.log(data);
    storage.clear();
    storage.setItem('data', JSON.stringify(data));
    alert('Списки сохранены.');
});
// обработка нажатия на кнопку для переноса из одного списка в другой
lists.addEventListener('click', function(e) {
    let listAdd = listAll;
    let listRemove = listSelected;
    if (e.target.classList.contains('js-add')) {
        listAdd = listSelected;
        listRemove = listAll;
    }
    if ( e.target.classList.contains('js-add') || e.target.classList.contains('js-remove') ) {
        const li = e.target.parentNode;
        const id = li.getAttribute('data-id');

        listRemove.removeChild(li);
//      console.log(data);
        data.forEach(friend => {
//      console.log(friend.id);
//      console.log(id);

            if (friend.id == id) {
                friend.selected = !friend.selected;
                listAdd.appendChild(createFriendNode(friend));
//              console.log(friend);
                return;
            }
        });
    } 
});

// ///////////////////////////////////////////
// при обновлении страницы
loadFriendsFromStorage();
/*
function union_arr(arr1, arr2) {
    // объединяем массивы
    var arr3 = arr1.concat(arr2);
    console.log(arr3);
    // сортируем полученный массив
    arr3.sort();
    // формируем новый массив без повторяющихся элементов
    var arr = [arr3[0]]; 
    for (var i = 1; i < arr3.length; i++) {
        if (arr3[i] != arr3[i-1]) {
            arr.push(arr3[i]);
        }
    }
    return arr;
}*/

// загрузка списка друзей из VK или localStorage
// ///////////////////////////////////////////
// загружать при обновлении страницы
function loadFriendsFromStorage() {
    data = JSON.parse(storage.data || '{}');
    console.log(data);
    // первым читаем всегда localStorage (здесь проверка не нужна???)
    renderFriends(data);
}

// загружать, если есть доступ к ВК
// перекинуть данные из формата ВК в формат data
function loadFriendsFromVK(friends) {
    let resData = [];
    friends.forEach(function(friend) {
        //console.log('friend', friend);
        let item = {};
        item.id = friend.id;
        item.first_name = friend.first_name;
        item.last_name = friend.last_name;
        item.photo_100 = friend.photo_100;
        item.selected = false;
        resData.push(item);
    });

    console.log('data after VK', resData);

    // сравнить с localStorage, убрать дубли
    // todo - выделить в функцию
    let result = [...data, ...resData];
    result = result.filter((el, i) => {
        result.findIndex(item => {
            console.log('i', item);
            return (item.id === el.id)
        }) === i
    });
    console.log('result = ', result);

    return resData;//result;
}

VK.init({
    apiId: 6667188
});

function auth() {
    return new Promise((resolve, reject) => {
        VK.Auth.login(function(response) {
            if (response.session) {
                console.log('всё ок!');
                resolve();
            } else {
                console.log('Не удалось авторизоваться');
                reject(new Error('Не удалось авторизоваться'));
            }
        }, 2);
    });
}

function callAPI(method, params) {
    params.v = '5.76'

    return new Promise( (resolve, reject) => {

        VK.api(method, params, (data => {
            if (data.error) {
                console.log('reject(data.error);');
                reject(data.error);
            } else {
                console.log('resolve(data.response);');
                resolve(data.response);
            }
        }))
    })
}

auth()
    .then(() => {
        console.log('.then(() => {');   
        return callAPI('users.get', {'name_case': 'gen'});
    })
    .then(([me]) => {   
        console.log('.then(([me])');    
        const headerInfo = document.querySelector('.header-title')
        headerInfo.textContent = `Друзья на странице ${me.first_name} ${me.last_name}`;

        return callAPI('friends.get', { fields: 'city, country, photo_100'});
    })
    .then (friends => {
       console.log('friends = ', friends);
       // сохранить друзей в списке с флагами
       data = loadFriendsFromVK(friends.items);
       renderFriends(data);
    })
    .catch (() => {
        console.log('catch');
    });
    
      
// ////////////////////////////////////////////
// перетащить друга из одного списка в другой
makeDnD([listAll, listSelected]);
function makeDnD(zones) {
    let currentDrag;

    zones.forEach(zone => {
        function handleDragStart(e) {
            // запомнить, кого тащим  
            if (e.target.classList.contains('js-draggable')) {
                currentDrag = { source: zone, node: e.target };
            }
            //console.log(currentDrag);
        }

        function handleDragOver(e) {
            e.preventDefault();
            // ничего не делать

            return false;
        }

        function handleEnter(e) {
            const target = e.target.parentElement;
            if (!target.matches('li')) return;
            console.log(target);
        }

        function handleDrop(e) {
        // завершение перетаскивания 
        //- удалить элемент на старом месте
        //- создать элемент на новом месте
            if (currentDrag) {
                e.preventDefault();

        //console.log('cur', currentDrag, e);
                if (currentDrag.source !== zone) {
                    console.log('zone ', zone);
                    console.log('e.target ', e.target);
                    if (e.target.classList.contains('js-draggable')) {
        ///console.log('cur', currentDrag, e);
                    
                    } else {

                        //if (zone.classList.contains('js-list-selected')) {
                        if (zone.getAttribute('id') == 'js-list-selected') {
                            console.log(' currentDrag.node = ',currentDrag.node, e.target.nextElementSibling);
                            const li = currentDrag.node;
                            console.log(li);
                            const id = li.getAttribute('data-id');
                            console.log(id);
                            data.forEach(friend => {
                                if (friend.id == id) {
                                    console.log(friend);
                                    friend.selected = true;
                                    const friendBtn = li.children[2];
                                    console.log(friendBtn);
                                    friendBtn.className = 'list-item--btn js-remove';
                                    friendBtn.src = `./src/images/remove.png`;

                                    return;
                                }
                            });
                            zone.insertBefore(currentDrag.node, zone.lastElementChild);
                        } else {
                            const li = currentDrag.node;
                            console.log(li);
                            const id = li.getAttribute('data-id');
                            console.log(id);
                            data.forEach(friend => {
                                if (friend.id == id) {
                                    console.log(friend);
                                    friend.selected = false;
                                    const friendBtn = li.children[2];
                                    console.log(friendBtn);
                                    friendBtn.className = 'list-item--btn js-add';
                                    friendBtn.src = `./src/images/add.png`;

                                    return;
                                }
                            });
                            zone.insertBefore(currentDrag.node, zone.lastElementChild);
                        }
                    }
                }
                currentDrag = null;
            }
        }
            
        zone.addEventListener('dragstart', handleDragStart, false);
        zone.addEventListener('dragover', handleDragOver, false);
        zone.addEventListener('drop', handleDrop, false);
        zone.addEventListener('dragenter', handleEnter, false);
    })   
}

// шаблон для вставки
var templateRenderFriends = function(data) {
    var all = [];
    var selected = [];
    var templateFn = Handlebars.compile(templateList.innerHTML), template;

    data.forEach(function(friend) {
        if (friend.selected) {
            selected.push(friend);
        } else {
            all.push(friend);
        }
    });

    template = templateFn({ list: all });
    listAll.innerHTML += template;
    template = templateFn({ list: selected });
    listSelected.innerHTML += template;
};

// ///////////////////////////////////////////
// создание элементов списка на странице
function renderFriends(friends) {
    var all = [];
    var selected = [];

    friends.forEach(function(friend) {
        if (friend.selected) {
            selected.push(friend);
        } else {
            all.push(friend);
        }
    });

    all.map(createFriendNode).forEach(node => {
        listAll.appendChild(node);
    });
    selected.map(createFriendNode).forEach(node => {
        listSelected.appendChild(node);
    });
}

function createFriendNode(friend) {
    const friendNode = document.createElement('li');
    const friendName = document.createElement('div');
    const friendPhoto = document.createElement('img');
    const friendBtn = document.createElement('img');

    friendNode.className = 'list-item js-draggable';
    friendNode.draggable = true;
    friendNode.setAttribute('data-id', friend.id);

    friendPhoto.className = 'list-item--ava';
    friendPhoto.src = friend.photo_100;
    friendPhoto.draggable = false;
    friendNode.appendChild(friendPhoto);

    friendName.className = 'list-item--name';
    friendName.innerHTML = `${friend.first_name} ${friend.last_name}`;
    friendNode.appendChild(friendName);

    if (friend.selected) {
        friendBtn.className = 'list-item--btn js-remove';
        friendBtn.src = `./src/images/remove.png`;
    } else {
        friendBtn.className = 'list-item--btn js-add';
        friendBtn.src = `./src/images/add.png`;
    }
    friendBtn.draggable = false;
    friendNode.appendChild(friendBtn);

    return friendNode;
}
