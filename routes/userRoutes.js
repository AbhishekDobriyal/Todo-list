const express = require('express');
const router = express.Router();
const User = require('./../models/usermodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtAuthMiddleware = require('./../jwt');

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

        if (!data.email || !data.password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const existingUser = await User.findOne({email: data.email});

        // if user not exits in db or if user credentials are wrong
        if(!existingUser){
            return res.status(400).json({message: "User doesn't exists"});
        }

        const isMatch = await bcrypt.compare(data.password, existingUser.password);
        if(!isMatch){
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // creating a token 
        const token = jwt.sign(
            {email: existingUser.email, username: existingUser.username},     // payload
            process.env.JWT_SECRET,                                // secret key
            {expiresIn:'1h'}                                       // expiration  -- this is optional
        );

        res.status(200).json({message: "Login Successful.", token : token});
        
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
    
});

router.post('/add-task', jwtAuthMiddleware, async (req,res)=>{
    
    try{

        const { content } = req.body;
        const { email } = req.data;    // req.data : middleware data contains email info from tokens

        const loggedinUser = await User.findOne({email});

        if (!loggedinUser) {
            return res.status(404).json({ message: "User not found" });
        }

        loggedinUser.data.push({content});  //  agar (key, value) same ho to aisa kr sakte he
                                            // can also be written as ({content:content})

        await loggedinUser.save();

        res.status(200).json({message:"task added", user: loggedinUser});

    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });        
    }
    
});

router.post('/view-task', jwtAuthMiddleware, async (req,res)=>{
    
    try{

        const {email} = req.data;
        
        const loggedinUser = await User.findOne({email});

        if (!loggedinUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({user: loggedinUser.data});

        // for cleaner output, only the content of each task, you can map it like this:

        // const tasks = loggedinUser.data.map(task => task.content);
        // res.status(200).json({ tasks });

    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });        
    }
    
});

router.delete('/delete-task/:Id', jwtAuthMiddleware, async (req, res)=>{

    try{
        const taskId = req.params.Id
        
        const{email} = req.data;

        // Delete the specific task directly from the user's data array
        await User.updateOne(
        { email, "data._id": taskId },  // Find user with task in their data array
        { $pull: { data: { _id: taskId } } }  // Remove the task with this taskId
        );

        res.status(200).json({message: "Task deleted successfully!"});

    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "internal server error"});
    }
});

router.put('/update-task', jwtAuthMiddleware, async (req, res)=>{

    try{

        const info = req.body;
        const {email} = req.data;

        if (!info.id || !info.content) {
            return res.status(400).json({ message: "Missing 'id' or 'content' in request body" });
        }

        //console.log("Content to update: ", info.content);


        const result = await User.updateOne(
            {email, "data._id":info.id},
            { $set :{ "data.$.content":info.content } }
        );

        if (result.modifiedCount > 0) {
            res.status(200).json({ message: "Task updated successfully!" });
        } else {
            res.status(400).json({ message: "No task found to update." });
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "internal server error"});
    }
});

module.exports = router;