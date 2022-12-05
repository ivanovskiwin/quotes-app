require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const quotesRoutes = require('./routes/quotes')

const app = express()
const cors = require('cors');

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

app.use(cors({
    origin: 'http://localhost:3000'
}));


//routes
app.use('/api/quotes', quotesRoutes)

//db connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, ()=> {
            console.log(`Db connection ok. Listening on port ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log(err)
    })