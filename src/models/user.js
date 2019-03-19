const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

//mongoose.model("user",{}) the object is automatically converted to mongoose schema

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        trim:true //To remove trailing and leading spaces
    } ,
    email:{
        type: String,
        unique: true,
        required: true,
        trim:true,
        lowercase:true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error("Email is not valid");
            }
        }
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength:7,
        validate(value){
            if(value.toLowerCase().includes("password"))
            {
                throw new Error("Password cannot contain password");
            }
        }
 
 
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if (value < 0){
                throw new Error("Age must be positive");
            }
        }
    },
    tokens: [{
        token:{
            type:String,
            required:true
        }
    }],
    avatar: {
        type:Buffer //binary image data
    }
 },{
     timestamps:true
 });

 //Virtual methods its a relationship between two entitites (user,task)
 //We create virtual method because it does not make sense to create an arry of tasks with the user
 //Instead each task should be having a single owner and using virtual we can access all tasks of user
 // user.populate('tasks').execPopulate() to populate the tasks in user

 //(name of field,object)
 userSchema.virtual("tasks",{
     ref: 'Task',
     localField: "_id", //where local data is stored ie owner user id
     foreignField: "owner" //relationship on task that is going to create this relationship
 });
 // Instance methods


 //Insted of creatig a public method to return profile we can make the call toJSON as its called when returning data
 //therefore whenever we send back user to client toJSON is called and these values are removed always
 userSchema.methods.toJSON = function (){
     const user = this;
     //Get raw object insted of mongoose object
     const userObject = user.toObject();

     delete userObject.password;
     delete userObject.tokens;
     delete userObject.avatar;

     return userObject;

 };

 userSchema.methods.generateAuthToken = async function (){
     const user = this;
     const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET_KEY);

     user.tokens = user.tokens.concat({token});
     await user.save();
     return token;

 };

 userSchema.statics.findByCredentials = async (email,password) =>{
     const user = await User.findOne({email});
     if(!user){
         throw new Error("Unable to login");
     }

     const isMatch = await bcrypt.compare(password,user.password);

     if(!isMatch){
         throw new Error("Unable to login");
     }

     return user;
 };

 //Middleware

 //userSchema.pre to perfrom before event
 //userSchema.post to perfrom after event

 //have to use normal function because of this binding next has to be called to indicate we have finshed ceompleting task
 
 //findbyidandupdate bypasses the mongoose middelware thus this method is not called when updating users, have to change structure in user update route
 //Hash password
 userSchema.pre("save",async function(next){
     const user = this;

     if (user.isModified("password")){
         user.password = await bcrypt.hash(user.password,8);
     }

     next();

 });

 //Delete user task when user is deleted
 userSchema.pre("remove",async function(next){
     const user = this;
     await Task.deleteMany({owner:user._id});
     next();
 });

const User = mongoose.model("User",userSchema);

 module.exports = User;