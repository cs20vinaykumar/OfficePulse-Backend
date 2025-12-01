import { UNAUTHORIZE_MESSAGES } from "../../constant/errors.js";
import { SUCCESS_MESSAGES } from "../../constant/success.js";
import OTP from "../../models/otp.js";
import { errorLog } from "../../utils/logger.js";

export const verifyOtpCode = async (emailAddress, enteredOTP) => {
  try {
    const otpData = await OTP.findOne({
      emailAddress,
      otp: Number(enteredOTP),
    });

    if (!otpData) {
      return { message: UNAUTHORIZE_MESSAGES.OTP_INVALID };
    }

    const createdAt = otpData.createdAt.getTime();
    const expiryTime = createdAt + 120000;

    if (expiryTime < Date.now()) {
      await OTP.findOneAndDelete({ emailAddress });
      return { message: UNAUTHORIZE_MESSAGES.OTP_EXPIRED };
    }

    await OTP.findByIdAndDelete(otpData._id);

    return { success: true, message: SUCCESS_MESSAGES.OTP_VERIFIED };
  } catch (error) {
    errorLog("Error in verifyOtpCode:", error);
    return { success: false, message: "Error occurred while verifying OTP" };
  }
};
