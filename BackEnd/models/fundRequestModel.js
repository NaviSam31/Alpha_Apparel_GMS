import mongoose from "mongoose";

const fundRequestSchema = mongoose.Schema(
  {
    department: {
      type: String,
      required: true,
    },

    reason: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
    },

  },
  {
    timestamps: true,
  }
);
export const fundRequestModel = mongoose.model("fundRequests", fundRequestSchema);
