const express=require("express")
const app=express();
const mongoose=require("mongoose")

require('dotenv').config(); 
const mongoStore=require('connect-mongo')
const session=require('express-session')
const postRoute=require('./route/postRoute')
const authRouter = require('./route/AuthRoute');
const commentRoute = require("./route/commentRoute");
const userRoute = require("./route/UserRoute");
const methodOverride=require('method-override')
app.use(express.urlencoded({extended:true}))
app.set("view engine","ejs")

app.use(
    session({
      secret: process.env.SESSION_SECRET || "10", // Use environment variable
      resave: false,
      saveUninitialized: false,
      store: mongoStore.create({
        mongoUrl: process.env.MONGODB_URI, // Corrected property name
        collectionName: 'sessions' // Optional: custom collection name
      })

    })
  );
  app.use(methodOverride('_method'))
  const passport = require('passport');


  require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Test', {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('MongoDB Connected...');
    } catch (err) {
      console.error('Database connection error:', err.message);
      process.exit(1); // Exit process with failure
    }
  };
  

app.use('/auth',authRouter)
app.use('/Post',postRoute)
app.use('/',commentRoute)
app.use('/user',userRoute)
app.get('/',(req,res)=>{
  res.render("home",{
title:"Home",
user:req.user,
error:null
  })
})
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await connectDB(); // Connect to DB before starting server
  console.log(`Server running on port ${PORT}`);
});