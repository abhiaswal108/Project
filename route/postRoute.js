const express=require("express")
const postRoute=express.Router()
const upload=require("../config/multer")


const Post=require('../model/Post')
const {getPostForm,createPost,getPosts,getPostById}=require('../controller/postController')
const { ensureAuthentication } = require("../middleware/auth")
postRoute.get('/Add',getPostForm)
postRoute.post('/Add',ensureAuthentication,upload.array("image",5),createPost)
postRoute.get('/',getPosts)
postRoute.get('/:id',getPostById)
module.exports=postRoute;
