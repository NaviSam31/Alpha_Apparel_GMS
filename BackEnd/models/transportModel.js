import mongoose from 'mongoose';

const transportSchema = mongoose.Schema(

{   
    job:{
        type:String,
        required:true,
    },
    vehicle:{
        type:String,
        required:true,
    },
    vehicleNo:{
        type:String,
        required:true,
    },
    driver:{
        type:String,
        required:true,
    },
    date:{
        type:String,
        required:true,
    },
    time:{
        type:String,
        required:true,
    },
    cost:{
        type:Number,
        required:true,
    },
    destination:{
        type:String,
        required:true,
    },
    approved: 
    { type: Boolean, 
        default: false } 
},
{
    timestamps:true,
}

);

export const Transport = mongoose.model('Transport', transportSchema);