const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");
const router = new express.Router();

//Create a new task
router.post("/tasks", auth, async (req, res) => {
    // const task = new Task(req.body);
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });
    try{ 
        await task.save();
        res.status(201).send(task);
    } catch(error){
        res.status(400).send(error);
    }
});

//Fetch all tasks
// /tasks?completed=true&limit=10&skip=0&sortBy=createdAt_asc
//limit(limits results returned) and skip(pages to skip, so skip 10 means skipping first 10 results) for pagination
router.get("/tasks", auth, async (req, res) => {
    const match = {}
    const sort = {}
    if(req.query.completed){
        match.completed = req.query.completed === "true" //have to set bool value
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split("_");
        sort[parts[0]] = parts[1]==="desc" ? -1 : 1; //1 for asc and -1 for dsc specify field to sort by
    }
    try {
        // const tasks = await Task.find({});  //Empty {} to fetch all tasks
        // await req.user.populate('tasks').execPopulate() //retunrns all tasks
        await req.user.populate({
            path: "tasks",
            match,
            options:{//used for pagination defualt support
                limit: parseInt(req.query.limit), //if limit not provided parseInt does not give integer and mongoose ignores it
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.user.tasks);
    }catch(error){
        res.status(500).send();
    }
});

//Fetch task by id
router.get("/tasks/:id", auth,async (req, res) => {
    const _id = req.params.id;
    try{
        // const task = await Task.findById(_id);
        //Find task only if its of the owner
        const task = await Task.findOne({_id,owner:req.user._id});
        if(!task){
            return res.status(404).send();
        }
        res.send(task);
    } catch(error){
        res.status(500).send();
    }
});

//Update task

router.patch("/tasks/:id", auth, async (req,res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates =["description","completed"];
    //every returns true if all returns are true
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if(!isValidOperation){
        return res.status(400).send({error:"Invalid updates"});
    }
    try{
        // const task = await Task.findById(req.params.id);
        const task = await Task.findOne({_id:req.params.id,owner:req.user._id});
        // const task = await Task.findByIdAndUpdate(req.params.id,req.body,{
        //     new:true,
        //     runValidators:true
        // });

        if(!task){
            res.status(404).send();
        }

        console.log(task);

        updates.forEach((update)=>{
            task[update] = req.body[update];
        });
        await task.save();

        res.send(task);
    } catch(error){
        res.status(400).send();
    }
});

//Delete task by id
router.delete("/tasks/:id", auth,async (req,res)=>{
    try{
        // console.log(req.params.id);
        const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id});
        if(!task){
            return res.status(404).send();
        }
        res.send(task);
    } catch(error){
        res.status(500).send(error);
    }
});

module.exports = router;
