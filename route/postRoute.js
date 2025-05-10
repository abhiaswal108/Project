const express=require("express")
const postRoute=express.Router()
const upload=require("../config/multer")


const Post=require('../model/Post')
const {getPostForm,createPost,getPosts,getPostById,getEditForm,updatePost,deletePost}=require('../controller/postController')
const { ensureAuthentication } = require("../middleware/auth")
postRoute.get('/Add',getPostForm)
postRoute.post('/Add',ensureAuthentication,upload.array("image",5),createPost)
postRoute.get('/',getPosts)
postRoute.get('/:id',getPostById)
postRoute.get('/:id/edit',getEditForm)
postRoute.put('/:id',ensureAuthentication,upload.array("image",5),updatePost)
postRoute.delete('/:id',ensureAuthentication,deletePost)
module.exports=postRoute;
