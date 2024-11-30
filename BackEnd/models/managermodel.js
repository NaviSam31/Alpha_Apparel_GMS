import mongoose from 'mongoose';


const adminchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    address: String,
    phone: String,


}, {
    timestamps: true

})


export const Manager = mongoose.model('Admin', adminchema);