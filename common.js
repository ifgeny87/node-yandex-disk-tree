/**
 * Возвращает человееским языком размер памяти
 * @param size
 * @returns {string}
 */
exports.getHumanMemorySize = function getHumanMemorySize(size) {
	if (size < 10000) return size + 'b'
	size /= 1024
	if (size < 10000) return size.toFixed(1) + 'Kb'
	size /= 1024
	if (size < 10000) return size.toFixed(1) + 'Mb'
	size /= 1024
	if (size < 10000) return size.toFixed(2) + 'Gb'
	size /= 1024
	return size.toFixed(2) + 'Tb'
}

/**
 * Добавляет слева повторяющиеся строки glue к строке str о длины n
 *
 * console.log(F.padLeft('hello', 20))              --> '               hello'
 * console.log(F.padLeft('hello', 20, '_'))         --> '_______________hello'
 * console.log(F.padLeft('hello', 20, '_-'))        --> '_-_-_-_-_-_-_-_hello'
 * console.log(F.padLeft('hello', 10, '_-9835928376892739867293861241211251'))  --> '_-983hello'
 * console.log(F.padLeft('hello', 3, '_-9835928376892739867293861241211251'))   --> 'hello'
 *
 * @param str
 * @param n
 * @param glue
 * @returns {string}
 */
exports.padLeft = function padLeft(str, n = 0, glue = ' ') {
	return str.length < n
		? Array(n + 1).join(glue).substr(0, n - str.length) + str
		: str
}

/**
 * Добавляет справа повторяющиеся строки glue к строке str о длины n
 *
 * console.log(F.padRight('hello', 20))             --> 'hello               '
 * console.log(F.padRight('hello', 20, '_'))        --> 'hello_______________'
 * console.log(F.padRight('hello', 20, '_-'))       --> 'hello_-_-_-_-_-_-_-_'
 * console.log(F.padRight('hello', 10, '_-9835928376892739867293861241211251')) --> 'hello_-983'
 * console.log(F.padRight('hello', 3, '_-9835928376892739867293861241211251'))  --> 'hello'
 *
 * @param str
 * @param n
 * @param glue
 * @returns {string}
 */
exports.padRight = function padRight(str, n = 0, glue = ' ') {
	return str.length < n
		? str + Array(n + 1).join(glue).substr(0, n - str.length)
		: str
}