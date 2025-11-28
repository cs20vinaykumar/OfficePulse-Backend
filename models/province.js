import mongoose from "mongoose";

const provinceSchema = new mongoose.Schema(
  {
    provinceName: {
      type: String,
      required: true,
      default: "",
      unique: true,
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      default: null,
      ref: "Country",
    },

    isActive: {
      type: Boolean,
      required: false,
      default: true,
    },
  },

  {
    timestamps: true,
  }
);

const ProvinceModel = mongoose.model("Province", provinceSchema, "Province");

export default ProvinceModel;
