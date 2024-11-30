import mongoose from "mongoose";

const discountschema = mongoose.Schema(
  {
    item: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    dis: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export const discountmodel = mongoose.model("discount", discountschema);
