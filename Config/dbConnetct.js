const { default: mongoose } = require("mongoose")

const dbConnect= ()=>{
    try {
    const conn= mongoose.connect(process.env.MONGODB_URL);
    console.log('Data Base Connected success');    
    } catch (error) {
        console.log(`DB connection error ${error}`);
    }
    
}
module.exports= dbConnect;