import { ERROR_MESSAGES, UNAUTHORIZE_MESSAGES } from "../../constant/errors.js";
import { STATUS_CODE, STATUS_MESSAGES } from "../../constant/status.js";
import { SUCCESS_MESSAGES } from "../../constant/success.js";
import ServerErrorResponse from "../../utils/classes/ServerErrorResponse.js";
import ServerSuccessResponse from "../../utils/classes/ServerSuccessResponse.js";
import { validateRequiredFields } from "../../utils/basic.js";
import { errorLog } from "../../utils/logger.js";
import Province from "../../models/province.js";
import Country from "../../models/country.js";

export const createProvince = async (req, res) => {
  const { provinceName, country } = req.body;

  const requiredFields = ["provinceName", "country"];
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

  try {
    // Check if country exists
    const countryExists = await Country.findById(country);
    if (!countryExists) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.COUNTRY_NOT_FOUND));
    }

    // Check if province already exists
    const existingProvince = await Province.findOne({ provinceName });
    if (existingProvince) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(
            ERROR_MESSAGES.PROVINCE_NAME_ALREADY_EXISTS
          )
        );
    }

    const newProvince = new Province({ provinceName, country });
    await newProvince.save();

    return res
      .status(STATUS_CODE.CREATED)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_CODE.CREATED,
          STATUS_MESSAGES.SUCCESS,
          SUCCESS_MESSAGES.CREATED,
          newProvince
        )
      );
  } catch (error) {
    errorLog("Error in createProvince:", error.stack);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(ERROR_MESSAGES.SERVER_ERROR));
  }
};

export const getAllProvinces = async (req, res) => {
  try {
    const provinces = await Province.find().populate(
      "country",
      "countryName code"
    );

    if (!provinces || provinces.length === 0) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.PROVINCES_NOT_FOUND));
    }

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_CODE.OK,
          STATUS_MESSAGES.SUCCESS,
          SUCCESS_MESSAGES.RETRIEVED,
          provinces
        )
      );
  } catch (error) {
    errorLog("Error in getAllProvinces:", error.stack);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(ERROR_MESSAGES.SERVER_ERROR));
  }
};

export const updateProvince = async (req, res) => {
  try {
    const { provinceId } = req.params;
    const { provinceName, country, isActive } = req.body;

    const requiredFields = ["provinceName", "country"];
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

    if (typeof isActive !== "boolean") {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(ServerErrorResponse.badRequest(ERROR_MESSAGES.INVALID_INPUT));
    }

    const province = await Province.findById(provinceId);
    if (!province) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.PROVINCE_NOT_FOUND));
    }

    // Check for duplicates
    const checkProvince = await Province.findOne({
      provinceName,
      country,
      _id: { $ne: provinceId },
    });

    if (checkProvince) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(
            ERROR_MESSAGES.PROVINCE_NAME_ALREADY_EXISTS
          )
        );
    }

    const updatedProvince = await Province.findByIdAndUpdate(
      provinceId,
      { provinceName, country, isActive },
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
          updatedProvince
        )
      );
  } catch (error) {
    errorLog("Error in updateProvince:", error.stack);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(ERROR_MESSAGES.SERVER_ERROR));
  }
};

export const deleteProvince = async (req, res) => {
  try {
    const { provinceId } = req.params;

    const deletedProvince = await Province.findByIdAndDelete(provinceId);

    if (!deletedProvince) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.PROVINCE_NOT_FOUND));
    }

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_CODE.OK,
          STATUS_MESSAGES.SUCCESS,
          SUCCESS_MESSAGES.DELETED,
          deletedProvince
        )
      );
  } catch (error) {
    errorLog("Error in deleteProvince:", error.stack);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(ERROR_MESSAGES.SERVER_ERROR));
  }
};
