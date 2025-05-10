
const Post=require('../model/Post')
const cloudinary = require('../config/cloudinary');
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
        console.log('Saved post:', JSON.stringify(newFile, null, 2));  
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

    res.redirect('/post');
})
exports.getPosts=(async(req,res)=>{
const posts=await Post.find();

res.render('posts',{
    title:"Posts",
    posts,
    user:req.user,
 
    success:"",
    error:""
})
})
exports.getPostById=(async(req,res)=>{
    const post=await Post.findById(req.params.id).populate(
        "author",
        "username"
    ).populate({
        path:"comment",populate:{
        path:"author",
        model:"Users",
        select:"username"
        }
    })

    res.render("postDetail",{
        title:"Post",
        post,
        user:req.user,
        success:"",
        error:""
    })
})

//get Edit form
exports.getEditForm=(async(req,res)=>{
    const post=await Post.findById(req.params.id);
    if(!post){
        return res.render("postDetail",{
             title:"Post",
        post,
        user:req.user,
        error:'Post not found',
        success:''
        })
    }
    res.render("editPost",{
        title:"Edit Post",
        post,
        user:req.user,
        error:'',
        success:''
    })
})

exports.updatePost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.render("postDetail", {
                title: "Post",
                post,
                user: req.user,
                error: 'Post not found',
                success: ''
            });
        }

        if (post.author.toString() !== req.user._id.toString()) {
            return res.render("postDetail", {
                title: "Post",
                post,
                user: req.user,
                error: 'You are not authorized to edit',
                success: ''
            });
        }

        // Update post fields
        post.title = title || post.title;
        post.content = content || post.content;

        // Handle image updates if files were uploaded
        if (req.files && req.files.length > 0) {
            // Delete old images from cloudinary
            if (post.images && post.images.length > 0) {
                await Promise.all(post.images.map(async (image) => {
                    await cloudinary.uploader.destroy(image.public_id);
                }));
            }

            // Upload new images
            post.images = await Promise.all(
                req.files.map(async (file) => {
                    const newFile = new File({
                        url: file.path,
                        public_id: file.filename,
                        uploadedBy: req.user._id
                    });
                    await newFile.save();
                    return {
                        url: newFile.url,
                        public_id: newFile.public_id
                    };
                })
            );
        }

        await post.save();
        return res.redirect(`/post/${post._id}`);

    } catch (err) {
        console.error(err);
        res.render("editPost", {
            title: "Edit Post",
            post,
            user: req.user,
            error: 'An error occurred while updating',
            success: ''
        });
    }
};
exports.deletePost=(async(req,res)=>{
    const post=await Post.findById(req.params.id);
         
        if (!post) {
            return res.render("postDetail", {
                title: "Post",
                post,
                user: req.user,
                error: 'Post not found',
                success: ''
            });
        }

        if (post.author.toString() !== req.user._id.toString()) {
            return res.render("postDetail", {
                title: "Post",
                post,
                user: req.user,
                error: 'You are not authorized to edit',
                success: ''
            });
        }
            if (req.files && req.files.length > 0) {
            // Delete old images from cloudinary
            if (post.images && post.images.length > 0) {
                await Promise.all(post.images.map(async (image) => {
                    await cloudinary.uploader.destroy(image.public_id);
                }));
            }}

            await Post.findByIdAndDelete(req.params.id)
            res.redirect('/post')

    
})