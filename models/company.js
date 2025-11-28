import mongoose from "mongoose";
import { ROLES, SUBSCRIPTIONS_TYPES } from "../constant/roles.js";
import User from "./user.js";

const companySubscriptionPlansEnum = [
  SUBSCRIPTIONS_TYPES.MONTHLY,
  SUBSCRIPTIONS_TYPES.SIX_MONTHS,
  SUBSCRIPTIONS_TYPES.YEARLY,
];

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    contactPersonName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },
    province: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Province",
      required: true,
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },
    subscriptionPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubscriptionPackage",
      required: true,
    },
    subscriptionExpiry: {
      type: Date,
      required: true,
    },
    emailGateway: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmailGateway",
    },
    emailTemplate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmailTemplate",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    extraInfo: {
      type: String,
    },
  },
  { timestamps: true }
);

companySchema.index({ companyName: 1 });
companySchema.index({ subscriptionExpiry: 1 });

const CompanyModel = User.discriminator(ROLES.COMPANY, companySchema);
export default CompanyModel;
