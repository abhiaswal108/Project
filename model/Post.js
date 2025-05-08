const mongoose=require("mongoose")
const postSchema=new mongoose.Schema({
title:{
    type:String
},
content:{
    type:String
},
author:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Users"
},
profilePic:[{
    url:{
        type:String
    },
    public_id:{
        type:String
    }
}],
comment:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Comments"
}],
})

const Post=mongoose.model("Posts",postSchema)
module.exports=Post