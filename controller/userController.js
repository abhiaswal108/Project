const Post = require("../model/Post")
const User = require("../model/User")
const cloudinary = require('../config/cloudinary');
const File = require("../model/File");
const Comment=require("../model/Comment")
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
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.render("login", {
                title: "login",
                comment,
                user: req.user,
                error: 'User not found',
                success: ''
            });
        }

        // Delete profile picture if exists
        if(user.profilePic && user.profilePic.public_id){
            await cloudinary.uploader.destroy(user.profilePic.public_id);
        }

        // Delete user's posts and associated images/comments
        const posts = await Post.find({author: req.user._id}); // Fixed typo here
        for(const post of posts){
            for (const image of post.images){ // Make sure this matches your schema (image vs images)
                await cloudinary.uploader.destroy(image.public_id);
            }
            await Comment.deleteMany({post: post._id});
            await Post.findByIdAndDelete(post._id);
        }

        // Delete user's comments
        await Comment.deleteMany({author: req.user._id});
        
        // Delete user's files
        const files = await File.find({uploadedBy: req.user._id});
        for(const file of files){
            await cloudinary.uploader.destroy(file.public_id);
        }
        
        // Finally delete the user
        await User.findByIdAndDelete(req.user._id);
        
        // Clear session/cookie if needed

        
        res.redirect('/auth/register');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
