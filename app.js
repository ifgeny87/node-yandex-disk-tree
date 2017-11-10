const fs = require('fs')
const async = require('async')

const F = require('./src/common')
const getYadFileList = require('./src/cg/yad/getFileList')
const FileTree = require('./src/da/FileTree')

const tokenConfig = require('./user_data/token.config.json')

// здесь будут храниться списки файлов, плоский и дерево
let fileList, fileTree

async.series([
	getFileListFromYad,		// загрузка списка файлов с ЯДа
	saveFileListToDisk,		// сохранение списка файлов на диск
	//loadFileListFromDisk,	// загрузка списка файлов с диска
	makeFileTreeFromList,	// формирование дерева файлов
	printTree,				// печать дерева в консоль
	printBigFilesBySize,	// печать больших файлов, отсортированных по размеру
], (err, result) => {
	if (err) console.error('Apppplication has error', err)
})

function getFileListFromYad(next) {
	getYadFileList(tokenConfig.token.value, (err, fileListResult) => {
		if (err) return next(err)
		fileList = fileListResult
		next(null)
	})
}

function saveFileListToDisk(next) {
	fs.writeFile('user_data/fileList.json', JSON.stringify(fileList), 'utf8', next)
}

function loadFileListFromDisk(next) {
	fs.readFile('user_data/fileList.json', 'utf8', (err, data) => {
		if (err) return next(err)

		fileList = JSON.parse(data)
		console.log('file list loaded. Files count : ' + fileList.length)

		next(null)
	})
}

function makeFileTreeFromList(next) {
	fileTree = new FileTree(fileList)
	next(null)
}

function printTree(next) {
	console.log('-= File tree from root =-')

	const maxLevels = 3

	function printDir(dir, starts, level, maxLevels, allSize, allFileCount) {
		const subStrats = level === 0
			? ''
			: starts + F.padRight('|', 4)

		const pre = level === 0
			? ''
			: starts + '+-- '

		const sizeP = 100 / allSize * dir.size
		const filesP = 100 / allFileCount * dir.allFilesCount

		console.log(F.padRight(pre + dir.name, 40) + '    '
			+ F.padLeft(dir.allFilesCount + ' f', 10) + ' '
			+ F.padRight('(' + filesP.toFixed(1) + '%)', 10) + '    '
			+ F.padLeft(F.getHumanMemorySize(dir.size), 10) + ' '
			+ '(' + sizeP.toFixed(1) + '%)'
		)

		if (maxLevels > level)
			dir.dirs.forEach(dir => printDir(dir, subStrats, level + 1, maxLevels, allSize, allFileCount))
	}

	printDir(fileTree, '', 0, maxLevels, fileTree.size, fileTree.allFilesCount)

	next(null)
}


function printBigFilesBySize(next) {
	console.log('-= Big files =-')

	// ищем файлы, которые занимают больше чем 0.1% от всего занятого размера
	const bigSize = fileTree.size * 0.001

	const list = fileList
		.filter(f => f.size > bigSize)
		.sort((a, b) => b.size - a.size)

	list.forEach(f => {
		const sizeP = 100 / fileTree.size * f.size
		const path = f.path.split('/')
		path.shift()
		path.pop()

		console.log(F.padLeft(F.getHumanMemorySize(f.size), 10) + ' '
			+ F.padRight('(' + sizeP.toFixed(4) + '%)', 15)
			+ F.padRight(f.name, 60) + ' '
			+ path.join('/')
		)
	})

	console.log(`Found ${list.length} big files`)

	next(null)
}
