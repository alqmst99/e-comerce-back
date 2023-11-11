const express = require("express")
const dotenv = require("dotenv").config()

const app= express();
const PORT = process.env.PORT || 4000;



app.use('/', (req,res)=>{
    res.send('wellcome in the server side')
})
app.listen(PORT, ()=>{
    console.log(`The server is running at PORT: ${PORT}`)
});
