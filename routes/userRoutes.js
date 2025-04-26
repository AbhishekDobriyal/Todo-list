const express = require('express');
const router = express.Router();
const User = require('./../models/usermodel');

router.post('/signup', async (req, res)=>{

    try{
        const data = req.body;

        // fetching existing data
        const existingEmail = await User.findOne({email: data.email}) ;

        // if email exits return
        if(existingEmail){
            return res.status(400).json({error: 'Email already exist'});
        }

        // creating new instance of model
        const newUser = new User(data);

        // saving data in db
        const saved = await newUser.save();
        console.log("data saved");
        res.status(200).json(saved);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }

});

router.post('/login',async (req, res)=>{

    try{

        const data = req.body;

        const existingUser = await User.findOne({email: data.email});

        // if user not exits in db or if user credentials are wrong
        if( (!existingUser) || (data.password != existingUser.password ) || (data.email != existingUser.email ) ){
            return res.status(400).json({message: "User Does not Exists"});
        }

        res.status(200).json({existingUser});
        
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
    
});

router.post('/add-task', async (req,res)=>{
    
    try{

        const data = req.body;

        const loggedinUser = await User.findOne({email: data.email});

        if (!loggedinUser) {
            return res.status(404).json({ message: "User not found" });
        }

        loggedinUser.data.push({content: data.content});

        await loggedinUser.save();

        res.status(200).json({message:"task added", user: loggedinUser});

    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });        
    }
    
})

module.exports = router;