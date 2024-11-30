import mongoose from 'mongoose';

const vehicleSchema = mongoose.Schema(

{   
    year:{
        type:Number,
        required:true,
    },
    model:{
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
    renteredCompany:{
        type:String,
        required:true,
    },
    rentalFee:{
        type:Number,
        required:true,
    },
    capacity:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
},
{
    timestamps:true,
}

);

export const Vehicle = mongoose.model('Vehicle', vehicleSchema);