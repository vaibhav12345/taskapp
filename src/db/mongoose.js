const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useCreateIndex:true
}).then(() => {
    console.log("Connection successful to Database");
})
.catch((err) => {
    console.log("Mongoose connection error: ", err);
    process.exit();
});

mongoose.Promise = Promise;
