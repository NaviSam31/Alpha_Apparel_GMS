import mongoose from 'mongoose';

const DisplayItemSchema = new mongoose.Schema({
    itemCode: { type: String, required: true, unique: true},
    productName: { type: String, required: true },
    productDescription: { type: String, required: true },
    unit: {type: String, required: true},
    price: { type: Number, required: true },
    image: { 
        data: Buffer, 
        contentType: String,},

}, { timestamps: true });

export const DisplayItem = mongoose.model('DisplayItem', DisplayItemSchema);
