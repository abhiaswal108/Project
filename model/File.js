const mongoose=require("mongoose")
const fileSchema=new mongoose.Schema({
url:{
    type:String
},
public_id:{
    type:String
},
uploadedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Users"
},
timestamp: {
    type: Date,
    default: Date.now  // Sets to current time when document is created
  }
})

const File=mongoose.model("Files",fileSchema)
module.exports=File