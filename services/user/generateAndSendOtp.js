import { STATUS_CODE, STATUS_MESSAGES } from "../../constant/status.js";
import { generateNewOtpCode } from "../../utils/basic.js";
import ServerSuccessResponse from "../../utils/classes/ServerSuccessResponse.js";
import OTP from "../../models/otp.js";
import { OTP_PURPOSES } from "../../constant/roles.js";
import { SUCCESS_MESSAGES } from "../../constant/success.js";
import ServerErrorResponse from "../../utils/classes/ServerErrorResponse.js";
import { UNAUTHORIZE_MESSAGES } from "../../constant/errors.js";

export const generateAndSaveOtp = async (emailAddress) => {
  const existingOtp = await OTP.findOne({ emailAddress });

  if (existingOtp) {
    const createdAt = existingOtp.createdAt.getTime();
    const expiryTime = createdAt + 120000;
    const now = Date.now();

    if (expiryTime > now && !existingOtp.isExpired) {
      return ServerErrorResponse.badRequest(UNAUTHORIZE_MESSAGES.OTP_EXPIRED);
    }

    await OTP.findByIdAndDelete(existingOtp._id);
  }

  const otpCode = generateNewOtpCode();

  const newOtp = new OTP({
    emailAddress,
    otp: otpCode,
    purpose: OTP_PURPOSES.LOGIN,
  });

  await newOtp.save();

  return ServerSuccessResponse.successResponse(
    true,
    STATUS_CODE.OK,
    STATUS_MESSAGES.SUCCESS,
    SUCCESS_MESSAGES.OTP_SENT,
    {
      otp: otpCode,
      expireTime: 2,
    }
  );
};
