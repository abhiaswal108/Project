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
images:[{
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
createdAt: { type: Date, default: Date.now }, 
})

const Post=mongoose.model("Posts",postSchema)
module.exports=Post