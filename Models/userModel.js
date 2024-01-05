const mongoose = require('mongoose'); // Erase if already required
const bcrypt= require('bcrypt')
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    lastName:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
   
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type: String,
        default: "user"
    },
    isBlocked:{
        type: Boolean,
        default: false
    },
    car: {
        type: Array,
        default:[]
    },
    address:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    }],
    wishlist:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"product"
    }],
    refreshToken:{
        type: String,
        
    },
    //reset password
    passwordChangedAt: Date,
    passwordResetToken: String,
passwordResetExpires: Date,  

},{
    timeseries:true
});

//pre function
userSchema.pre('save', async function(next){
    const salt= await bcrypt.genSaltSync(10);
this.password= await bcrypt.hash(this.password, salt)
});
//password matched
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
};
//resetPassword
userSchema.methods.createPasswordResetToken = async function(){
    const resetToken =require('crypto').randomBytes(32).toString("hex");
    this.passwordResetToken = require('crypto').createHash('sha256').update(resetToken).digest("hex");
    this.passwordResetExpires= Date.now() + 30*60*1000; // 10 minutes
    return resetToken;
}
//Export the model
module.exports = mongoose.model('User', userSchema);