import mongoose from "mongoose";

const citySchema = new mongoose.Schema(
  {
    cityName: {
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
    province: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      default: null,
      ref: "Province",
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

const CityModel = mongoose.model("City", citySchema, "City");

export default CityModel;
