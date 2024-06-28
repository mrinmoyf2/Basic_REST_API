const express = require("express")
const fs = require("fs")
const mongoose = require("mongoose")

const users = require("./MOCK_DATA.json")

const app = express();
const PORT = 8000;

// Mongodb connection
mongoose.connect("mongodb://127.0.0.1:27017/basic_rest_api")
.then(() => 
    console.log("MongoDB Connected")
)
.catch((err) => console.log("Mongo Error", err))

// Mongoose Schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: Number,
    },
    jobTitle: {
        type: String,
    },
    gender: {
        type:String,
    }, 
},
    { timestamps: true }
)

// create a model basen on that Schema
const User = mongoose.model("users", userSchema)

// Middlewares :

app.use(express.urlencoded({ extended: false })) // this middileware is use for: post req data -> objet

app.use((req, res, next) => {   
    fs.appendFile(
        "Log.txt", 
        `\n${Date.now().toString()} : ${req.method} : ${req.path}`, (err, data) => {
        next()
    })
})

//Routes :
app.get('/users', (req, res) => {
    const html = `
    <ul>
        ${users.map(user => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `
    res.send(html)
})

// REST API

app.get('/api/users', (req, res) => {
    console.log(req.headers)     // Read the Req. headers
    res.setHeader("X-Data_contain", "Basic_rest_api")  // Coustom Headers , Always use "X-" for coustom header , for better practics
    return res.json(users)
})

app.route('/api/users/:id').get((req, res) => {
    const id = Number(req.params.id)
    const user = users.find((user) => user.id === id)
    return res.json(user)
}).patch((req, res) => {
    // TODO : Create new user
    return res.json({ status : "pending.." })
}).delete((req, res) => {
     // TODO : delete the user with id
     return res.json({ status: "pending..." })
})

app.post('/api/users',async (req , res) => {
    const body = req.body
    if(
        !body ||
        !body.first_name ||
        !body.last_name ||
        !body.email ||
        !body.ph_no ||
        !body.gender ||
        !body.job_title
    ){
        return res.status(400).json({msg: "All fields are required..."})
    }
    const result = await User.create({
        firstName: body.first_name,
        lastName: body.last_name,
        email: body.email,
        phoneNo: body.ph_no,
        gender: body.gender,
        jobTitle: body.job_title,
    }) 
    return res.status(201).json({msg: 'success'})
})


app.listen(PORT , () => {
    console.log(`Server Started at Port ${PORT}`)
})