const express = require('express')
const app = express();
const db = require('./db');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';



// parsing incoming data( from frontend, postman) to json format & put it into req.body
app.use(express.json());

app.get('/', (req,res)=>{
    res.send("Welcome!!!");
    
})

app.use('/user', userRoutes);

app.listen(3000,()=>{
    console.log("server Running");
});