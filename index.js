const express = require('express')
const todoRouter = require('./src/routers/user')
require('./src/db/mongoose')

const app = express()
app.use(express.json()) // retern data json to --> object
app.use(todoRouter)
const port = 3000
app.listen(port, () => {
    console.log('Server Is Running');
})
