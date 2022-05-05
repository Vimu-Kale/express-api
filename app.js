const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const usersRouter = require('./routes/users');
app.use('/users',usersRouter);

app.listen(PORT,()=>{
    console.log(`server listening on port ${PORT}`);
})