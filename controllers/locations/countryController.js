import { ERROR_MESSAGES, UNAUTHORIZE_MESSAGES } from "../../constant/errors.js";
import { STATUS_CODE, STATUS_MESSAGES } from "../../constant/status.js";
import { SUCCESS_MESSAGES } from "../../constant/success.js";
import ServerErrorResponse from "../../utils/classes/ServerErrorResponse.js";
import ServerSuccessResponse from "../../utils/classes/ServerSuccessResponse.js";
import { validateRequiredFields } from "../../utils/basic.js";
import { errorLog } from "../../utils/logger.js";
import Country from "../../models/country.js";

export const createCountry = async (req, res) => {
  const { countryName, code } = req.body;

  const requiredFields = ["countryName", "code"];
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
    const existingCountryByName = await Country.findOne({ countryName });
    if (existingCountryByName) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(
            ERROR_MESSAGES.COUNTRY_NAME_ALREADY_EXISTS
          )
        );
    }

    const existingCountryByCode = await Country.findOne({ code });
    if (existingCountryByCode) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(
            ERROR_MESSAGES.COUNTRY_CODE_ALREADY_EXISTS
          )
        );
    }

    const newCountry = new Country({
      countryName,
      code,
    });

    await newCountry.save();

    return res
      .status(STATUS_CODE.CREATED)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_CODE.CREATED,
          STATUS_MESSAGES.SUCCESS,
          SUCCESS_MESSAGES.CREATED,
          newCountry
        )
      );
  } catch (error) {
    errorLog("Error in createCountry:", error.stack);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(ERROR_MESSAGES.SERVER_ERROR));
  }
};

export const getAllCountries = async (req, res) => {
  try {
    const countries = await Country.find();

    if (!countries || countries.length === 0) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.COUNTRIES_NOT_FOUND));
    }

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_CODE.OK,
          STATUS_MESSAGES.SUCCESS,
          SUCCESS_MESSAGES.RETRIEVED,
          countries
        )
      );
  } catch (error) {
    errorLog("Error in getAllCountries:", error.stack);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(ERROR_MESSAGES.SERVER_ERROR));
  }
};

export const updateCountry = async (req, res) => {
  try {
    const { countryId } = req.params;
    const { countryName, code, isActive } = req.body;

    const requiredFields = ["countryName", "code"];

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

    const country = await Country.findById(countryId);

    if (!country) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.COUNTRY_NOT_FOUND));
    }

    const checkCountry = await Country.findOne({
      countryName,
      code,
      _id: { $ne: countryId },
    });

    if (checkCountry) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(
            ERROR_MESSAGES.COUNTRY_NAME_ALREADY_EXISTS
          )
        );
    }

    const updatedCountry = await Country.findByIdAndUpdate(
      countryId,
      { countryName, code, isActive },
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
          updatedCountry
        )
      );
  } catch (error) {
    errorLog("Error in updateCountry:", error.stack);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(ERROR_MESSAGES.SERVER_ERROR));
  }
};

export const deleteCountry = async (req, res) => {
  try {
    const { countryId } = req.params;

    const deletedCountry = await Country.findByIdAndDelete(countryId);

    if (!deletedCountry) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.COUNTRY_NOT_FOUND));
    }

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_CODE.OK,
          STATUS_MESSAGES.SUCCESS,
          SUCCESS_MESSAGES.DELETED,
          deletedCountry
        )
      );
  } catch (error) {
    errorLog("Error in deleteCountry:", error.stack);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(ERROR_MESSAGES.SERVER_ERROR));
  }
};
