import User from "../../models/user.js";
import bcrypt from "bcrypt";
import {
  STATUS_CODE,
  STATUS_MESSAGES,
  ACCOUNT_STATUS,
} from "../../constant/status.js";
import { ERROR_MESSAGES, UNAUTHORIZE_MESSAGES } from "../../constant/errors.js";
import { SUCCESS_MESSAGES } from "../../constant/success.js";
import ServerSuccessResponse from "../../utils/classes/ServerSuccessResponse.js";
import ServerErrorResponse from "../../utils/classes/ServerErrorResponse.js";
import { emailRegex } from "../../utils/regex.js";
import { generateToken } from "../../utils/jwtToken.js";
import { generateAndSaveOtp } from "../../services/otpServices/generateAndSendOtp.js";
import { errorLog } from "../../utils/logger.js";
import { determineGatewayUser } from "../../services/emailGateway/emailgatewayService.js";
import { OTP_PURPOSES, ROLES, TEMPLATE_TYPES } from "../../constant/roles.js";
import { sendNotification } from "../../services/notification/sendNotification.js";
import { verifyOtpCode } from "../../services/otpServices/otpVerificationService.js";

export const loginUser = async (req, res) => {
  const { emailAddress, password } = req.body;

  if (!emailAddress || !password) {
    return res
      .status(STATUS_CODE.BAD_REQUEST)
      .json(
        ServerErrorResponse.badRequest(ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS)
      );
  }

  if (!emailRegex.test(emailAddress)) {
    return res
      .status(STATUS_CODE.BAD_REQUEST)
      .json(ServerErrorResponse.badRequest(ERROR_MESSAGES.INVALID_EMAIL));
  }

  try {
    const user = await User.findOne({ emailAddress });
    if (!user) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(
          ServerErrorResponse.notFound(UNAUTHORIZE_MESSAGES.USER_NOT_FOUND)
        );
    }

    if (user.accountStatus === ACCOUNT_STATUS.INACTIVE) {
      return res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json(
          ServerErrorResponse.customError(
            false,
            STATUS_CODE.UNAUTHORIZED,
            STATUS_MESSAGES.FAILED,
            UNAUTHORIZE_MESSAGES.INACTIVE_ACCOUNT,
            null
          )
        );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json(
          ServerErrorResponse.customError(
            false,
            STATUS_CODE.UNAUTHORIZED,
            STATUS_MESSAGES.FAILED,
            UNAUTHORIZE_MESSAGES.INCORRECT_PASSWORD,
            null
          )
        );
    }
    let gatewayUser;
    try {
      gatewayUser = await determineGatewayUser(user);
    } catch (error) {
      errorLog("Error determining gateway user:", error);
      return res
        .status(STATUS_CODE.SERVER_ERROR)
        .json(ServerErrorResponse.internal(ERROR_MESSAGES.GATEWAY_ERROR));
    }

    let otpResponse;

    if (user.isSecurityCodeEnabled) {
      otpResponse = await generateAndSaveOtp(
        user.emailAddress,
        OTP_PURPOSES.LOGIN
      );

      if (otpResponse.statusCode === STATUS_CODE.BAD_REQUEST) {
        return res
          .status(STATUS_CODE.SERVER_ERROR)
          .json(
            ServerErrorResponse.badRequest(ERROR_MESSAGES.OTP_FAILED_TO_SENT)
          );
      }

      await sendNotification(
        gatewayUser,
        TEMPLATE_TYPES.ACCOUNT_AUTHORIZATION,
        user,
        {
          otp: otpResponse.data.otp,
          expireTime: otpResponse.data.expireTime,
        }
      );

      return res
        .status(STATUS_CODE.OK)
        .json(
          ServerSuccessResponse.successResponse(
            true,
            STATUS_CODE.OK,
            STATUS_MESSAGES.SUCCESS,
            SUCCESS_MESSAGES.OTP_SENT
          )
        );
    }

    const tokenPayload = {
      userId: user._id,
      fullName: user.fullName,
      emailAddress: user.emailAddress,
      phoneNo: user.phoneNo,
      role: user.role,
    };
    const token = generateToken(tokenPayload);

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_CODE.OK,
          STATUS_MESSAGES.SUCCESS,
          SUCCESS_MESSAGES.LOGGED_IN,
          { authToken: token }
        )
      );
  } catch (error) {
    errorLog("Error in loginUser:", error.stack);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(ERROR_MESSAGES.SERVER_ERROR));
  }
};

export const verifyLoginOTP = async (req, res) => {
  try {
    const { emailAddress, otp } = req.body;

    if (!emailAddress || !otp) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS)
        );
    }

    const otpResult = await verifyOtpCode(emailAddress, otp);

    if (!otpResult.success) {
      return res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json(
          ServerErrorResponse.customError(
            STATUS_CODE.UNAUTHORIZED,
            otpResult.message
          )
        );
    }

    const user = await User.findOne({ emailAddress });

    if (!user) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(
          ServerErrorResponse.notFound(UNAUTHORIZE_MESSAGES.USER_NOT_FOUND)
        );
    }

    const tokenPayload = {
      userId: user._id,
      fullName: user.fullName,
      emailAddress: user.emailAddress,
      phoneNo: user.phoneNo,
      role: user.role,
      isActive: user.isActive,
    };

    const authToken = generateToken(tokenPayload);

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.LOGGED_IN,
          { authToken }
        )
      );
  } catch (error) {
    console.error("Error in verifyOTP:", error);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(error));
  }
};

export const toggleSecurityCode = async (req, res) => {
  const currentUser = req.user;
  const { targetId } = req.params;
  const { isSecurityCodeEnabled } = req.body;

  if (!targetId || typeof isSecurityCodeEnabled !== "boolean") {
    return res
      .status(STATUS_CODE.BAD_REQUEST)
      .json(ServerErrorResponse.badRequest(ERROR_MESSAGES.INVALID_INPUT));
  }

  try {
    const targetUser = await User.findById(targetId);
    if (!targetUser) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.NOT_FOUND));
    }

    if (targetUser.role === ROLES.COMPANY) {
      if (currentUser.role !== ROLES.SUPER_ADMIN) {
        return res
          .status(STATUS_CODE.FORBIDDEN)
          .json(
            ServerErrorResponse.forbidden(
              UNAUTHORIZE_MESSAGES.UNAUTHORIZED_ACCESS
            )
          );
      }
    } else {
      if (currentUser.role !== ROLES.COMPANY) {
        return res
          .status(STATUS_CODE.FORBIDDEN)
          .json(
            ServerErrorResponse.forbidden(
              UNAUTHORIZE_MESSAGES.UNAUTHORIZED_ACCESS
            )
          );
      }

      if (
        !targetUser.company ||
        targetUser.company.toString() !== currentUser._id.toString()
      ) {
        return res
          .status(STATUS_CODE.UNAUTHORIZED)
          .json(
            ServerErrorResponse.unauthorized(
              UNAUTHORIZE_MESSAGES.NOT_BELONG_TO_COMPANY
            )
          );
      }
    }

    targetUser.isSecurityCodeEnabled = isSecurityCodeEnabled;
    await targetUser.save();

    return res.status(STATUS_CODE.OK).json(
      ServerSuccessResponse.successResponse(
        true,
        STATUS_CODE.OK,
        STATUS_MESSAGES.SUCCESS,
        SUCCESS_MESSAGES.UPDATED,
        {
          isSecurityCodeEnabled: targetUser.isSecurityCodeEnabled,
        }
      )
    );
  } catch (error) {
    console.error("Toggle OTP Error:", error);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(error));
  }
};
