import mongoose from 'mongoose';

const dataschema = new mongoose.Schema({
    name: { type: String, required: true },
    nic: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    product: { type: String, required: true },
    type: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    contractStart: { type: Date, required: true },
    contractEnd: { type: Date, required: true },
}, { timestamps: true });  // This adds createdAt and updatedAt timestamps automatically

export const suppliermodel = mongoose.model('Supplier', dataschema);
