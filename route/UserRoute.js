const express=require("express")
const userRoute=express.Router()
const User=require('../model/User')
const {getUserProfile,getEditForm,updateUser,deleteUser}=require('../controller/userController')
const { ensureAuthentication } = require("../middleware/auth")
const upload = require("../config/multer")

userRoute.get('/profile',ensureAuthentication,getUserProfile)
userRoute.get('/edit',ensureAuthentication,getEditForm)
userRoute.post('/:id/edit',ensureAuthentication,upload.single("profilepicture"),updateUser)
userRoute.post('/delete',ensureAuthentication,deleteUser)
module.exports = userRoute; 
