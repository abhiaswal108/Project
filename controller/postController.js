
const Post=require('../model/Post')

const File=require('../model/File')

exports.getPostForm=((req,res)=>{
    res.render("newPost",{
        title:"Create Post",
        user:req.user
    })
})

exports.createPost=(async(req,res)=>{
    const {title,content}=req.body
    if(!req.files||req.files.length===0){
      
        return res.render("newPost",{
            title:"Create Post",
            user:req.user,
            error:"Atleast One Image"
        })
    }
    const images=await Promise.all(req.files.map(async(file)=>{
        //Save image in FIle DB
        const newFile=new File({
            url:file.path,
            public_id:file.filename,
            uploadedBy:req.user._id

        })
        await newFile.save();
        return{
 url:newFile.url,
 public_id:newFile.public_id,

        }
    }))

    const newPost=new Post({
        title,
        content,
        author:req.user._id,
        images
    })
    await newPost.save();

    res.render('/')
})