const mongoose = require("mongoose")

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


// create a model on that Schema
const User = mongoose.model("user", userSchema)
// MongoDB will automatically pluralize this name('user') to users when it creates the collection, unless you've specified otherwise in the schema option

module.exports = User;