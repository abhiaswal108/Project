const express=require("express")
const authRoute=express.Router()
const User=require('../model/User')
const {getLogin,getRegister,postLogin,postRegister,logout}=require('../controller/authController')

authRoute.get('/login',getLogin)
authRoute.post("/register",postRegister)
authRoute.get("/register",getRegister)
authRoute.post("/login",postLogin)
authRoute.get("/logout",logout)
module.exports = authRoute; 
