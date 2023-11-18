const express = require("express");
const dbConnect = require("./Config/dbConnetct");
const dotenv = require("dotenv").config()
const authRouter= require('./Routes/authRoute');
const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandle");
const cookieParser = require("cookie-parser");


//iniicalize Express
const app= express();
const PORT = process.env.PORT || 4000;

//Conncetion DB
dbConnect();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser())
app.use('/', (req,res)=>{
    res.send('wellcome in the server side')
});



//Route
app.use('/api/user', authRouter)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, ()=>{
    console.log(`The server is running at PORT: ${PORT}`)
});
