const express = require("express");
const helmet = require("helmet");
const hbs = require("hbs");
const path = require("path");
require("./db/mongoose");
const User = require("./models/user");
const Task = require("./models/task");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

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

//Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialPath);

//Setup static directory to serve
app.use(express.static(path.join(__dirname, "../public")));

//Register view router
app.get("",(req,res)=>{
    res.render("index");
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/signup",(req,res)=>{
    res.render("signup");
})



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