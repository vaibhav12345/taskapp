const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/user");
const auth = require("../middleware/auth");
const { sendWelcomeEmail, sendCancelEmail } = require("../emails/account");
const router = new express.Router();

const jwt = require("jsonwebtoken");
const passport = require("passport");

//Create new user
router.post("/users", async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        sendWelcomeEmail(user.email, user.name);
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

//Login user
router.post("/users/login", async (req, res) => {
    try {

        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (error) {
        res.status(400).send({error:"Invalid user"});
    }
});

//PASSPORT WAY
// router.post('/users/login', async (req, res, next) => {
//     passport.authenticate('local', { session: false }, (err, user, info) => {
//         if (err || !user) {
//             return res.status(400).json({
//                 message: 'Something is not right',
//                 user: user
//             });
//         }
//         req.login(user, { session: false }, (err) => {
//             if (err) {
//                 res.send(err);
//             }
//             // generate a signed son web token with the contents of user object and return it in the response
//             const token = jwt.sign(user, process.env.JWT_SECRET_KEY);
//             user.tokens = user.tokens.concat({ token });
//             await user.save();
//             return res.json({ user, token });
//         });
//     })(req, res);
// });

//Logout user
router.post("/users/logout", auth, async (req, res) => {
    try {
        // console.log(req.user);
        // console.log(req.token);
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
        // console.log(req.user);
        await req.user.save();
        res.send();

    } catch (error) {
        res.status(500).send();
    }
});

//Logout from all sessions
router.post("/users/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

//View profile
router.get("/users/me", auth, async (req, res) => {
    res.send(req.user);
});

// router.get("/users/:id", async (req, res) => {
//     const _id = req.params.id;
//     try {
//         const user = await User.findById(_id);
//         if (!user) {
//             return res.status(404).send();
//         }
//         res.send(user);
//     } catch (error) {
//         res.status(500).send();
//     }
// });

//Update profile
router.patch("/users/update", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "age"];
    //every returns true if all returns are true
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates" });
    }
    try {

        updates.forEach((update) => {
            req.user[update] = req.body[update];
        });
        await req.user.save();
        res.send(req.user);
    } catch (error) {
        res.status(400).send(error);

    }


});


//updating user when fetching via id
// router.patch("/users/:id", async (req, res) => {

//     const updates = Object.keys(req.body);
//     const allowedUpdates = ["name", "email", "password", "age"];
//     //every returns true if all returns are true
//     const isValidOperation = updates.every(update => allowedUpdates.includes(update));
//     if (!isValidOperation) {
//         return res.status(400).send({ error: "Invalid updates" });
//     }
//     try {
//         const user = await User.findById(req.params.id);

//         updates.forEach((update) => {
//             user[update] = req.body[update];
//         });
//         await user.save();

//         //the above code does not bypass the mongoose middleware

//         // const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true}); //new returns modified document rather than original

//         if (!user) {//No user to update
//             res.status(404).send();
//         }
//         res.send(user);
//     } catch (error) {//Validation issue or server connection isse
//         res.status(400).send(error);

//     }
// });

//Delete profile
router.delete("/users/me", auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id);
        // if (!user) {
        //     return res.status(404).send();
        // }
        //mongoose method to remove user
        await req.user.remove();
        sendCancelEmail(req.user.email, req.user.name);
        res.send(req.user);
    } catch (error) {
        res.status(500).send(error);
    }
});

//Upload avatar

const upload = multer({
    //dest:"avatars", remvoing this makes multer pass data in req object instead of saving to file system
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("Please upload image file"));
        }
        cb(undefined, true);
    }
});


router.post("/users/me/avatar", auth, upload.single("avatar"), async (req, res) => {
    // req.user.avatar = req.file.buffer //buffer only accessible if dest not set in upload
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});

//Delete avatar
router.delete("/users/me/avatar", auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
});

//Fetching avatar
router.get("/users/:id/avatar", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set("Content-Type", "image/png") //set the response header to tell its image
        res.send(user.avatar);
    } catch (error) {
        res.status(404).send();
    }
});

module.exports = router;