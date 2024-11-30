import mongoose from 'mongoose';


const sizeSchema = new mongoose.Schema({
  sizeID: { type: String, required: true },
  sizeName: { type: String, required: true },
  chestMeasurement: { type: Number, required: true },
  waistMeasurement: { type: Number, required: true },
  hipMeasurement: { type: Number, required: true },
  length: { type: Number, required: true },
},
  {
    timestamps: true,

  }
);

export const Size = mongoose.model('Size', sizeSchema);
