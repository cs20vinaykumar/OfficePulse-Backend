import { ERROR_MESSAGES, UNAUTHORIZE_MESSAGES } from "../../constant/errors.js";
import { STATUS_CODE, STATUS_MESSAGES } from "../../constant/status.js";
import { SUCCESS_MESSAGES } from "../../constant/success.js";
import ServerErrorResponse from "../../utils/classes/ServerErrorResponse.js";
import ServerSuccessResponse from "../../utils/classes/ServerSuccessResponse.js";
import { validateRequiredFields } from "../../utils/basic.js";
import { emailRegex, passwordRegex } from "../../utils/regex.js";
import { getUserByEmail } from "../../services/user/userService.js";
import bcrypt from "bcrypt";
import SuperAdmin from "../../models/superAdmin.js";
import { ROLES } from "../../constant/roles.js";
import { errorLog } from "../../utils/logger.js";
import Company from "../../models/company.js";
import { processUploadedFiles } from "../../services/fileUploader/fileUploader.js";
import {
  handleDocumentImages,
  handleSingleImages,
} from "../../services/fileUploader/updateFileImages.js";

export const createSuperAdmin = async (req, res, next) => {
  const { fullName, emailAddress, password, phoneNo } = req.body;

  const requiredFields = ["fullName", "emailAddress", "password", "phoneNo"];

  const validationResponse = await validateRequiredFields(
    req.body,
    requiredFields
  );

  if (
    !validationResponse.success &&
    validationResponse.statusCode === STATUS_CODE.BAD_REQUEST
  ) {
    return res.status(validationResponse.statusCode).json(validationResponse);
  }

  if (!emailRegex.test(emailAddress)) {
    return res
      .status(STATUS_CODE.BAD_REQUEST)
      .json(ServerErrorResponse.badRequest(ERROR_MESSAGES.INVALID_EMAIL));
  }

  if (!passwordRegex.test(password)) {
    return res
      .status(STATUS_CODE.BAD_REQUEST)
      .json(ServerErrorResponse.badRequest(ERROR_MESSAGES.INVALID_PASSWORD));
  }

  try {
    const userServiceResponse = await getUserByEmail(emailAddress);
    if (userServiceResponse.success) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.USER_ALREADY_EXISTS)
        );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new SuperAdmin({
      fullName,
      emailAddress,
      password: hashedPassword,
      phoneNo,
      role: ROLES.SUPER_ADMIN,
    });

    await newUser.save();
    res
      .status(STATUS_CODE.CREATED)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_CODE.CREATED,
          STATUS_MESSAGES.SUCCESS,
          SUCCESS_MESSAGES.CREATED,
          null
        )
      );
  } catch (error) {
    errorLog("Error in createSuperAdmin:", error.stack);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(ERROR_MESSAGES.SERVER_ERROR));
  }
};

export const createCompany = async (req, res) => {
  const {
    emailAddress,
    password,
    phoneNo,
    companyName,
    contactPersonName,
    address,
    country,
    province,
    city,
    subscriptionPlan,
    subscriptionExpiry,
    extraInfo,
  } = req.body;

  const { files } = req;

  const requiredFields = [
    "emailAddress",
    "password",
    "phoneNo",
    "companyName",
    "contactPersonName",
    "address",
    "country",
    "province",
    "city",
    "subscriptionPlan",
    "subscriptionExpiry",
  ];

  const validationResponse = await validateRequiredFields(
    req.body,
    requiredFields
  );
  if (
    !validationResponse.success &&
    validationResponse.statusCode === STATUS_CODE.BAD_REQUEST
  ) {
    return res.status(validationResponse.statusCode).json(validationResponse);
  }

  if (!emailRegex.test(emailAddress)) {
    return res
      .status(STATUS_CODE.BAD_REQUEST)
      .json(ServerErrorResponse.badRequest(ERROR_MESSAGES.INVALID_EMAIL));
  }

  if (!passwordRegex.test(password)) {
    return res
      .status(STATUS_CODE.BAD_REQUEST)
      .json(ServerErrorResponse.badRequest(ERROR_MESSAGES.INVALID_PASSWORD));
  }

  try {
    const existingUserResponse = await getUserByEmail(emailAddress);
    if (existingUserResponse.success) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.USER_ALREADY_EXISTS)
        );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { mainImagePath, documentsMap } = processUploadedFiles(
      files,
      "profileImage"
    );
    const newCompany = new Company({
      fullName: contactPersonName,
      password: hashedPassword,
      phoneNo,
      emailAddress,
      role: ROLES.COMPANY,
      companyName,
      contactPersonName,
      address,
      country,
      province,
      city,
      subscriptionPlan,
      subscriptionExpiry,
      extraInfo,
      profileImage: mainImagePath,
      documents: documentsMap,
      isActive: true,
    });

    await newCompany.save();

    return res
      .status(STATUS_CODE.CREATED)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_CODE.CREATED,
          STATUS_MESSAGES.SUCCESS,
          SUCCESS_MESSAGES.CREATED,
          null
        )
      );
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.emailAddress) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.USER_ALREADY_EXISTS)
        );
    }
    errorLog("Error in createCompany:", error.stack);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(ERROR_MESSAGES.SERVER_ERROR));
  }
};

