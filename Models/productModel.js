const mongoose = require("mongoose");

//Declarate the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      require: true,
    },
    brand: {
      type: String,
      require: true,
    },
    quantity: {
      type: Number,
      require: true,
    },
    sold: {
      type: Number,
      defauld: 0,
    },
    images: {
      type: Array,
    },
    color: {
      type: String,
    },
    // rating:[{
    //             star: Number,
    //             postedby:{type: mongoose.Schema.Types.ObjectId, ref: "User"}
    //         }],
  },
  { timestamps: true }
);

//Export model
module.exports = mongoose.model("Product", productSchema);
