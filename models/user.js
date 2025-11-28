import mongoose from "mongoose";

import { ROLES } from "../constant/roles.js";

const allRolesEnum = [
  ROLES.SUPER_ADMIN,
  ROLES.COMPANY,
  ROLES.EMPLOYEE,
  ROLES.VIEWER,
];

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      default: "",
    },

    emailAddress: {
      type: String,
      required: true,
      unique: true,
      default: "",
    },
    password: {
      type: String,
      required: true,
      default: "",
    },
    phoneNo: {
      type: String,
      required: true,
      default: "",
    },
    role: {
      type: String,
      enum: allRolesEnum,
      required: false,
    },

    profileImage: {
      type: String,
      required: false,
      default: "",
    },

    isActive: {
      type: Boolean,
      required: false,
      default: true,
    },
    isSecurityCodeEnabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
    discriminatorKey: "role",
  }
);

const UserModel = mongoose.model("User", userSchema, "User");

export default UserModel;
