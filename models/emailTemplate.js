import mongoose from "mongoose";

import { TEMPLATE_TYPES } from "../constant/roles.js";

const templateEnum = [
  TEMPLATE_TYPES.ACCOUNT_CREATION,
  TEMPLATE_TYPES.ACCOUNT_DELETION,
  TEMPLATE_TYPES.ACCOUNT_AUTHORIZATION,
  TEMPLATE_TYPES.PASSWORD_RESET,
];

const emailTemplateSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      default: "",
    },

    content: {
      type: String,
      required: true,
      default: "",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    createdBySuperAdmin: {
      type: Boolean,
      required: false,
      default: false,
    },
    type: {
      type: String,
      required: true,
      enum: templateEnum,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isShared: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const EmailTemplateModel = mongoose.model(
  "EmailTemplate",
  emailTemplateSchema,
  "EmailTemplate"
);

export default EmailTemplateModel;
