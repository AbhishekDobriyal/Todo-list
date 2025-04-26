const mongoose = require('mongoose')
const mongoURL = 'mongodb://localhost:27017/to-do-list'

mongoose.connect(mongoURL);

const db = mongoose.connection;

db.on('connected',()=>{
    console.log("Connected to Mongodb server");
    
});
db.on('error',(err)=>{
    console.log("Mongodb Error");
    
});
db.on('disconnected',()=>{
    console.log("Mongodb server Disconnected");
    
});

module.exports = db;