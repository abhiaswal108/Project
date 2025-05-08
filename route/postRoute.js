const express=require("express")
const postRoute=express.Router()
const upload=require("../config/multer")

const Post=require('../model/Post')
const {getPostForm,createPost}=require('../controller/postController')
postRoute.get('/Add',getPostForm)
postRoute.post('/Add',upload.array("image",5),createPost)
module.exports=postRoute;
