const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post')
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs')

const app=express();
const jwt = require('jsonwebtoken')

// encrypting the password
const salt = bcrypt.genSaltSync(10);
const secret = 'sedjbfghliesrbgaeg';

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
// for parsing the json friend request 
app.use(express.json());

// cookie parser
app.use(cookieParser());

app.use('/uploads',express.static(__dirname+'/uploads'))
// Connecting to our mongoose database
mongoose.connect('mongodb+srv://Blog:Pir8vSzq5gsalBUp@cluster0.l1ymcbo.mongodb.net/?retryWrites=true&w=majority');
// we are using nodemon as while using nodemon we dont need to restart
// out node again and again it will restart when it detects changes
// req == Request and res == response 
// we are using post as we want to send information with post request 
app.post('/register',async (req,res)=>{
    // we are requesting username and password from req body
    const{username,password} = req.body;
    // if the parameters are not matches we need to show that
    // parameters are not matched so we are using try and catch
    try{
        const userDoc = await User.create({
            username,
            password:bcrypt.hashSync(password,salt),
        });
        res.json(userDoc);
    } catch(e){
        console.log(e)
        if (e.code === 11000) {
            // handle duplicate key error
            res.status(400).json({ message: "Username already taken" });
          } else {
            // handle other errors
            res.status(500).json({ message: "Internal server error" });
          }
    }
    
    
});

app.post('/login',async (req,res)=>{
    const {username,password}=req.body;
    // the way we plan to login is by first grabing the username
    // then we check if our password is same as the password in 
    // database but is encrypted 
    const userDoc = await User.findOne({username})
    const passOK = bcrypt.compareSync(password, userDoc.password);
    if(passOK){
        // logged in
        jwt.sign({username,id:userDoc._id}, secret,{},(err,token)=>{
            if(err) throw err;
            res.cookie('token',token).json(
                {
                    id:userDoc._id,
                    username,
                }
            );
        });
        // res.json();
    }
    else{
        res.status(400).json('Wrong Credentials ')
    }
});


app.get('/profile',(req,res)=>{
    const {token} = req.cookies;
    jwt.verify(token,secret,{},(err,info)=>{
        if(err) throw err;
        res.json(info);
    });
})


app.post('/logout',(req,res)=>{
    res.cookie('token','').json('ok');
});

app.post('/post',uploadMiddleware.single('file'),async (req,res)=>{
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path+'.'+ext;
    fs.renameSync(path,newPath);
    
    const {token} = req.cookies;
    jwt.verify(token,secret,{},async(err,info)=>{
        if(err) throw err;
        const{title,summary,content} =req.body;
    const postDoc = await Post.create({
        title,
        summary,
        content,
        cover:newPath,
        author:info.id,
    })
    res.json(postDoc);
    })
});

app.get('/post',async (req,res)=>{
    const posts = await Post.find()
    .populate('author', ['username'])
    .sort({createdAt:-1})
    .limit(20)
    res.json(posts);
});

app.get('/post/:id',async (req,res) =>{
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author',['username']);
    res.json(postDoc);
});
app.listen(4000);
// We are using await where there are async function 
