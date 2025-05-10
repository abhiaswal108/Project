const express=require("express")
const userRoute=express.Router()
const User=require('../model/User')
const {getUserProfile,getEditForm,updateUser}=require('../controller/userController')
const { ensureAuthentication } = require("../middleware/auth")
const upload = require("../config/multer")

userRoute.get('/profile',ensureAuthentication,getUserProfile)
userRoute.get('/edit',ensureAuthentication,getEditForm)
userRoute.post('/:id/edit',ensureAuthentication,upload.single("profilepicture"),updateUser)
module.exports = userRoute; 
