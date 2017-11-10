const winston = require('winston')
const level = (global.isProduction) ? 'error' : 'debug'

function getLogger(module) {
    let path = module.filename.split(/[\/\\]/).slice(-2).join('/')

    return new winston.Logger({
        transports: [
            new winston.transports.Console({
                timestamp: true,
                colorize: true,
                level,
                label: path
            })
        ]
    })
}

module.exports = getLogger