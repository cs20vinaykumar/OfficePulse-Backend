import express from "express";
import {
  createProvince,
  getAllProvinces,
  updateProvince,
  deleteProvince,
} from "../../controllers/locations/provinceController.js";

import {
  authenticateUser,
  isSuperAdminAuthorized,
} from "../../middleware/auth.js";

const router = express.Router();

router.post(
  "/create-province",
  authenticateUser,
  isSuperAdminAuthorized,
  createProvince
);

router.get("/provinces", authenticateUser, getAllProvinces);

router.put(
  "/update-province/:provinceId",
  authenticateUser,
  isSuperAdminAuthorized,
  updateProvince
);

router.delete(
  "/delete-province/:provinceId",
  authenticateUser,
  isSuperAdminAuthorized,
  deleteProvince
);

export default router;
