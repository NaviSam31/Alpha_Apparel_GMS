import mongoose from 'mongoose';

const supplierOrderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    nic: {
        type: String,
        required: true,
        length: 10, // If you're enforcing length
    },
    product: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    // Add other necessary fields...
});

export const odermodel = mongoose.model('SupplierOrder', supplierOrderSchema);
