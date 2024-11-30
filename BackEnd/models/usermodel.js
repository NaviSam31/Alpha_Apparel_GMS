import mongoose from 'mongoose';


const userchema=mongoose.Schema({
    username:String,
    email:String,
    password:String,
    address:String,
    phone:String,
 
  
  
   

},{
    timestamps:true

})

export const User = mongoose.model('Users', userchema);