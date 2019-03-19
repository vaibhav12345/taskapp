const express = require("express");
const helmet = require("helmet");
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

app.use((req,res,next)=>{
    
    //to call next middleware use next
    next();
});

//maintenance middleware
// app.use((req,res,next)=>{
//     res.status(503).send("Site is under maintenance");
// });

//Automatically parse input json to use in requests
app.use(express.json());

//Register routers
app.use(userRouter);
app.use(taskRouter);



app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`);
});