export const getAllCompany = async (req, res) => {
  try {
    const companies = await Company.find();

    if (!companies || companies.length === 0) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.badRequest(ERROR_MESSAGES.NOT_FOUND));
    }

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_CODE.OK,
          STATUS_MESSAGES.SUCCESS,
          SUCCESS_MESSAGES.OPERATION_SUCCESSFUL,
          companies
        )
      );
  } catch (error) {
    errorLog("Error in getAllCompany:", error.stack);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(error));
  }
};

export const getCompanyById = async (req, res) => {
  const { companyId } = req.params;

  try {
    const foundCompany = await Company.findById(companyId);
    if (!foundCompany) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.COMPANY_NOT_FOUND));
    }

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_CODE.OK,
          STATUS_MESSAGES.SUCCESS,
          SUCCESS_MESSAGES.OPERATION_SUCCESSFUL,
          foundCompany
        )
      );
  } catch (error) {
    errorLog("Error in getCompanyById:", error.stack);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(error));
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    const {
      emailAddress,
      phoneNo,
      companyName,
      contactPersonName,
      address,
      country,
      province,
      city,
      subscriptionPlan,
      subscriptionExpiry,
      extraInfo,
      isActive,
      previousDocuments,
    } = req.body;

    const requiredFields = [
      "emailAddress",
      "phoneNo",
      "companyName",
      "contactPersonName",
      "address",
      "country",
      "province",
      "city",
      "subscriptionPlan",
      "subscriptionExpiry",
    ];

    // Required fields validation
    const validationResponse = await validateRequiredFields(
      req.body,
      requiredFields
    );
    if (!validationResponse.success) {
      return res.status(validationResponse.statusCode).json(validationResponse);
    }

    const isActiveBool =
      isActive === true || isActive === "true" ? true : false;

    const company = await Company.findById(companyId);
    if (!company) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.COMPANY_NOT_FOUND));
    }

    const checkEmail = await Company.findOne({
      emailAddress,
      _id: { $ne: companyId },
    });

    if (checkEmail) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.USER_ALREADY_EXISTS)
        );
    }

    const convertMapToObject = (map) =>
      map instanceof Map ? Object.fromEntries(map) : map || {};

    let existingDocuments = convertMapToObject(company.documents);

    let parsedPreviousDocs = existingDocuments;

    if (previousDocuments) {
      try {
        parsedPreviousDocs = JSON.parse(previousDocuments);
      } catch (e) {
        parsedPreviousDocs = existingDocuments;
      }
    }

    const updatedDocuments = handleDocumentImages(req, parsedPreviousDocs);

    const updatedProfileImage = handleSingleImages(
      req,
      "profileImage",
      company.profileImage
    );
    const updatedData = {
      emailAddress,
      phoneNo,
      companyName,
      contactPersonName,
      address,
      country,
      province,
      city,
      subscriptionPlan,
      subscriptionExpiry,
      extraInfo,
      isActive: isActiveBool,
      profileImage: updatedProfileImage,
      documents: updatedDocuments, // <-- now always plain JS object (safe)
    };

    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
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
          updatedCompany
        )
      );
  } catch (error) {
    errorLog("Error in updateCompany:", error.stack);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(ERROR_MESSAGES.SERVER_ERROR));
  }
};

export const deleteCompany = async (req, res) => {
  const { companyId } = req.params;

  try {
    const deletedCompany = await Company.findByIdAndDelete(companyId);

    if (!deletedCompany) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.COMPANY_NOT_FOUND));
    }

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_CODE.OK,
          STATUS_MESSAGES.SUCCESS,
          SUCCESS_MESSAGES.DELETED,
          deletedCompany
        )
      );
  } catch (error) {
    errorLog("Error in deleteCompany:", error.stack);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(error));
  }
};
