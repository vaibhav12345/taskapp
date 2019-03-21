const axios = require("axios");
const fetch = require('node-fetch');
const Cookies = require('cookies')
const express = require("express");
const helmet = require("helmet");
const hbs = require("hbs");
const path = require("path");
require("./db/mongoose");

require("./passport");

const User = require("./models/user");
const Task = require("./models/task");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
const auth = require("./middleware/auth");

//For heroku
const PORT = process.env.PORT;

const app = express();

//Setup helmet
app.use(helmet());

// app.use((req,res,next)=>{
    
//     //to call next middleware use next
//     next();
// });

//maintenance middleware
// app.use((req,res,next)=>{
//     res.status(503).send("Site is under maintenance");
// });

//Automatically parse input json to use in requests
app.use(express.json());

//Define path for express config
const viewsPath = path.join(__dirname, "../templates/views");
const partialPath = path.join(__dirname, "../templates/partials");
const helperPath = path.join(__dirname,"../templates/helpers/helpers.js");

//Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialPath);
require("../templates/helpers/helpers");    //Require helper functions

//Setup static directory to serve
app.use(express.static(path.join(__dirname, "../public")));

//Register view router
app.get("",auth,(req,res)=>{
    if(req.user){
        res.render("index",{
            user:req.user
        });
    }else {
        res.render("");
    }
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/signup",(req,res)=>{
    res.render("signup");
});

app.get("/home",auth,(req,res)=>{
    if(req.user){
        res.render("home",{
            name: req.user.name,
            user: req.user
        });
    }else{
        res.render("notAuthenticated");
    }
});

app.get("/logout",auth,async (req,res)=>{
    try{
        const url = req.protocol + '://' + req.get('host');
        await fetch(`${url}/api/users/logoutAll`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${req.token}`
            }
        });
        res.render("")
    } catch (e){
        // console.log("Error while logging out");
        res.render("notAuthenticated")
    }
});

app.get("/profile",auth,async(req,res)=>{
    if(req.user){
        res.render("profile",{
            user:req.user
        });
    } else {
        res.render("notAuthenticated");
    }
});


//Register api routers
app.use("/api",userRouter);
app.use("/api",taskRouter);

//Setup 404 page
app.get('*', (req, res) => {
    res.render("404");
});

app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`);
});