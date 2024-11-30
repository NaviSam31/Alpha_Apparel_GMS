import mongoose from 'mongoose';


const reOrderSchema = mongoose.Schema(
  {
    Description: {
      type: String,
      required: true,
    },
    image: {
      data: Buffer,
      contentType: String,
    },
    Status: {
      type: String,
    },
  }, {
  timestamps: true,
}
);



export const ReOrder = mongoose.model('ReOrder', reOrderSchema);
