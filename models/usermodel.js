const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        unique : true,
        required: true
    },
    email:{
        type: String,
        unique : true,
        required : true
    },
    password: {
        type : String,
        required : true
    },

    data: [{

        content:{
            type: String,
            required : true,
        }
    }]

});

userSchema.pre('save', async function(next){

    // check if password is modified or not
    if(!this.isModified('password')){
        return next();
    }

    try{
        // creating salt
        const salt = await bcrypt.genSalt(10);

        // hashing (password) and adding salt to it and storing in db
        this.password = await bcrypt.hash(this.password, salt);

        next();

    }
    catch(err){
        next(err);
    }

})

const User = mongoose.model('User',userSchema);
module.exports = User;
