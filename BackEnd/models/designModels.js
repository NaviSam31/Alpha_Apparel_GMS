import mongoose from 'mongoose';


const designSchema = mongoose.Schema(
  {
    designID: {
      type: String,
      required: true,
      unique: true,
    },
    DesignName: {
      type: String,
      required: true,
    },
    Description: {
      type: String,
      required: true,
    },
    image: { 
      data: Buffer, 
      contentType: String,},
  }, {
    timestamps: true,
  }
);



export const Design = mongoose.model('Design', designSchema);
