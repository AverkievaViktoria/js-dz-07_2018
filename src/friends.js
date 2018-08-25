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
    /* 
    {
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
    // console.log(data);
    storage.clear();
    storage.setItem('data', JSON.stringify(data));
    alert('Списки сохранены.');
});
// обработка нажатия на кнопку для переноса из одного списка в другой
lists.addEventListener('click', function(e) {
    let listAdd = listAll;
    let listRemove = listSelected;
    let filter = filterAll;

    if (e.target.classList.contains('js-add')) {
        listAdd = listSelected;
        listRemove = listAll;
        filter = filterSelected;
    }
    if ( e.target.classList.contains('js-add') || e.target.classList.contains('js-remove') ) {
        const li = e.target.parentNode;
        const id = li.getAttribute('data-id');

        listRemove.removeChild(li);
        data.forEach(friend => {
            if (friend.id == id) {
                friend.selected = !friend.selected;
                listAdd.appendChild(createFriendNode(friend));

                return;
            }
        });

        filterFriends(listAdd, filter.value);
    } 
});

// ///////////////////////////////////////////
// при обновлении страницы
loadFriendsFromStorage();

// загрузка списка друзей из VK или localStorage
// ///////////////////////////////////////////
// загружать при обновлении страницы
function loadFriendsFromStorage() {
    data = JSON.parse(storage.data || '[]');
    // первым читаем всегда localStorage (здесь проверка не нужна???)
    renderFriends(data);
}

// загружать, если есть доступ к ВК
// перекинуть данные из формата ВК в формат data
function loadFriendsFromVK(friends) {
    let resData = [];

    if (friends) {
        friends.forEach(function(friend) {
            let item = {};

            item.id = friend.id;
            item.first_name = friend.first_name;
            item.last_name = friend.last_name;
            item.photo_100 = friend.photo_100;
            item.selected = false;
            resData.push(item);
        });
    }

    // сравнить с localStorage, убрать дубли
    let result = [...data, ...resData];

    result = result.filter((el, i) => {
        return result.findIndex(item => {
            return (item.id === el.id)
        }) === i
    });

    return result;
}

// загрузка списка друзей из VK
// ///////////////////////////////////////////
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
    params.v = '5.76';

    return new Promise( (resolve, reject) => {

        VK.api(method, params, (data => {
            if (data.error) {
                reject(data.error);
            } else {
                resolve(data.response);
            }
        }))
    })
}

auth()
    .then(() => {
        return callAPI('users.get', { 'name_case': 'gen' });
    })
    .then(([me]) => {   
        const headerInfo = document.querySelector('.header-title')
        
        headerInfo.textContent = `Друзья на странице ${me.first_name} ${me.last_name}`;

        return callAPI('friends.get', { fields: 'city, country, photo_100' });
    })
    .then (friends => {
        // сохранить друзей в списке с флагами
        data = loadFriendsFromVK(friends.items);
        renderFriends(data);
    })
    .catch (() => {
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
        }

        function handleDragOver(e) {
            e.preventDefault();

            return false;
        }

        function handleEnter(e) {
            const target = e.target.parentElement;

            if (!target.matches('li')) {

                return;
            }    
        }

        function handleDrop(e) {
        // завершение перетаскивания 
        // - удалить элемент на старом месте
        // - создать элемент на новом месте
            if (currentDrag) {
                e.preventDefault();

                if (currentDrag.source !== zone) {
                    //if (e.target.classList.contains('js-draggable')) {
                        // todo !!!
                    //} else {

                        if (zone.getAttribute('id') == 'js-list-selected') {
                            const li = currentDrag.node;
                            const id = li.getAttribute('data-id');
                            
                            data.forEach(friend => {
                                if (friend.id == id) {
                                    friend.selected = true;
                                    const friendBtn = li.children[2];
                                    
                                    friendBtn.className = 'list-item--btn js-remove';
                                    friendBtn.src = `./src/images/remove.png`;

                                    return;
                                }
                            });
                            zone.insertBefore(currentDrag.node, zone.lastElementChild);
                            filterFriends(listSelected, filterSelected.value);
                        } else {
                            const li = currentDrag.node;
                            const id = li.getAttribute('data-id');
                            
                            data.forEach(friend => {
                                if (friend.id == id) {
                                    friend.selected = false;
                                    const friendBtn = li.children[2];
                                    
                                    friendBtn.className = 'list-item--btn js-add';
                                    friendBtn.src = './src/images/add.png';

                                    return;
                                }
                            });
                            zone.insertBefore(currentDrag.node, zone.lastElementChild);
                            filterFriends(listAll, filterAll.value);
                        }
                    //}
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

function createFriend(list) {
    var templateFn = require('../friends-template.hbs');

    return templateFn({
        list: list
    });
}

// шаблон для вставки
var templateRenderFriends = function(data) {
    var all = [];
    var selected = [];
    var templateFn = Handlebars.compile(templateList.innerHTML), template;

    if (data) {
        data.forEach(function(friend) {
            if (friend.selected) {
                selected.push(friend);
            } else {
                all.push(friend);
            }
        });
    }    

    template = templateFn({ list: all });
    listAll.innerHTML += template;
    template = templateFn({ list: selected });
    listSelected.innerHTML += template;
};

// ///////////////////////////////////////////
// создание элементов списка на странице
function renderFriends(friends) {
    // очистить списки
    listAll.innerHTML = '';
    listSelected.innerHTML = '';

    var all = [];
    var selected = [];

    if (friends) {
        friends.forEach(function(friend) {
            if (friend.selected) {
                selected.push(friend);
            } else {
                all.push(friend);
            }
        });
    }    

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
        friendBtn.src = './src/images/remove.png';
    } else {
        friendBtn.className = 'list-item--btn js-add';
        friendBtn.src = './src/images/add.png';
    }
    friendBtn.draggable = false;
    friendNode.appendChild(friendBtn);

    return friendNode;
}
