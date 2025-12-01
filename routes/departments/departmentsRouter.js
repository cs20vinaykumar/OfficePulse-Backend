import express from "express";

import {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
} from "../../controllers/departments/departmentsController.js";

import {
  authenticateUser,
  isCompanyAuthorized,
} from "../../middleware/auth.js";

const router = express.Router();

router.post("/create", authenticateUser, isCompanyAuthorized, createDepartment);
router.get("/", authenticateUser, isCompanyAuthorized, getDepartments);
router.put(
  "/update/:departmentId",
  authenticateUser,
  isCompanyAuthorized,
  updateDepartment
);
router.delete(
  "/delete/:departmentId",
  authenticateUser,
  isCompanyAuthorized,
  deleteDepartment
);

export default router;
