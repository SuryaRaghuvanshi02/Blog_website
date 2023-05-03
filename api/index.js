const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const User = require('./models/User')
const bcrypt = require('bcryptjs');

const app=express();
const jwt = require('jsonwebtoken')

// encrypting the password
const salt = bcrypt.genSaltSync(10);
const secret = 'sedjbfghliesrbgaeg';

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
// for parsing the json friend request 
app.use(express.json());
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
            res.cookie('token',token).json('ok');
        });
        // res.json();
    }
    else{
        res.status(400).json('Wrong Credentials ')
    }
})

app.listen(4000);
// We are using await where there are async function 
