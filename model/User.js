const mongoose=require("mongoose")
const userSchema=new mongoose.Schema({
username:{
    type:String,
},
email:{
    type:String,
},
password:{
    type:String
},
profilePic:{
    type:String,
    public_id:String
},
bio:{
    type:String
},
post:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Posts"
}],
comment:[{
 type:mongoose.Schema.Types.ObjectId,
    ref:"Comments"
}],

timestamp: {
    type: Date,
    default: Date.now  // Sets to current time when document is created
  }


})

const User=mongoose.model("Users",userSchema)
module.exports=User