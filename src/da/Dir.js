module.exports = class Dir {
	constructor(name) {
		this.name = name
		this.dirs = []
		this.files = []
		this.size = 0
		this.allFilesCount = 0
	}

	// поиск подпапок по имени
	findDirs(name) {
		return this.dirs.filter(d => d.name === name)
	}

	// поиск файлов по имени
	findFiles(name) {
		return this.files.filter(f => f.name === name)
	}

	// добавление подпапки
	// метод не проверяет наличие такой папки
	addDir(dir) {
		this.dirs.push(dir)
	}

	// добавление файла
	// метод не проверяет наличие такого файла
	addFile(file) {
		this.files.push(file)
	}

	addFileDeep(path, file) {
		if (path.length === 0) {
			this.addFile(file)
		}
		else {
			const dirName = path.shift()
			// поиск подпапки
			const dirs = this.findDirs(dirName)
			let dir
			if (!dirs || !dirs.length) {
				// подпапка не существует, создаю
				dir = new Dir(dirName)
				this.addDir(dir)
			}
			else {
				// выбрана первая из списка
				dir = dirs[0]
			}

			dir.addFileDeep(path, file)
		}
	}

	// обновляет размер всех подпапок и свой
	// оценка выполняется по сумме размеров всех файлов
	updateSize() {
		let size = 0
		let allFilesCount = 0

		// подпапки
		this.dirs.forEach(d => {
			d.updateSize()
			size += d.size
			allFilesCount += d.allFilesCount
		})

		// файлы
		this.files.forEach(f => size += f.size)

		this.size = size
		this.allFilesCount = allFilesCount + this.files.length
	}
}