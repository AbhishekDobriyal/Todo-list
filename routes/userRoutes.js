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

module.exports = router;