const express = require('express');
const router = express.Router();
const User = require('./../models/usermodel');
const bcrypt = require('bcrypt');

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
    
});

router.post('/view-task', async (req,res)=>{
    
    try{

        const data = req.body;

        const loggedinUser = await User.findOne({email: data.email});

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

router.delete('/delete-task/:Id', async (req, res)=>{

    try{
        const taskId = req.params.Id
        console.log("taskId is: " + taskId );
        // Delete the specific task directly from the user's data array
        await User.updateOne(
        { "data._id": taskId },  // Find user with task in their data array
        { $pull: { data: { _id: taskId } } }  // Remove the task with this taskId
        );

        res.status(200).json({message: "Task deleted successfully!"});

    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "internal server error"});
    }
});

router.put('/update-task', async (req, res)=>{

    try{

        const info = req.body;

        if (!info.id || !info.content) {
            return res.status(400).json({ message: "Missing 'id' or 'content' in request body" });
        }

        console.log("Content to update: ", info.content);


        const result = await User.updateOne(
            {"data._id":info.id},
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