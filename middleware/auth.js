import jwt from "jsonwebtoken";
import { STATUS_CODE, STATUS_MESSAGES } from "../constant/status.js";
import { ERROR_MESSAGES, UNAUTHORIZE_MESSAGES } from "../constant/errors.js";
import ServerErrorResponse from "../utils/classes/ServerErrorResponse.js";
import { errorLog } from "../utils/logger.js";
import { ROLES } from "../constant/roles.js";
import User from "../models/user.js";

export const authenticateUser = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res
      .status(STATUS_CODE.UNAUTHORIZED)
      .json(
        ServerErrorResponse.customError(
          false,
          STATUS_CODE.UNAUTHORIZED,
          STATUS_MESSAGES.ERROR,
          UNAUTHORIZE_MESSAGES.NOT_LOGGED_IN,
          null
        )
      );
  }

  const token = authorization.replace("Bearer", "").trim();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const { userId } = payload;

    const userData = await User.findById(userId);

    if (!userData) {
      return res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json(
          ServerErrorResponse.customError(
            false,
            STATUS_CODE.UNAUTHORIZED,
            STATUS_MESSAGES.ERROR,
            UNAUTHORIZE_MESSAGES.USER_NOT_FOUND,
            null
          )
        );
    }

    req.user = userData;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json(
          ServerErrorResponse.customError(
            false,
            STATUS_CODE.UNAUTHORIZED,
            STATUS_MESSAGES.ERROR,
            ERROR_MESSAGES.EXPIRED_JWT,
            null
          )
        );
    }

    errorLog("JWT verification error:", error);
    return res
      .status(STATUS_CODE.UNAUTHORIZED)
      .json(
        ServerErrorResponse.customError(
          false,
          STATUS_CODE.UNAUTHORIZED,
          STATUS_MESSAGES.ERROR,
          ERROR_MESSAGES.INVALID_JWT,
          error
        )
      );
  }
};

export const isSuperAdminAuthorized = async (req, res, next) => {
  try {
    const currentUser = req.user;

    if (currentUser && currentUser.role === ROLES.SUPER_ADMIN) {
      req.superAdmin = currentUser;
      next();
    } else {
      res
        .status(STATUS_CODE.FORBIDDEN)
        .json(
          ServerErrorResponse.customError(
            false,
            STATUS_CODE.FORBIDDEN,
            STATUS_MESSAGES.ERROR,
            ERROR_MESSAGES.ENDPOINT_ACCESS_DENIED("super admin"),
            null
          )
        );
    }
  } catch (error) {
    res
      .status(STATUS_CODE.FORBIDDEN)
      .json(
        ServerErrorResponse.customError(
          false,
          STATUS_CODE.FORBIDDEN,
          STATUS_MESSAGES.ERROR,
          ERROR_MESSAGES.ENDPOINT_ACCESS_DENIED("super admin"),
          error.message
        )
      );
  }
};
export const isCompanyAuthorized = async (req, res, next) => {
  try {
    const currentUser = req.user;

    if (currentUser && currentUser.role === ROLES.COMPANY) {
      req.COMPANY = currentUser;
      next();
    } else {
      res
        .status(STATUS_CODE.FORBIDDEN)
        .json(
          ServerErrorResponse.customError(
            false,
            STATUS_CODE.FORBIDDEN,
            STATUS_MESSAGES.ERROR,
            ERROR_MESSAGES.ENDPOINT_ACCESS_DENIED("Company"),
            null
          )
        );
    }
  } catch (error) {
    res
      .status(STATUS_CODE.FORBIDDEN)
      .json(
        ServerErrorResponse.customError(
          false,
          STATUS_CODE.FORBIDDEN,
          STATUS_MESSAGES.ERROR,
          UNAUTHORIZE_MESSAGES.ENDPOINT_ACCESS_DENIED("Company"),
          error.message
        )
      );
  }
};

export const authenticateCompanyAndSuperadmin = async (req, res, next) => {
  try {
    const currentUser = req.user;

    if (
      currentUser &&
      (currentUser.role === ROLES.COMPANY ||
        currentUser.role === ROLES.SUPER_ADMIN)
    ) {
      req.COMPANY = currentUser;
      next();
    } else {
      return res
        .status(STATUS_CODE.FORBIDDEN)
        .json(
          ServerErrorResponse.customError(
            false,
            STATUS_CODE.FORBIDDEN,
            STATUS_MESSAGES.ERROR,
            ERROR_MESSAGES.ENDPOINT_ACCESS_DENIED("Company or Superadmin"),
            null
          )
        );
    }
  } catch (error) {
    console.error("Error in authentication middleware:", error.message);
    return res
      .status(STATUS_CODE.FORBIDDEN)
      .json(
        ServerErrorResponse.customError(
          false,
          STATUS_CODE.FORBIDDEN,
          STATUS_MESSAGES.ERROR,
          ERROR_MESSAGES.ENDPOINT_ACCESS_DENIED("Company or Superadmin"),
          error.message
        )
      );
  }
};
