const express = require('express');
const router = express.Router();
const { isAuthorized, getUsers, validateSignUp, validateUser, validateUpdate } = require("../middleware/userMiddleware.js");
const fs = require('fs');

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

//UPDATE & DELETE ROUTE
router.route('/')
        .patch([validateUser,validateUpdate],(req,res)=>{
            const {name, phone, email, password} = req.body;
            const users=getUsers();
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
                    // console.log(users);
                    setUser(users);
                }
                catch(e){
                    console.error(e);
                }
                res.status(200).json({"message":"user Updated Successfully"});
            }
            else{
                res.status(409).json({"message":"User Doesn't Exist"});
            }
        })

        //DELETE USER USING EMAIL
        .delete(validateUser,(req,res)=>{
            const users = getUsers();
            if(req.exists){
                try{
                    let newUserList = users.filter((user)=>user.email !== req.query.email)
                    setUser(newUserList);
                }
                catch(e){
                    console.error(e);
                }
                res.status(200).json({"message":"User Delated Successfully"});
            }
            else{
                res.status(409).json({"message":"User Does Not Exist"});
            }
        })

const setUser=(users)=>{
    try{
        fs.writeFileSync("./util/users.json",JSON.stringify(users));
    }
    catch(e){
        console.log(e)
    }
}

module.exports = router;