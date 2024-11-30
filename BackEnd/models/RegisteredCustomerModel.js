import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  CustomerID: { type: String, required: true, unique: true }, // Added unique: true
  CustomerName: { type: String, required: true },
  Address: { type: String, required: true },
  City: { type: String, required: true },
  Country: { type: String, required: true },
  CountryCode: { type: String, required: true },
  ContactNo1: { type: String, required: true },
  ContactNo2: { type: String, required: true },
  Email: { type: String, required: true },
}, {
  timestamps: true,
});

export const Customer = mongoose.model('Customer', customerSchema);
