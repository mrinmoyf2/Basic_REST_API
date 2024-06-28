const express = require("express")
const fs = require("fs")
const mongoose = require("mongoose")

//const users = require("./MOCK_DATA.json")

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
app.get('/users',async (req, res) => {
    const allDbUsers = await User.find({})
    const html = `
            <table>
              <tr style="color: blue;">
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number</th>
              </tr>
                    ${allDbUsers.map((user) => `
                        <tr>
                            <th >${user.firstName}</th>
                            <th>${user.email}</th>
                            <th>${user.phoneNumber}</th>
                        <tr>
                        `).join("")}
            </table>
                `
    res.send(html)
})

// REST API

app.get('/api/users',async (req, res) => {
    const allDbUsers = await User.find({})   // Read the Req. headers
    res.setHeader("X-Data_contain", "Basic_rest_api")  // Coustom Headers , Always use "X-" for coustom header , for better practics
    return res.json(allDbUsers)
})

app.route('/api/users/:id')
.get(async (req, res) => {
    // const id = Number(req.params.id)
    // const user = users.find((user) => user.id === id)
    const user = await User.findById(req.params.id);
    if(!user) return res.status(404).json({ error: "User not found" })
    return res.json(user)
}).patch(async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, { lastName: "barma" }) // The changed is fetched from request.
    // TODO : Create new user
    return res.json({ status : "Successfull patch.." })
}).delete(async (req, res) => {
    await User.findByIdAndDelete(req.params.id)
     return res.json({ status: "Successfull Deletation..." })
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
        phoneNumber: body.ph_no,
        gender: body.gender,
        jobTitle: body.job_title,
    }) 
    return res.status(201).json({msg: 'success'})
})


app.listen(PORT , () => {
    console.log(`Server Started at Port ${PORT}`)
})