import mongoose from 'mongoose';

const materialRequirementSchema = mongoose.Schema(
  {
    designID: { type: String, required: true }, // Required design ID
    sizeID: { type: String, required: true },   // Required size ID
    materials: [
      {
        materialID: { type: String, required: true }, // Required material ID
        qtyRequired: { type: Number, required: true } // Required quantity
      }
    ]
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

export const MaterialRequirement = mongoose.model('MaterialRequirement', materialRequirementSchema);
