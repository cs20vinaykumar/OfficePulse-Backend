import mongoose from "mongoose";

const emailGatewaySchema = new mongoose.Schema(
  {
    fromName: {
      type: String,
      required: true,
      default: "",
    },

    replyToEmailAddress: {
      type: String,
      required: true,
      default: "",
    },

    smtpServerHost: {
      type: String,
      required: true,
      default: "",
    },

    smtpServerPort: {
      type: Number,
      required: true,
      default: 0,
    },

    smtpSecurity: {
      type: String,
      required: true,
      default: "",
    },

    smtpUsername: {
      type: String,
      required: true,
      default: "",
    },

    smtpPassword: {
      type: String,
      required: true,
      default: "",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    isActive: {
      type: Boolean,
      required: false,
      default: true,
    },
    createdBySuperAdmin: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const EmailGatewayModel = mongoose.model(
  "EmailGateway",
  emailGatewaySchema,
  "EmailGateway"
);

export default EmailGatewayModel;
