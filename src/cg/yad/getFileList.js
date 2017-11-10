const request = require('request')

const F = require('../../common/index')

const yadApiUri = 'https://cloud-api.yandex.net/v1/disk/resources/files?'

function get(apiToken, offset, next) {
	// API документация
	// https://tech.yandex.ru/disk/api/reference/all-files-docpage/
	request.get({
		url: yadApiUri + `limit=5000&offset=${offset}&preview_size=L`,
		headers: {
			Authorization: 'OAuth ' + apiToken
		}
	}, next)
}

module.exports = function getYadFileList(apiToken, next) {
	const fileList = []
	let allSize = 0
	const start = new Date()

	console.log('# getYadFileList started in ' + start)

	const f = (err, httpResponse) => {
		if (err) {
			console.error(err, httpResponse)
			return next(err, fileList)
		}

		// log
		console.log('	receive bytes : ' + F.getHumanMemorySize(httpResponse.body.length))

		let json

		try {
			json = JSON.parse(httpResponse.body)
			json.items.forEach(i => {
				fileList.push(i)
				if (i.size) allSize += i.size
			})
		}
		catch (e) {
			console.error(e, httpResponse)
			return next(e, fileList)
		}

		// log
		console.log(`	step : ${json.offset} -> ${fileList.length}`)
		console.log('	heap : ' + F.getHumanMemorySize(process.memoryUsage().heapUsed))

		if (json.limit > json.items.length) {
			// завершено
			console.log('	all file size : ' + F.getHumanMemorySize(allSize))
			const length = Date.now() - start.getTime()
			console.log(`	finished in ${length / 1000}`)
			console.log(`	filelist size:  ${fileList.length}`)
			next(null, fileList)
		}
		else {
			// отправляем еще один запрос
			get(apiToken, fileList.length, f)
		}
	}

	get(apiToken, 0, f)
}