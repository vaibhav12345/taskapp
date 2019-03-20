const jwt = require("jsonwebtoken");
const User = require("../models/user");
const auth = async (req,res,next)=>{
    try{
        // const token;
        // if(req.query.token){
        //     token = req.query.token;
        // }
        const token = req.header("Authorization").replace("Bearer ","");
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
        console.log(decoded);
        //find user with given id and if token exists in tokens array
        const user = await User.findOne({_id:decoded._id,'tokens.token':token});
        if(!user){
            throw new Error();
        }
        //To allow route handler to have access to user
        req.token = token;
        req.user = user;
        next();
    } catch (error){
        res.status(401).send({error:"Please authenticate"});
    }
};

module.exports = auth;