const User = require('../models/user')

async function handleGetAllUsers(req , res) {
    const allDbUsers = await User.find({})
    res.setHeader("X-Data_contain", "Basic_rest_api")  // Coustom Headers , Always use "X-" for coustom header , for better practics
    return res.json(allDbUsers)
}

async function handleGetUserById(req, res){
    const user = await User.findById(req.params.id)
    if(!user) return res.status(401).json({ error: "user not found" })
    return res.json(user)
}   

async function handleUpdateUserById(req, res){
    await User.findByIdAndUpdate(req.params.id, { lastName: "barma" }) // The changed is fetched from request.
    // TODO : Create new user
    return res.json({ status : "Successfull patch.." })
}

async function handleDeleteUserById(req, res){
    await User.findByIdAndDelete(req.params.id)
    return res.json({ status: "Successfull Deletation..." })
}

async function handleCreateNewUser(req, res){
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
        return res.status(201).json({msg: 'success', id: result._id})
}

module.exports = {
    handleGetAllUsers,
    handleGetUserById,
    handleUpdateUserById,
    handleDeleteUserById,
    handleCreateNewUser
}