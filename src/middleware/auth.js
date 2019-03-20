const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Cookies = require("cookies");
const auth = async (req, res, next) => {
    try {
        let token;
        const cookies = new Cookies(req, res);
        token = cookies.get('TOKEN');
        if(token === undefined){
            token = req.header("Authorization").replace("Bearer ", "");
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // console.log(token);
        // console.log(decoded);
        //find user with given id and if token exists in tokens array
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
        // console.log(user);
        if (!user) {
            throw new Error();
        }
        //To allow route handler to have access to user
        req.token = token;
        req.user = user;
        console.log(req.user.name);
        next();
    } catch (error) {
        console.log(error);
        // res.status(401).send({ error: "Please authenticate" });
        res.render("notAuthenticated");
    }
};

module.exports = auth;