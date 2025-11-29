import express from "express";
import {
  createCity,
  updateCity,
  getAllCities,
  deleteCity,
} from "../../controllers/locations/cityController.js";

import {
  authenticateUser,
  isSuperAdminAuthorized,
} from "../../middleware/auth.js";

const router = express.Router();

router.post(
  "/create-city",
  authenticateUser,
  isSuperAdminAuthorized,
  createCity
);

router.get("/cities", authenticateUser, getAllCities);

router.put(
  "/update-city/:cityId",
  authenticateUser,
  isSuperAdminAuthorized,
  updateCity
);

router.delete(
  "/delete-city/:cityId",
  authenticateUser,
  isSuperAdminAuthorized,
  deleteCity
);

export default router;
