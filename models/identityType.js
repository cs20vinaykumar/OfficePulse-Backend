import mongoose from "mongoose";

const identitySchema = new mongoose.Schema(
  {
    identityType: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const IdentityTypeModel = mongoose.model(
  "IdentityType",
  identitySchema,
  "IdentityType"
);

export default IdentityTypeModel;
