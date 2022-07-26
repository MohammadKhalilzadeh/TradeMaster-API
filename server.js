require('dotenv').config()

const express = require('express')
const app = express()
const cors = require("cors")
const mongoose = require('mongoose')
app.use(express.json())

app.use(
    cors({
        origin:"*"
    })
)

app.use('/images',express.static('images'))

app.set('view engine','ejs')

mongoose.connect( process.env.DATABASE_URL, {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))


const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
app.use('/', indexRouter)
app.use('/users', usersRouter)

app.listen(3000, () => console.log("Server Started") )

module.exports = app;