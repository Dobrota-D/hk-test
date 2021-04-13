const connection = require('./connection')
const schemas = require('./schemas')

module.exports = {
    connect: connection.connect,
    schemas: {
        Account: schemas.Account,
        Twert: schemas.Twert
    }
}