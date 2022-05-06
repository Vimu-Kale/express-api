const {isEmail,isPhoneNumber,isValidName,isValidPassword} = require("../util/validator.js");
const fs = require('fs');

const getUsers =  () => {
    try{
        const bufferData = fs.readFileSync("./util/users.json");
        return JSON.parse(bufferData.toString());
    }catch(e){
        console.log(e);
        return [];
    }
}

//MIDDLEWARE FOR LOGIN
const isAuthorized =  (req,res,next)=>{
    const users =  getUsers();
    const {email,password}=req.body;
    const isValidEmail = isEmail(email);

    if(!req.body || !email  || !password || email.trim().length <= 0 || password.trim().length <= 0)
    {   
        res.status(400).json({"message":"Missing Fields"});
    }
    else if(isValidEmail){
        const validUser = users.find((user)=> user.email === req.body.email)
        console.log(validUser);
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

//MIDDLEWARE FOR SIGNUP
const validateSignUp = (req,res,next) =>{
    const {name,phone,email,password}=req.body;
    const users = getUsers();
    const exists = users.find((user)=> user.email === email);
    if(!req.body || !name || !phone || !email || !password)
    {
        res.status(400).json({"message":"Missing User Details"});
    }
    else if(!isValidName(name)){
        res.status(400).json({
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

//VALIDATE USER FOR UPDATE & DELETE
const validateUser= (req,res,next)=>{
    const users = getUsers();
    const email = req.query.email;

    if(!email || email.trim().length <= 0)
    {
        res.status(400).json({"message":"Missing User Email"});
    }
    else if(!isEmail(email)){
        res.status(412).json({message:"Invalid Email"});
    }
    else{
        const exists = users.find((user)=> user.email === email);
        req.exists = exists;
        next();
    }
}

//MIDDLEWARE FOR UPDATE
const validateUpdate = (req,res,next) => {
    const {name,phone,email,password} = req.body;
    let valid = true;

    if(name){
        console.log("name",name);
        if(!isValidName(name)){
            valid =false;
            res.status(422).json({
                "message":"Invalid Name",
                "desc":"Name Must Contain only Alphabets & length between 2-30 char"
        });
        }
    }
    if(phone){
        console.log("phone");
        if(!isPhoneNumber(phone)){
            valid =false;
            res.status(422).json({
                "message":"Invalid Phone Number",
                "desc":"Phone Number Must Be of exactly 10 digits only"
            });
        }
    } 
    if(email){
        console.log("email");
        if(!isEmail(email)){
            valid =false;
            res.status(422).json({message:"Invalid Email"});
        }
    }
    if(password){
        console.log("password");
        if(!isValidPassword(password)){
            valid =false;
            res.status(422).json({
                "message":"Invalid Password",
                "desc":"Password Must be combination of atleast 1 special char & digit and length between 8-16 char"
            });
        }
    }
    if(valid){
        next();
    }      
}

module.exports={
    isAuthorized,
    validateSignUp,
    validateUser,
    validateUpdate,
    getUsers,
}