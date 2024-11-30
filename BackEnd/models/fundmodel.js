import mongoose from "mongoose";

const fundschema = mongoose.Schema(
  {
    department: {
      type: String,
      required: true,
    },

    project: {
      type: String,
      required: true,
    },

    allocated_amount: {
      type: Number,
      required: true,
    },
    spent_amount: {
        type: Number,
        required: true,
      },

  },
  {
    timestamps: true,
  }
);
export const fundmodel = mongoose.model("funds", fundschema);
