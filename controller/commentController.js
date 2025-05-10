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
// Delete comment
exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
          if (!comment) {
            return res.render("postDetail", {
                title: "Post",
               comment,
                user: req.user,
                error: 'Post not found',
                success: ''
            });
        }
              if (comment.author.toString() !== req.user._id.toString()) {
            return res.render("postDetail", {
                title: "Post",
               comment,
                user: req.user,
                error: 'You are not authorized to edit',
                success: ''
            });
        }

        
  
await Comment.findByIdAndDelete(req.params.id)
        res.redirect(`/post/${comment.post}`)
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get edit comment form
exports.getEditComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
             if (!comment) {
            return res.render("postDetail", {
                title: "Post",
               comment,
                user: req.user,
                error: 'Post not found',
                success: ''
            });
        }

        
  

        res.render('editComment', { 
            title:"comment",
       comment,
        user:req.user,

        error:'',
        success:""
        });
    } catch (err) {
        console.error(err);
        res.redirect('/posts');
    }
};
exports.updateComment=(async(req,res)=>{
    const {content}=req.body;
    const comment=await Comment.findById(req.params.id)
        if (!comment) {
            return res.render("postDetail", {
                title: "Post",
               comment,
                user: req.user,
                error: 'Comment not found',
                success: ''
            });
        }
         if (comment.author.toString() !== req.user._id.toString()) {
            return res.render("postDetail", {
                title: "Post",
               comment,
                user: req.user,
                error: 'You are not authorized to edit',
                success: ''
            });
        }
comment.content=content||comment.content
await comment.save();

res.redirect(`/post/${comment.post}`)
})