const express=require('express')
const commentRoute=express.Router();
const { ensureAuthentication } = require("../middleware/auth");
const { addComment,getEditComment,deleteComment,updateComment } = require('../controller/commentController');



commentRoute.post('/post/:id/comment',ensureAuthentication,addComment)
commentRoute.get('/comment/:id/edit',getEditComment)
commentRoute.put('/comment/:id',ensureAuthentication,updateComment)
commentRoute.delete('/comment/:id',ensureAuthentication,deleteComment)
module.exports=commentRoute;