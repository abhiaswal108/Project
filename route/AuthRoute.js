const express=require("express")
const userRoute=express.Router()
const User=require('../model/User')
const {getLogin,getRegister,postLogin,postRegister,logout}=require('../controller/authController')

userRoute.get('/login',getLogin)
userRoute.post("/register",postRegister)
userRoute.get("/register",getRegister)
userRoute.post("/login",postLogin)
userRoute.get("/logout",logout)
module.exports = userRoute; 
