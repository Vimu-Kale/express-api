const express = require('express');
var cors = require('cors')
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());


//USER ROUTER 
const usersRouter = require('./routes/users');
app.use('/users',usersRouter);

app.listen(PORT,()=>{
    console.log(`server listening on port ${PORT}`);
})