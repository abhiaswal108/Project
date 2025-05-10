const Post = require("../model/Post")
const User = require("../model/User")
const cloudinary = require('../config/cloudinary');
const File = require("../model/File");

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.render("login", {
        title: "Login",
        error: "User not Found"
      });
    }

    const posts = await Post.find({ author: req.user._id })
      .sort({ createdAt: -1 });

    res.render("profile", {
      title: "Profile",
      user,
      posts,  // Changed from 'post' to 'posts'
      error: "",
      postCount: posts.length
    });

  } catch (err) {
    console.error(err);
    res.render("error", { error: "Server Error" });
  }
}

//get Edit form
exports.getEditForm=(async(req,res)=>{
    const user=await User.findById(req.user._id).select("-password");
    if(!user){
        return res.render("Login",{
             title:"Login",
 
        user:req.user,
        error:'User not found',
        success:''
        })
    }
    res.render("editProfile",{
        title:"Edit Profile",
        user,
        error:'',
        success:''
    })
})
exports.updateUser = async (req, res) => {
    try {
        
        const { username, email, bio } = req.body;
        const user = await User.findById(req.params.id).select("-password");
     const posts = await Post.find({ author: user._id });
        const postCount = posts.length;
        if (!user) {
            return res.render("login", {
                title: "Login",
                error: 'User not found',
                success: ''
            });
        }

        // Update user fields
        user.username = username || user.username;
        user.email = email || user.email;
        user.bio = bio || user.bio;

        // Handle profile picture upload
        if (req.file) {
            // Delete old image if exists
            if (user.profilePic && user.profilePic.public_id) {
                await cloudinary.uploader.destroy(user.profilePic.public_id);
            }

            // Upload new image
            const result = await cloudinary.uploader.upload(req.file.path);
            user.profilePic = {
                url: result.secure_url,
                public_id: result.public_id
            };
        }

        await user.save(); // Fixed typo here (was User.save())

        res.render("profile", {
            title: "Profile",
            user,
             postCount,
            error: "",
            success: "Profile updated successfully"
        });

    } catch (error) {
        console.error(error);
        res.render("editProfile", {
            title: "Edit Profile",
            user: req.user,
            error: "Error updating profile",
            success: ""
        });
    }
};
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
