const nodemailer=require('nodemailer');
const asynchandler= require('express-async-handler');
const { getMaxListeners } = require('../Models/userModel');

//*************************Api Rest Email Controller with nodemailer *************************//


const sendEmail= asynchandler(async(data, req, res)=>{
let trasnporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, //true for 465, false for other ports
    auth:{
        user: process.env.MAIL_ID, //generated ethereal user
        password: process.env.MP, //generated ethereal password
    },
});
//send mail with defined trasport object
let info = await trasnporter.sendMail({
    from: '"HI" <alqmst56.pier@gmail.com.com>',// sender address
    to: data.to,// list of receivers
    subject: data.subject,// subject line
    text: data.text,// Plain body text
    html: data.html, //html body
});
console.log("Message sent: %s", info.messageId);
//Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//Preview only available when sending through an Ethereal account
console.log("Preview URL %s", nodemailer.getTestMessageUrl(info));
//Preview URL: https://ethereal.email//message/WaQKMgKddxQDoou...
});
//node mailer need revision but no sended email error=>Missing credentials for "PLAIN"
 //*                                                     at SMTPConnection._formatError
module.exports= sendEmail