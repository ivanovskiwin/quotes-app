const express = require('express')
const {
    getQuotes,
    getRandomQuote,
    fetchQuotesFromApi
} = require('../controllers/quoteController')
const router = express.Router()


router.get('/random-quote', getRandomQuote)

router.get('/generate', fetchQuotesFromApi)

router.get('/:limit?', getQuotes)


module.exports = router