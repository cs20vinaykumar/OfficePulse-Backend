import Packages from "../../models/subscriptionPackage.js";
import { SUCCESS_MESSAGES } from "../../constant/success.js";
import { ERROR_MESSAGES } from "../../constant/errors.js";
import { STATUS_CODE, STATUS_MESSAGES } from "../../constant/status.js";
import ServerSuccessResponse from "../../utils/classes/ServerSuccessResponse.js";
import ServerErrorResponse from "../../utils/classes/ServerErrorResponse.js";
import { validateRequiredFields } from "../../utils/basic.js";
import {
  PACKAGE_DURATIONS,
  PACKAGE_DAYS_VALUES_ARRAY,
} from "../../constant/basic.js";
import { ROLES } from "../../constant/roles.js";
import { errorLog } from "../../utils/logger.js";

export const createPackage = async (req, res) => {
  const currentUser = req.user;
  const { packageName, price, duration, days } = req.body;

  // Only SUPERADMIN allowed
  if (currentUser.role !== ROLES.SUPER_ADMIN) {
    return res
      .status(STATUS_CODE.FORBIDDEN)
      .json(
        ServerErrorResponse.badRequest(
          ERROR_MESSAGES.ENDPOINT_ACCESS_DENIED("Superadmin")
        )
      );
  }

  const requiredFields = ["packageName", "price", "duration"];
  const validationResponse = await validateRequiredFields(
    req.body,
    requiredFields
  );

  if (!validationResponse.success) {
    return res.status(validationResponse.statusCode).json(validationResponse);
  }

  try {
    // Validate duration
    const allowedDurations = [...Object.values(PACKAGE_DURATIONS), "CUSTOM"];
    if (!allowedDurations.includes(duration)) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(
            ERROR_MESSAGES.INVALID_PACKAGE_DURATION
          )
        );
    }

    // If CUSTOM, days must be > 0
    if (duration === "CUSTOM" && (!days || days <= 0)) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(
            ERROR_MESSAGES.INVALID_CUSTOM_PACKAGE_DAYS
          )
        );
    }

    // Check duplicate package
    const existingPackage = await Packages.findOne({ packageName });
    if (existingPackage) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.PACKAGE_ALREADY_EXISTS)
        );
    }

    const packageData = { packageName, price, duration, days: days || 0 };

    const newPackage = await Packages.create(packageData);

    return res
      .status(STATUS_CODE.CREATED)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_CODE.CREATED,
          STATUS_MESSAGES.SUCCESS,
          SUCCESS_MESSAGES.CREATED,
          newPackage
        )
      );
  } catch (error) {
    errorLog("Error in createPackage:", error.stack);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(ERROR_MESSAGES.SERVER_ERROR));
  }
};

export const getAllPackages = async (req, res) => {
  try {
    const packages = await Packages.find();

    if (!packages || packages.length === 0) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.PACKAGES_NOT_FOUND));
    }

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_CODE.OK,
          STATUS_MESSAGES.SUCCESS,
          SUCCESS_MESSAGES.RETRIEVED,
          packages
        )
      );
  } catch (error) {
    errorLog("Error in getAllPackages:", error.stack);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(ERROR_MESSAGES.SERVER_ERROR));
  }
};

export const getActivePackages = async (req, res) => {
  try {
    const activePackages = await Packages.find({ isActive: true });

    if (!activePackages || activePackages.length === 0) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.PACKAGES_NOT_FOUND));
    }

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_CODE.OK,
          STATUS_MESSAGES.SUCCESS,
          SUCCESS_MESSAGES.RETRIEVED,
          activePackages
        )
      );
  } catch (error) {
    errorLog("Error in getActivePackages:", error.stack);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(ERROR_MESSAGES.SERVER_ERROR));
  }
};

export const updatePackage = async (req, res) => {
  const currentUser = req.user;
  if (currentUser.role !== ROLES.SUPER_ADMIN) {
    return res
      .status(STATUS_CODE.FORBIDDEN)
      .json(
        ServerErrorResponse.badRequest(
          ERROR_MESSAGES.ENDPOINT_ACCESS_DENIED("Superadmin")
        )
      );
  }

  try {
    const { packageId } = req.params;
    const { packageName, price, duration, days, isActive } = req.body;

    const requiredFields = ["packageName", "price", "duration"];
    const validationResponse = await validateRequiredFields(
      req.body,
      requiredFields
    );

    if (!validationResponse.success) {
      return res.status(validationResponse.statusCode).json(validationResponse);
    }

    const existingPackage = await Packages.findById(packageId);
    if (!existingPackage) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.PACKAGE_NOT_FOUND));
    }

    // Check duplicate
    const duplicate = await Packages.findOne({
      packageName,
      _id: { $ne: packageId },
    });

    if (duplicate) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.PACKAGE_ALREADY_EXISTS)
        );
    }

    const updatedData = { packageName, price, duration, days: days || 0 };
    if (isActive !== undefined)
      updatedData.isActive = isActive === true || isActive === "true";

    const updatedPackage = await Packages.findByIdAndUpdate(
      packageId,
      updatedData,
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
          updatedPackage
        )
      );
  } catch (error) {
    errorLog("Error in updatePackage:", error.stack);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(ERROR_MESSAGES.SERVER_ERROR));
  }
};

export const deletePackage = async (req, res) => {
  const currentUser = req.user;
  if (currentUser.role !== ROLES.SUPER_ADMIN) {
    return res
      .status(STATUS_CODE.FORBIDDEN)
      .json(
        ServerErrorResponse.badRequest(
          ERROR_MESSAGES.ENDPOINT_ACCESS_DENIED("Superadmin")
        )
      );
  }

  try {
    const { packageId } = req.params;

    const existingPackage = await Packages.findById(packageId);
    if (!existingPackage) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.PACKAGE_NOT_FOUND));
    }

    const deletedPackage = await Packages.findByIdAndDelete(packageId);

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_CODE.OK,
          STATUS_MESSAGES.SUCCESS,
          SUCCESS_MESSAGES.DELETED,
          deletedPackage
        )
      );
  } catch (error) {
    errorLog("Error in deletePackage:", error.stack);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(ERROR_MESSAGES.SERVER_ERROR));
  }
};

export const getAllPackagesDuration = async (req, res) => {
  try {
    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_CODE.OK,
          STATUS_MESSAGES.SUCCESS,
          SUCCESS_MESSAGES.RETRIEVED,
          { packagesDurationType: PACKAGE_DAYS_VALUES_ARRAY }
        )
      );
  } catch (error) {
    errorLog("Error in getAllPackagesDuration:", error.stack);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(ERROR_MESSAGES.SERVER_ERROR));
  }
};
