const jwt = require('jsonwebtoken');
const User = require('./models/usermodel');

const jwtAuthMiddleware = (req,res,next)=>{

    // obtaining token from header
    const token = req.header('Authorization')?.split(' ')[1];

    if(!token){
        return res.status(401).json({ message: "Authentication required." });
    }

    try{

        // verifying the token with secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // storing the info in data variable you can name it anything
        req.data = decoded;
        next();
    }
    catch(err){
        return res.status(403).json({ message: 'Invalid or expired token, authorization denied' });
    }
}

module.exports = jwtAuthMiddleware;