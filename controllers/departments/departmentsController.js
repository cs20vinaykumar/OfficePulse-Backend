import { ERROR_MESSAGES } from "../../constant/errors.js";
import { SUCCESS_MESSAGES } from "../../constant/success.js";
import { STATUS_CODE, STATUS_MESSAGES } from "../../constant/status.js";
import Department from "../../models/department.js";
import ServerErrorResponse from "../../utils/classes/ServerErrorResponse.js";
import ServerSuccessResponse from "../../utils/classes/ServerSuccessResponse.js";
import { validateRequiredFields } from "../../utils/basic.js";
import { errorLog } from "../../utils/logger.js";

export const createDepartment = async (req, res) => {
  const currentUser = req.user;
  const { departmentName, description, head } = req.body;

  const requiredFields = ["departmentName"];
  const validationResponse = await validateRequiredFields(
    req.body,
    requiredFields
  );

  if (!validationResponse.success) {
    return res.status(validationResponse.statusCode).json(validationResponse);
  }

  try {
    const companyId = currentUser._id;

    const existingDepartment = await Department.findOne({
      company: companyId,
      departmentName,
    });

    if (existingDepartment) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(
            ERROR_MESSAGES.DEPARTMENT_ALREADY_EXISTS
          )
        );
    }

    const newDepartment = await Department.create({
      departmentName,
      description: description || "",
      head: head || null,
      company: companyId,
      isActive: true,
    });

    return res
      .status(STATUS_CODE.CREATED)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_CODE.CREATED,
          STATUS_MESSAGES.SUCCESS,
          SUCCESS_MESSAGES.CREATED,
          newDepartment
        )
      );
  } catch (error) {
    errorLog("Error in createDepartment:", error.stack);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(ERROR_MESSAGES.SERVER_ERROR));
  }
};

export const getDepartments = async (req, res) => {
  const currentUser = req.user;
  console.log(currentUser);
  try {
    const departments = await Department.find({
      company: currentUser._id,
    }).populate("head", "fullName");

    if (!departments || departments.length === 0) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(
          ServerErrorResponse.notFound(ERROR_MESSAGES.DEPARTMENTS_NOT_FOUND)
        );
    }

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_CODE.OK,
          STATUS_MESSAGES.SUCCESS,
          SUCCESS_MESSAGES.RETRIEVED,
          departments
        )
      );
  } catch (error) {
    errorLog("Error in getDepartments:", error.stack);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(ERROR_MESSAGES.SERVER_ERROR));
  }
};

export const updateDepartment = async (req, res) => {
  const { departmentId } = req.params;
  const { departmentName, description, head, isActive } = req.body;
  const currentUser = req.user;

  try {
    const existingDepartment = await Department.findById(departmentId);

    if (
      !existingDepartment ||
      existingDepartment.company.toString() !== currentUser._id.toString()
    ) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(
          ServerErrorResponse.notFound(ERROR_MESSAGES.DEPARTMENT_NOT_FOUND)
        );
    }

    if (
      departmentName &&
      departmentName !== existingDepartment.departmentName
    ) {
      const duplicate = await Department.findOne({
        _id: { $ne: departmentId },
        company: currentUser._id,
        departmentName: departmentName,
      });

      if (duplicate) {
        return res
          .status(STATUS_CODE.BAD_REQUEST)
          .json(
            ServerErrorResponse.badRequest(
              ERROR_MESSAGES.DEPARTMENT_ALREADY_EXISTS
            )
          );
      }
    }

    const updatedDepartment = await Department.findByIdAndUpdate(
      departmentId,
      {
        departmentName: departmentName || existingDepartment.departmentName,
        description:
          description !== undefined
            ? description
            : existingDepartment.description,
        head: head !== undefined ? head : existingDepartment.head,
        isActive:
          isActive !== undefined ? isActive : existingDepartment.isActive,
      },
      { new: true }
    );

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_CODE.OK,
          STATUS_MESSAGES.SUCCESS,
          SUCCESS_MESSAGES.UPDATED,
          updatedDepartment
        )
      );
  } catch (error) {
    errorLog("Error in updateDepartment:", error.stack);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(ERROR_MESSAGES.SERVER_ERROR));
  }
};

export const deleteDepartment = async (req, res) => {
  const { departmentId } = req.params;
  const currentUser = req.user;

  try {
    const existingDepartment = await Department.findById(departmentId);

    if (
      !existingDepartment ||
      existingDepartment.company.toString() !== currentUser._id.toString()
    ) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(
          ServerErrorResponse.notFound(ERROR_MESSAGES.DEPARTMENT_NOT_FOUND)
        );
    }

    const deletedDepartment = await Department.findByIdAndDelete(departmentId);

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_CODE.OK,
          STATUS_MESSAGES.SUCCESS,
          SUCCESS_MESSAGES.DELETED,
          deletedDepartment
        )
      );
  } catch (error) {
    errorLog("Error in deleteDepartment:", error.stack);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(ERROR_MESSAGES.SERVER_ERROR));
  }
};
