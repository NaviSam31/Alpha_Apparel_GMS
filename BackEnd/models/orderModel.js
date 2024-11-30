import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  OrderID: { type: Number, required: true, unique: true },
  CusID: { type: String, required: true },
  Items: [{ itemCode: String, qtyRequired: Number }],
  image: {
    data: Buffer,
    contentType: String,
  },
}, { timestamps: true });

export const Order = mongoose.model('Order', orderSchema);
