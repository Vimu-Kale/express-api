const express = require('express');
const router = express.Router();
const {isEmail,isPhoneNumber,isValidName,isValidPassword} = require("../util/validator.js");
const fs = require('fs');

//GETTING USERS FROM ./util/users.json FILE
const getUsers =  () => {
        try{
            const bufferData = fs.readFileSync("./util/users.json");
            return JSON.parse(bufferData.toString());
        }catch(e){
            return [];
        }
}

// WRITE/SET USERS TO THE .json FILE
const setUser=(users)=>{
    try{
        fs.writeFileSync("./util/users.json",JSON.stringify(users));
    }
    catch(e){
        console.log(e)
    }
}

//LOGIN MIDDLEWARE(VALIDATION)
const isAuthorized =  (req,res,next)=>{
    const users =  getUsers();
    const isValidEmail = isEmail(req.body.email);
    if (isValidEmail){
        const validUser = users.find((user)=> user.email === req.body.email)
        if(typeof(validUser)!="undefined"){
            req.validUser = validUser;
            next();        
        }else{
            res.status(401).json({"message":"Wrong Cradentials"});
        }   
    }
    else{
        res.status(412).json({"message":"Invalid Email"});
    }
}

const validateSignUp = (req,res,next) =>{
    const {name,phone,email,password}=req.body;
    const users = getUsers();
    const exists = users.find((user)=> user.email === email);
    
    if(!isValidName(name)){
        res.status(422).json({
            "message":"Invalid Name",
            "desc":"Name Must Contain only Alphabets & length between 2-30 char"
    });
    }
    else if(!isPhoneNumber(phone)){
        res.status(400).json({
            "message":"Invalid Phone Number",
            "desc":"Phone Number Must Be of exactly 10 digits only"
        });
    }
    else if(!isEmail(email)){
        res.status(400).json({message:"Invalid Email"});
    }
    else if(!isValidPassword(password)){
        res.status(400).json({
            "message":"Invalid Password",
            "desc":"Password Must be combination of atleast 1 special char & digit and length between 8-16 char"
        });
    }
    else{
        console.log(exists);
        req.exists = exists;
        next();
    }  
}

// /users
router.get('/',(req,res)=>{
    res.send(getUsers());
})

// /users/login
router.post('/login',isAuthorized,(req,res)=>{
    if(req.validUser.password === req.body.password){
        res.status(200).json({"message":"Login Successful"});
    }
    else{
        res.status(401).json({"message":"Wrong Cradentials"});
    }
    
})

// /users/signup
router.post('/signup',validateSignUp,(req,res)=>{
    const {name,phone,email,password}=req.body;
    const users = getUsers();
    if(!req.exists){
        try{
            users.push({
                name,
                phone,
                email,
                password,
            });
            setUser(users);
        }catch(e){
            console.error(e);
            res.status(500).json({"message":"Registration Failed"});
        }
        res.status(200).json({"message":"Registration SuccessFul"});
    }else{
        res.status(409).json({"message":"Email Already Exist"});
    }
})

// CHECK IF USER IS VALID OR NOT
const validateUser= (req,res,next)=>{
    const users = getUsers();
    const email = req.query.email;
    console.log("email",email);
    if(!isEmail(email)){
        res.status(412).json({message:"Invalid Email"});
    }
    else{
        const exists = users.find((user)=> user.email === email);
        req.exists = exists;
        next();
    }
}

const validateUpdate = (req,res,next) => {
    const {name,phone,email,password} = req.body;

    // const users = getUsers();
    // const email1 = req.query.email;
    // console.log("email",email1);
    // if(!isEmail(email1)){
    //     res.status(412).json({message:"Invalid Email"});
    // }
    // else{
    //     const exists = users.find((user)=> user.email === email1);
    //     req.exists = exists;  
    // }

    if(name){
        console.log("name",name);
        if(!isValidName(name)){
            res.status(422).json({
                "message":"Invalid Name",
                "desc":"Name Must Contain only Alphabets & length between 2-30 char"
        });
        }
    }
    if(phone){
        console.log("phone");
        if(!isPhoneNumber(phone)){
        res.status(422).json({
            "message":"Invalid Phone Number",
            "desc":"Phone Number Must Be of exactly 10 digits only"
        });
        }
    } 
    if(email){
        console.log("email");
        if(!isEmail(email)){
            res.status(422).json({message:"Invalid Email"});
        }
    }
    if(password){
        console.log("password");
        if(!isValidPassword(password)){
            res.status(422).json({
                "message":"Invalid Password",
                "desc":"Password Must be combination of atleast 1 special char & digit and length between 8-16 char"
            });
        }
    }
        next();
        return;  
}

//eg: /users/john@gmail.com - update & delete
router.route('/')
        .patch([validateUser,validateUpdate],(req,res)=>{
            console.log("hiii");
            const {name, phone, email, password} = req.body;
            console.log(name);
            const users=getUsers();
            console.log("reqexist",req.exists)
            if(req.exists){
                try{
                    for(let i=0; i< users.length; i++){
                        if(users[i].email === req.query.email){
                            users[i]={
                                name:name || req.exists.name,
                                phone:phone || req.exists.phone,
                                email:email || req.exists.email,
                                password:password || req.exists.password
                            }
                        }
                    }
                    console.log(users);
                    setUser(users);

                }
                catch(e){
                    console.error(e);
                }
                res.status(200).json({"message":"user Updated Successfully"});
            }
            else{
                res.status(400).json({"message":"User Doesn't Exist"});
            }
        })

        //DELETE USER USING EMAIL
        .delete(validateUser,(req,res)=>{
            console.log("req.exist",req.exists);
            const users = getUsers();
            if(req.exists){
                try{
                    let newUserList = users.filter((user)=>user.email !== req.params.email)
                    setUser(newUserList);
                }
                catch(e){
                    console.error(e);
                }
                res.status(200).json({"message":"User Delated Successfully"});
            }
            else{
                res.status(400).json({"message":"User Does Not Exist"});
            }
        })

module.exports = router;