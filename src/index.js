/* ДЗ 6 - Асинхронность и работа с сетью */

/*
 Задание 1:

 Функция должна возвращать Promise, который должен быть разрешен через указанное количество секунду

 Пример:
   delayPromise(3) // вернет promise, который будет разрешен через 3 секунды
 */
function delayPromise(seconds) {
	let p = new Promise(function(resolve) {
        setTimeout(function() {
            return resolve();
        }, seconds * 1000);
    });
    return p;    
}

/*
 Задание 2:

 2.1: Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json

 2.2: Элементы полученного массива должны быть отсортированы по имени города

 Пример:
   loadAndSortTowns().then(towns => console.log(towns)) // должна вывести в консоль отсортированный массив городов
 */
function loadAndSortTowns() {

  let p = new Promise(function(resolve) {
     let towns = [];

    // отправить запрос https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json', false);
    xhr.send();

    if (xhr.status != 200) {
      // обработать ошибку
      alert( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
    } else {
      // вывести результат
      // alert( xhr.responseText ); // responseText -- текст ответа.
      let obj;
      try {
        obj = JSON.parse(xhr.responseText);
      } catch (e) {
        alert( "Некорректный ответ " + e.message );
      }
  /*    for (let i = 0; i < obj.length; i++) {
         console.log(obj[i]);
   
      }

      for(let o in obj) { 
          console.log(obj[o].name);
          towns.push(obj[o].name) 
      }*/
      //towns = xhr.responseText;

      for(let o in obj) { 
       //   console.log(obj[o].name);
          towns.push(obj[o].name) 
      }
      console.log(obj);
    }
    // отсортировать массив
    towns.sort();
    console.log(towns);

     
  });

  return p;    
}

export {
    delayPromise,
    loadAndSortTowns
};
