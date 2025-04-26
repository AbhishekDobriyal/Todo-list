const express = require('express')
const app = express();
const db = require('./db');
const userRoutes = require('./routes/userRoutes');


app.get('/', (req,res)=>{
    res.send("Server is Running!");
    console.log("hello");
})

app.listen(3000);