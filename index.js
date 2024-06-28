const express = require("express")

const { connectMongoDb } = require('./connection/connections')
const userRouter = require('./routes/user')
const { logReqRes } = require('./middlewares')

const app = express();
const PORT = 8000;

// Mongodb connection
connectMongoDb('mongodb://127.0.0.1:27017/basic_rest_api')

// Middlewares :
app.use(express.urlencoded({ extended: false })) // this middileware is use for: post req data -> objet
app.use(logReqRes('Log.txt'))

// Routes
app.use('/api/users', userRouter)


app.listen(PORT , () => {
    console.log(`Server Started at Port ${PORT}`)
})