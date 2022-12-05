const mongoose = require('mongoose')

const Schema = mongoose.Schema

const quoteSchema = new Schema({
    quote_text: {
        type: String,
        required: true,
    },
    author_name: {
        type: String,
        required: true,
    }
}, { timestamps: true })

module.exports = mongoose.model('Quote', quoteSchema)

