import mongoose from "mongoose";
import { OTP_PURPOSES } from "../constant/roles.js";

const purposeEnum = [OTP_PURPOSES.LOGIN, OTP_PURPOSES.PASSWORD_RESET];

const otpSchema = new mongoose.Schema({
  emailAddress: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    enum: purposeEnum,
    required: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isExpired: {
    type: Boolean,
    default: false,
  },
});
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 120 });
const OTPModel = mongoose.model("OTP", otpSchema, "OTP");

export default OTPModel;
