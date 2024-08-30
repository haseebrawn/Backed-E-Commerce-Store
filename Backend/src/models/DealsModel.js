const mongoose = require('mongoose')

const bundleDealSchema = new mongoose.Schema ({
    name:{
        type :String,
        required: true
    },
    images: {
        type:String,
        required:true
      },
    price:{
        type : Number,
        required: true
    },
    category: {
        type:String,
        required:true
      },
   discountPercentage: {
        type:String,
    },
    validityPeriod: Date,
    createdAt:{
        type: Date,
        default: Date.now
    },
    sizes:{
        type:String,
        required:true
    }
})

const Deal = mongoose.model('Deal', bundleDealSchema);

module.exports = Deal;