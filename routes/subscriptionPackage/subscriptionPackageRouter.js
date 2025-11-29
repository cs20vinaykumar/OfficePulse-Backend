import express from "express";
import {
  createPackage,
  getAllPackages,
  getActivePackages,
  updatePackage,
  deletePackage,
  getAllPackagesDuration,
} from "../../controllers/subscriptionPackages/subscriptionPackagesController.js";
import {
  authenticateUser,
  isSuperAdminAuthorized,
} from "../../middleware/auth.js";

const router = express.Router();

router.post("/create", authenticateUser, isSuperAdminAuthorized, createPackage);

router.get("/", authenticateUser, isSuperAdminAuthorized, getAllPackages);

router.get(
  "/active",
  authenticateUser,
  isSuperAdminAuthorized,
  getActivePackages
);

router.put(
  "/update/:packageId",
  authenticateUser,
  isSuperAdminAuthorized,
  updatePackage
);

router.delete(
  "/delete/:packageId",
  authenticateUser,
  isSuperAdminAuthorized,
  deletePackage
);

router.get(
  "/durations",
  authenticateUser,
  isSuperAdminAuthorized,
  getAllPackagesDuration
);

export default router;
