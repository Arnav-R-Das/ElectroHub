const mongoose = require('mongoose')

const schemaTemplate = new mongoose.Schema({
    var1: {
        type: String,
        required: true
    },
    var2: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('modelTemplate', schemaTemplate)