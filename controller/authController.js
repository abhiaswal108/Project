const bcrypt=require('bcrypt')
const User=require('../model/User')
const passport = require('passport');

exports.getLogin=((req,res)=>{
    res.render("login");
})


exports.getRegister=( (req,res)=>{
    res.render("register",{
        title:"Register",
        error:null
    });
})
exports.logout=((req,res)=>{
    req.session.destroy((err) => {
        if (err) {
          console.error('Session destruction error:', err);
          return res.redirect('/');
        }
        
        // Clear the cookie
        res.clearCookie('connect.sid');
        
        // Passport logout
        req.logout(() => {
          res.redirect('/auth/login');
        });
      });
})
exports.postLogin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      // Initialize template variables with default values
      const templateVars = {
        title: 'Login',
        email: req.body.email || '',
        error: null
      };
  
      try {
        if (err) {
          templateVars.error = err.message || 'Authentication error';
          return res.render('login', templateVars);
        }
  
        if (!user) {
          // Handle case where info might be undefined
          templateVars.error = (info && info.message) ? info.message : 'Invalid credentials';
          return res.render('login', templateVars);
        }
  
        req.login(user, (loginErr) => {  // Changed parameter name to avoid confusion
          if (loginErr) {
            templateVars.error = 'Login session error';
            return res.render('login', templateVars);
          }
          return res.redirect('/');
        });
  
      } catch (error) {  // This is properly defined
        templateVars.error = 'An unexpected error occurred';  // THIS IS THE PROBLEM LINE
        return res.render('login', templateVars);
      }
    })(req, res, next);
  };
exports.postRegister=(async (req,res)=>{
    const {username,email,password}=req.body;
    console.log(req.body)
    try{
        const user=await User.findOne({email})
        if(user){
            return res.send("User Already exists")
 
        }
        console.log("herre")
        const hashPassword=await bcrypt.hash(password,10)
       const newuser=new User({
        username,
        email,
        password:hashPassword

        });
  await newuser.save()
     console.log("Added ")
       return res.redirect("/auth/login")
     

    }catch(error){
        return res.render("register",{
        title:"Register",
        user:req.username,
        error:"Some error occur"
      });
    }

})
