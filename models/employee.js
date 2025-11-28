import mongoose from "mongoose";
import { ROLES } from "../constant/roles.js";
import User from "./UserBase.js";

const employeeSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    employeeID: {
      type: String,
      required: true,
      unique: true,
    },
    dateOfJoining: {
      type: Date,
      required: true,
    },
    salary: {
      type: Number,
      default: 0,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
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
    identityType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IdentityType",
      required: true,
    },
    identityNumber: {
      type: String,
      required: true,
    },
    reportingManagerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    extraInfo: {
      type: String,
    },
  },
  { timestamps: true }
);

employeeSchema.index({ company: 1, department: 1 });

const employeeModel = User.discriminator(ROLES.EMPLOYEE, employeeSchema);
export default employeeModel;
