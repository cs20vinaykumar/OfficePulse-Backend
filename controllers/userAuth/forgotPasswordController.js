import { STATUS_CODE, STATUS_MESSAGES } from "../../constant/status.js";
import { SUCCESS_MESSAGES } from "../../constant/success.js";
import { ERROR_MESSAGES, UNAUTHORIZE_MESSAGES } from "../../constant/errors.js";
import ServerErrorResponse from "../../utils/classes/ServerErrorResponse.js";
import ServerSuccessResponse from "../../utils/classes/ServerSuccessResponse.js";
import User from "../../models/user.js";
import { sendNotification } from "../../services/notification/sendNotification.js";
import { OTP_PURPOSES, TEMPLATE_TYPES } from "../../constant/roles.js";
import { determineGatewayUser } from "../../services/emailGateway/emailgatewayService.js";
import bcrypt from "bcrypt";
import { validateRequiredFields } from "../../utils/basic.js";
import { passwordRegex } from "../../utils/regex.js";
import { errorLog } from "../../utils/logger.js";
import { generateAndSaveOtp } from "../../services/otpServices/generateAndSendOtp.js";
import { verifyOtpCode } from "../../services/otpServices/otpVerificationService.js";

export const sendResetOTP = async (req, res) => {
  try {
    const { emailAddress } = req.body;

    if (!emailAddress) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS)
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

    const gatewayUser = await determineGatewayUser(user);

    const otpResponse = await generateAndSaveOtp(
      emailAddress,
      OTP_PURPOSES.PASSWORD_RESET
    );
    if (!otpResponse.success) {
      return res
        .status(STATUS_CODE.SERVER_ERROR)
        .json(
          ServerErrorResponse.internal(ERROR_MESSAGES.OTP_GENERATION_FAILED)
        );
    }

    await sendNotification(gatewayUser, TEMPLATE_TYPES.PASSWORD_RESET, user, {
      otp: otpResponse.data.otp,
      expireTime: otpResponse.data.expireTime,
    });

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
  } catch (error) {
    errorLog("Error in requestPasswordReset:", error);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(error));
  }
};

export const verifyResetOTP = async (req, res) => {
  try {
    const { emailAddress, otp } = req.body;

    if (!emailAddress || !otp) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS)
        );
    }

    const otpResponse = await verifyOtpCode(emailAddress, otp);

    if (!otpResponse.success) {
      return res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json(ServerErrorResponse.badRequest(otpResponse.message));
    }

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_CODE.OK,
          STATUS_MESSAGES.SUCCESS,
          SUCCESS_MESSAGES.OTP_VERIFIED
        )
      );
  } catch (error) {
    errorLog("Error in verifyResetOTP:", error);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(error));
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { emailAddress, newPassword } = req.body;

    if (!emailAddress || !newPassword) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS)
        );
    }

    if (!passwordRegex.test(newPassword)) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(ServerErrorResponse.badRequest(ERROR_MESSAGES.INVALID_PASSWORD));
    }

    const user = await User.findOne({ emailAddress });

    if (!user) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(
          ServerErrorResponse.notFound(UNAUTHORIZE_MESSAGES.USER_NOT_FOUND)
        );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_CODE.OK,
          STATUS_MESSAGES.SUCCESS,
          SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS
        )
      );
  } catch (error) {
    errorLog("Error in resetPassword:", error);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(error));
  }
};
