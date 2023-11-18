const { default: mongoose } = require('mongoose')
const mosngoose =require('mongoose')
const validateMongosDBId = (id =>{
    const isValid = mongoose.Schema.Types.ObjectId.isValid(id);
if(!isValid) throw new Error("This id is not valid or not Found");
})
module.exports= validateMongosDBId;