global.isProduction = (process.env.NODE_ENV !== 'development')

require('module-alias/register')
const chalk = require('chalk')

console.log(new Date() + ': Server starts in ' + chalk.blue.underline(global.isProduction ? 'PRODUCTION' : 'DEVELOPMENT') + ' mode')

const log = require('@/libs/log')(module)
const express = require('express')
const path = require('path')

// express middlewares
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const errorhandler = require('errorhandler')
const sendHttpError = require('@/middleware/sendHttpError')

// config
const config = require('@/config')

// create Express instance
const app = express()

// use middlewares
app.use(morgan(global.isProduction ? 'combined' : 'dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(session({
    secret: config.get('session:secret'),
    key: config.get('session:key'),
    cookie: config.get('session:cookie'),
    resave: true,
    saveUninitialized: true
}))
app.use(sendHttpError)

// static files
app.use(express.static(path.resolve(__dirname, 'static')))

// setup routes
// require('@/routes')(app)

// default error handler
app.use((req, res, next) => next(404))

// errors
const HttpError = require('@/errors').HttpError

// error handler
app.use((err, req, res, next) => {
    if (typeof err === 'number') {
        // если ошибка содержит число, конвертим ошибку в тип HttpError
        // ex: next(404)
        err = new HttpError(err)
    }

    if (err instanceof HttpError) {
        res.sendHttpError(err)
    }
    else {
        log.error(err)

        if (global.isProduction) {
            // если возникла нетипичная ошибка, то в режиме production отправляем статус 500
            err = new HttpError(500)
            res.sendHttpError(err)
        }
        else {
            // в режиме разработки пишем полную ошибку
            errorhandler()(err, req, res, next)
        }
    }
})

//
// setup http server
//
const http = require('http')
const server = http.createServer(app)

server.on('error', onError)
server.on('listening', onListening)
server.listen(config.get('port'))

/*
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges')
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.error(bind + ' is already in use')
            process.exit(1)
            break
        default:
            throw error
    }
}

/*
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    const addr = server.address()
    const bind = (typeof addr === 'string')
        ? 'pipe ' + addr
        : 'port ' + addr.port

    log.info('Listening on ' + bind)
}