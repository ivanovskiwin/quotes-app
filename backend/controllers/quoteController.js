const Quote = require('../models/quoteModel')
const fetch = require('node-fetch')
//get all quotes
const getQuotes = async (req, res) => {
    const { limit } = req.params;

    if(limit){
        const quotes = await Quote.find({}).sort({createdAt: -1}).limit(parseInt(limit))
        return res.status(200).json(quotes);
    }

    const quotes = await Quote.find({}).sort({createdAt: -1})
    return res.status(200).json(quotes);

}

//get a random quote
const getRandomQuote = async (req, res) => {
    const randomQuote = await Quote.aggregate([{$sample: {size: 1}}])
    if(!randomQuote){
        return res.status(404).json({message:"Random Quote not found try again later."})
    }
    
    return res.status(200).json(randomQuote);
}

//fetch new quotes from api
const fetchQuotesFromApi = async (req, res) => {
    const quotes = await fetch('https://zenquotes.io/api/quotes')
        .then(quotes=>quotes.json())
        .catch(err=>{
            return res.status(503).json({message:"Third-part API error. Try again later."})
        })

    if(quotes.length){
        for (const quote of quotes) {
            //check if a quote is already in the db by the quote text and author
            try {
                Quote.findOne({ quote_text: quote.q, author_name: quote.a}, async function(error, result) {
                    if (!error) {
                        if (result) {
                            //if item already exists, skip it and continue
                        } else {
                            const newQuote = await Quote.create({quote_text:quote.q, author_name:quote.a})
                        }
                    } else {
                      throw new Error("database error")
                    }
                  });
            } catch (error) {
                    return res.status(500).json({message: "Error has occured in the database. Try again later."})
            }
            
        } 

        return res.status(200).json({message:"Successfully updated quotes."})
    }
    //if there are no quotes returned by the api but the request is successfull.
    return res.status(503).json({message:"Third-part API error. Try again later."})
}

module.exports = {
    getQuotes,
    getRandomQuote,
    fetchQuotesFromApi,
}