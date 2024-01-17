//install multer sharp (npm i multer sharp cloudinary)
const multer= require('multer');
const sharp= require('sharp');
const path= require('path');

const multerStorange= multer.diskStorage({
    destination:function(req, file, cb){
cb(null, path.join(__dirname,"../public/images"));
    },
    filename:function(req, file, cb){
 const uniqueSuffix = Date.now() + '-'+ Math.round(Math.random()*le9);
 cd(null, file.fieldname+ "-" + uniqueSuffix + ".jpeg");
    },
})


const multerFilter= (req, file, cd)=>{
if(file.mimetype.starsWith('image')){
    cb(null, true);
}
else{
    cb({
        message:"unsupported file format"
    })
}
}

//Upload photo
const uploadPhoto = multer({
    storage:multerStorange,
    fileFilter:multerFilter,
    limits:{fieldSize:2000000},
})

//Resize Product Image
const ImgProdResize= async(req, res, next)=>{
    if(req.files) return next();
    await Promise.all( req.files.map( async (file)=>{
        await sharp(file.path).resize(300 , 300).toFormat('jpeg').jpeg({quality:90}).toFile(`public/images/products/${file.filename}`);
    })
    );
    next();
}

//Resize Blog Image
const ImgBlogResize= async(req, res, next)=>{
    if(req.files) return next();
    await Promise.all( req.files.map( async (file)=>{
        await sharp(file.path).resize(300 , 300).toFormat('jpeg').jpeg({quality:90}).toFile(`public/images/products/${file.filename}`);
    })
    );
    next();
}
module.exports= {uploadPhoto, ImgProdResize, ImgBlogResize};