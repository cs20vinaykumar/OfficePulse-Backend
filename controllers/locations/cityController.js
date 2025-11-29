import { ERROR_MESSAGES } from "../../constant/errors.js";
import { STATUS_CODE, STATUS_MESSAGES } from "../../constant/status.js";
import { SUCCESS_MESSAGES } from "../../constant/success.js";
import ServerErrorResponse from "../../utils/classes/ServerErrorResponse.js";
import ServerSuccessResponse from "../../utils/classes/ServerSuccessResponse.js";
import { validateRequiredFields } from "../../utils/basic.js";
import { errorLog } from "../../utils/logger.js";
import City from "../../models/city.js";
import Country from "../../models/country.js";
import Province from "../../models/province.js";

export const createCity = async (req, res) => {
  const { cityName, country, province } = req.body;

  const requiredFields = ["cityName", "country", "province"];
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

    // Check if province exists
    const provinceExists = await Province.findById(province);
    if (!provinceExists) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.PROVINCE_NOT_FOUND));
    }

    // Check if city already exists
    const existingCity = await City.findOne({ cityName });
    if (existingCity) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(
            ERROR_MESSAGES.CITY_NAME_ALREADY_EXISTS
          )
        );
    }

    const newCity = new City({ cityName, country, province });
    await newCity.save();

    return res
      .status(STATUS_CODE.CREATED)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_CODE.CREATED,
          STATUS_MESSAGES.SUCCESS,
          SUCCESS_MESSAGES.CREATED,
          newCity
        )
      );
  } catch (error) {
    errorLog("Error in createCity:", error.stack);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(ERROR_MESSAGES.SERVER_ERROR));
  }
};

export const getAllCities = async (req, res) => {
  try {
    const cities = await City.find()
      .populate("country", "countryName code")
      .populate("province", "provinceName");

    if (!cities || cities.length === 0) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.CITIES_NOT_FOUND));
    }

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_CODE.OK,
          STATUS_MESSAGES.SUCCESS,
          SUCCESS_MESSAGES.RETRIEVED,
          cities
        )
      );
  } catch (error) {
    errorLog("Error in getAllCities:", error.stack);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(ERROR_MESSAGES.SERVER_ERROR));
  }
};

export const updateCity = async (req, res) => {
  try {
    const { cityId } = req.params;
    const { cityName, country, province, isActive } = req.body;

    const requiredFields = ["cityName", "country", "province"];
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

    const city = await City.findById(cityId);
    if (!city) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.CITY_NOT_FOUND));
    }

    // Check if country and province exist
    const countryExists = await Country.findById(country);
    if (!countryExists) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.COUNTRY_NOT_FOUND));
    }

    const provinceExists = await Province.findById(province);
    if (!provinceExists) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.PROVINCE_NOT_FOUND));
    }

    // Check for duplicates
    const checkCity = await City.findOne({
      cityName,
      country,
      province,
      _id: { $ne: cityId },
    });

    if (checkCity) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(
            ERROR_MESSAGES.CITY_NAME_ALREADY_EXISTS
          )
        );
    }

    const updatedCity = await City.findByIdAndUpdate(
      cityId,
      { cityName, country, province, isActive },
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
          updatedCity
        )
      );
  } catch (error) {
    errorLog("Error in updateCity:", error.stack);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(ERROR_MESSAGES.SERVER_ERROR));
  }
};

export const deleteCity = async (req, res) => {
  try {
    const { cityId } = req.params;

    const deletedCity = await City.findByIdAndDelete(cityId);

    if (!deletedCity) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.CITY_NOT_FOUND));
    }

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_CODE.OK,
          STATUS_MESSAGES.SUCCESS,
          SUCCESS_MESSAGES.DELETED,
          deletedCity
        )
      );
  } catch (error) {
    errorLog("Error in deleteCity:", error.stack);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(ERROR_MESSAGES.SERVER_ERROR));
  }
};
