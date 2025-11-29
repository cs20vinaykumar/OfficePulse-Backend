import express from "express";
import {
  createCountry,
  getAllCountries,
  updateCountry,
  deleteCountry,
} from "../../controllers/locations/countryController.js";

import {
  authenticateUser,
  isSuperAdminAuthorized,
} from "../../middleware/auth.js";

const router = express.Router();

router.post(
  "/create-country",
  authenticateUser,
  isSuperAdminAuthorized,
  createCountry
);

router.get("/countries", authenticateUser, getAllCountries);

router.put(
  "/update-country/:countryId",
  authenticateUser,
  isSuperAdminAuthorized,
  updateCountry
);

router.delete(
  "/delete-country/:countryId",
  authenticateUser,
  isSuperAdminAuthorized,
  deleteCountry
);

export default router;
