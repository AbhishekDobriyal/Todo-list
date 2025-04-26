const express = require('express')
const app = express();


app.get('/', (req,res)=>{
    res.send("Server is Running!");
    console.log("hello");
})

app.listen(3000);