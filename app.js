const express = require('express')
const app = express();
const db = require('./db');
const userRoutes = require('./routes/userRoutes');


// parsing incoming data( from frontend, postman) to json format & put it into req.body
app.use(express.json());

app.get('/', (req,res)=>{
    res.send("Welcome!!!");
    
})

app.use('/user', userRoutes);

app.listen(3000,()=>{
    console.log("server Running");
});