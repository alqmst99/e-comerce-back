const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var inquirySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
     
       
    },
    email:{
        type:String,
        required:true,
       
    },
    mobile:{
        type:String,
        required:true,
        
    },
    coment:{
        type:String,
        required:true,
    },
    status:{
        type: String,
        default:"Submitted",
        enum:["Submitted", "in progress"]
    },
});

//Export the model
module.exports = mongoose.model('Inquiry', inquirySchema);