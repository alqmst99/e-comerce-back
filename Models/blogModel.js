const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
       //  index:true,
    },
    description:{
        type:String,
      
      
    },
    category:{
        type:String,
        
       
    },
    numViews:{
        type:Number,
        default: 0,
    },
    isLiked:{
        type:Boolean,
        default:false,
    },
    isDisliked:{
        type: Boolean,
        default: false,
    },
    likes:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"User"
        },
    ],
    dislikes:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"User"
        },
    ],
    image:{
type:String,
default: "	https://www.shutterstock.com/image-photo/bloggingb…oncepts-ideas-white-worktable-600w-1029506242.jpg"
    },
    author:{
        type:String,
        default:"admin",
    },

},{
    toJSON:{
        virtuals:true,
    },
    toObject:{
        virtuals:true,
    },
    timestamps:true,
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);