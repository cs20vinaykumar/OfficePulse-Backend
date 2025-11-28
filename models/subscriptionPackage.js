import mongoose from "mongoose";
import { PACKAGE_DURATIONS } from "../constant/basic.js";

const packagesEnum = [
  PACKAGE_DURATIONS.WEEKLY,
  PACKAGE_DURATIONS.MONTHLY,
  PACKAGE_DURATIONS.QUARTERLY,
  PACKAGE_DURATIONS.BI_ANNUALLY,
  PACKAGE_DURATIONS.YEARLY,
  PACKAGE_DURATIONS.UNLIMITED,
];

const packageSchema = new mongoose.Schema(
  {
    packageName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: String,
      enum: [...packagesEnum, "CUSTOM"],
      required: true,
    },
    days: {
      type: Number,
      required: true,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isCompany: {
      type: Boolean,
      default: false,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const SubscriptionPackageModel = mongoose.model(
  "SubscriptionPackage",
  packageSchema,
  "SubscriptionPackage"
);

export default SubscriptionPackageModel;
