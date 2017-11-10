const F = require('../common')

const File = require('./File')
const Dir = require('./Dir')

module.exports = class FileTree extends Dir {
	constructor(fileList) {
		super('disk:')

		for (let i in fileList) {
			const file = new File(fileList[i])
			const path = fileList[i].path.split('/')
			path.pop() // имя файла не нужно
			path.shift() // первый уровень - это рут

			this.addFileDeep(path, file)
		}

		this.updateSize()

		console.log('file tree maked. Stats:')
		console.log('dirs : ' + this.dirs.length)
		console.log('files : ' + this.files.length)
		console.log('tree size : ' + F.getHumanMemorySize(this.size))
		console.log('all files count : ' + this.allFilesCount)
	}
}