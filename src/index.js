/* ДЗ 2 - работа с массивами и объектами */

/*
 Задание 1:

 Напишите аналог встроенного метода forEach для работы с массивами
 Посмотрите как работает forEach и повторите это поведение для массива, который будет передан в параметре array

 */
function forEach(array, fn) {
	
	for (let i = 0; i < array.length; i++) {
		
		fn(array[i], i, array);
	}	
}

/*
 Задание 2:

 Напишите аналог встроенного метода map для работы с массивами
 Посмотрите как работает map и повторите это поведение для массива, который будет передан в параметре array
 */
function map(array, fn) {
	var result = [];
	
	for (let i = 0; i < array.length; i++) {
		
		result.push( fn(array[i], i, array) );
	}	
	
	return result;
}

/*
 Задание 3:

 Напишите аналог встроенного метода reduce для работы с массивами
 Посмотрите как работает reduce и повторите это поведение для массива, который будет передан в параметре array
 */
function reduce(array, fn, initial) {
	let i = initial ? 0 : 1;
	let result = initial ? initial : array[0];
	
	for (i; i < array.length; i++) {	
		result = fn(result, array[i], i, array);
	}	
	
	return result;
}

/*
 Задание 4:

 Функция должна перебрать все свойства объекта, преобразовать их имена юtoUpperCase и вернуть в виде массива

 Пример:
   upperProps({ name: 'Сергей', lastName: 'Петров' }) вернет ['NAME', 'LASTNAME']
 */
function upperProps(obj) {
	var result = [];
	
	for (var prop in obj) {
		
		result.push( prop.toUpperCase() );
	}		
	
	return result;
}

/*
 Задание 5 *:

 Напишите аналог встроенного метода slice для работы с массивами
 Посмотрите как работает slice и повторите это поведение для массива, который будет передан в параметре array
 */
function slice(array, from = 0, to = array.length) {
	let len = array.length;

	to = (to >= 0) ? to : len + to;
  if (to > len) to = len;
	if (to < -len) to = -len;
	
	from = (from >= 0) ? from: len + from;
  if (from > len) from = len;
	if (from < -len) from = 0;
	

	let size = to - from;
	
	let result = [];
	if (size > 0) {	
		for (let i = 0; i < size; i++) {
       result[i] = array[from + i];
    }
	}	

	return result;	
}

/*
 Задание 6 *:

 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат
 */
function createProxy(obj) {
}

export {
    forEach,
    map,
    reduce,
    upperProps,
    slice,
    createProxy
};
