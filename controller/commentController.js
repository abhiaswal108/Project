const Post=require('../model/Post')
const Comment=require('../model/Comment')
exports.addComment=(async(req,res)=>{
    const {content}=req.body;
    const postId=req.params.id;
    const post=await Post.findById(postId)
    if(!post){
        return res.render("postDetails",{
            title:"Post",
            post,
            user:req.user,
            error:"Post not Found",
            success:""
        })
    }
    if(!content){

    }
    const comment=new Comment({
        content,
        post:postId,
        author:req.user._id
    })
    await comment.save()
    post.comment.push(comment._id)
    await post.save();
    res.redirect(`/post/${postId}`)
})