const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
passport.use(new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, 
    function (email, password, cb) {
        //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
        return User.findByCredentials(email, password)
           .then(user => {
               return cb(null, user, {message: 'Logged In Successfully'});
          })
          .catch(err => cb(err,{message: 'Incorrect email or password.'}));
    }
));