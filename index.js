const express = require("express");
const dbConnect = require("./Config/dbConnetct");
const dotenv = require("dotenv").config()
const authRouter= require('./Routes/authRoute');
const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandle");
const cookieParser = require("cookie-parser");
const productRouter = require('./Routes/productRoute');
const categoryRouter = require('./Routes/categoryRoute');
const blogCatRouter = require('./Routes/blogCatRouter');
const brandRouter = require('./Routes/brandRoute');
const colorRouter = require('./Routes/colorRoute');
const blogRouter = require('./Routes/blogRoute');
const cuponRouter = require('./Routes/cuponRoute');
const InquiryRouter = require('./Routes/enqRoute');
const morgan = require("morgan");

//inicalize Express
const app= express();
const PORT = process.env.PORT || 4000;

//Conncetion DB
dbConnect();
app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser())
//app.use('/', (req,res)=>{
//    res.send('wellcome in the server side')
//});



//Route
app.use('/api/user', authRouter);
app.use('/api/product', productRouter);
app.use('/api/blog', blogRouter);
app.use('/api/product/cat', categoryRouter);
app.use('/api/blog/cat', blogCatRouter);
app.use('/api/brand', brandRouter);
app.use('/api/color', colorRouter);
app.use('/api/inquiry', colorRouter);
app.use('/api/cupon', InquiryRouter);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, ()=>{
    console.log(`The server is running at PORT: ${PORT}`);
});
