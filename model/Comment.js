const mongoose=require("mongoose")
const commentSchema=new mongoose.Schema({
content:{
    type:String
},
author:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Users"
},
post:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Posts"
},
timestamp: {
    type: Date,
    default: Date.now  // Sets to current time when document is created
  }
})

const Comment=mongoose.model("Comments",commentSchema)
module.exports=Comment