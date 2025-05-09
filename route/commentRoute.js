const express=require('express')
const commentRoute=express.Router();
const { ensureAuthentication } = require("../middleware/auth");
const { addComment } = require('../controller/commentController');



commentRoute.post('/post/:id/comment',ensureAuthentication,addComment)
module.exports=commentRoute;