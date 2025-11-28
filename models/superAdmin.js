import mongoose from "mongoose";

import { ROLES } from "../constant/roles.js";
import User from "./user.js";

const allRolesEnum = [
  ROLES.SUPER_ADMIN,
  ROLES.COMPANY,
  ROLES.EMPLOYEE,
  ROLES.HR,
  ROLES.FINANCE,
  ROLES.VIEWER,
];

const superAdminSchema = new mongoose.Schema(
  {},
  {
    timestamps: true,
  }
);

const superAdminModel = User.discriminator(ROLES.SUPER_ADMIN, superAdminSchema);

export default superAdminModel;
