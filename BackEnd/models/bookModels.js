import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
    itemCode: { type: String, required: true, unique: true },
    productName: { type: String, required: true },
    productCategory: { type: String, required: true },
    productDescription: { type: String, required: true },
    Quantity: { type: Number, required: true },
    MinQuantity: { type: Number, required: true },
    unit: {type: String, required: true},
    price: { type: Number, required: true },
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

export const Inventory = mongoose.model('Inventory', inventorySchema);
