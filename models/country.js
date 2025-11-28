import mongoose from "mongoose";

const countrySchema = new mongoose.Schema(
  {
    countryName: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: false,
      unique: false,
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

const CountryModel = mongoose.model("Country", countrySchema, "Country");

export default CountryModel;
