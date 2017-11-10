module.exports = (req, res, next) => {
    res.sendHttpError = err => {
        res.status(err.status)

        let result = {status: err.status, message: err.message}
        if (!global.isProduction) {
            result.stack = err.stack
        }

        // отправляем html если клиент его хочет
        if(req.accepts('html')) {
            res.write(`<h1>${result.status} ${result.message}</h1>`)
            if(result.stack) {
                res.write(`<pre>${result.stack}</pre>`)
            }
        }
        else if(req.accepts('json')) {
            if (res.req.headers['x-requested-with'] === 'XMLHttpRequest') {
                res.join({error: result})
            }
            else {
                res.json({error: result})
            }
        }
        res.end()
    }

    next()
}