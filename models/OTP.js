const mongoose = require('mongoose');
const Schema = mongoose.Schema

const otpSchema = new mongoose.Schema({
    userId:{
     type:Schema.Types.ObjectId,
     ref:"users"
     },
     code:{
         type:String,
         required:[true,'Short code is required']
     },
     active:{
         type:Boolean,
         default:true
     },
     validTill:{
         type:Date,
         default:Date.now()+3600
     },
     verified:{
         type:Boolean,
         default:false
     }
   });
 
   module.exports = mongoose.model('otp', otpSchema);