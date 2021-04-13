const mongoose = require('mongoose')
const schemas = require('./schemas')

const DB_URI = "mongodb+srv://Ugo_P:WaDUFQj9vMjxEE7O@twitt-r.w4ral.mongodb.net/twitt-rDatabase?retryWrites=true&w=majority"

async function connect() {
    mongoose.connect(DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
}

module.exports = {
    connect: connect()
}