const express = require("express")
const { 
    handleGetAllUsers, 
    handleGetUserById,
    handleUpdateUserById,
    handleDeleteUserById,
    handleCreateNewUser
    } = require('../controllers/user.controller')

const router = express.Router()

// router.get('/',async (req, res) => {
//     const allDbUsers = await User.find({})
//     const html = `
//             <table>
//               <tr style="color: blue;">
//                 <th>ID</th>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Phone Number</th>
//               </tr>
//                     ${allDbUsers.map((user) => `
//                         <tr>
//                             <th >${user._id}</th>
//                             <th >${user.firstName}</th>
//                             <th>${user.email}</th>
//                             <th>${user.phoneNumber}</th>
//                         <tr>
//                         `).join("")}
//             </table>
//                 `
//     res.send(html)
// })

// REST API

router
    .route('/')
    .get(handleGetAllUsers)
    .post(handleCreateNewUser)

router
    .route('/:id')
    .get(handleGetUserById)
    .patch(handleUpdateUserById)
    .delete(handleDeleteUserById)

module.exports = router