const nodemailer=require('nodemailer');
const asynchandler= require('express-async-handler');
const { getMaxListeners } = require('../Models/userModel');

const sendEmail= asynchandler(async(data, req, res)=>{
let trasporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, //true for 465, false for other ports
    auth:{
        user: process.env.MAIL_ID, //generated ethereal user
        password: process.env.MP, //generated ethereal password
    },
});
//send mail with defined trasport object
let info = await transporter.sendEmail({
    from: '"HI" <alqmst56.pier@gmail.com.com>',// sender address
    to: data.to,// list of receivers
    subject: data.subject,// subject line
    text: data.text,// Plain body text
    html: data.html, //html body
});


});