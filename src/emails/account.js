const sgMail = require("@sendgrid/mail");
const {SENDGRID_KEY} =  require("../config/config");
console.log(SENDGRID_KEY);
sgMail.setApiKey(process.env.SENDGRID_KEY);

const sendWelcomeEmail = (email,name)=>{
    sgMail.send({
        to:email,
        from:"vaibh1998@gmail.com",
        subject:"Thanks for joining",
        text: `Welcome to the app, ${name}. Let me know if you face any issues`
    });
}

const sendCancelEmail = (email,name)=>{
    sgMail.send({
        to:email,
        from:"vaibh1998@gmail.com",
        subject:"Sorry to see you leave",
        text: `Goodbye, ${name}. See you soon again!`
    });
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}
