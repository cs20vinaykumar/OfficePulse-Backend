import { ERROR_MESSAGES } from "../../constant/errors.js";
import { STATUS_CODE, STATUS_MESSAGES } from "../../constant/status.js";
import ServerErrorResponse from "../../utils/classes/ServerErrorResponse.js";
import { sendEmail } from "../../utils/emailSender.js";
import { getUserEmailGateway } from "../../services/emailGateway/emailgatewayService.js";
import { compileAndGenerateEmailContent } from "../template/emailTemplateService.js";
import { errorLog } from "../../utils/logger.js";

export const sendNotification = async (
  currentUser,
  type,
  receiverInstance,
  extraData = {}
) => {
  try {
    if (!receiverInstance) {
      throw new Error("Receiver instance is required");
    }

    const emailGatewayServiceResponse = await getUserEmailGateway(currentUser);

    if (
      !emailGatewayServiceResponse?.success ||
      !emailGatewayServiceResponse?.data?.isActive
    ) {
      return {
        success: false,
        error: ServerErrorResponse.customError(
          false,
          STATUS_CODE.NOT_FOUND,
          STATUS_MESSAGES.FAILED,
          ERROR_MESSAGES.EMAIL_GATEWAY_NOT_FOUND,
          null
        ),
      };
    }

    const compiledEmailServiceResponse = await compileAndGenerateEmailContent(
      currentUser,
      type,
      receiverInstance,
      extraData
    );

    if (
      !compiledEmailServiceResponse ||
      !compiledEmailServiceResponse.success
    ) {
      return {
        success: false,
        error: ServerErrorResponse.customError(
          false,
          STATUS_CODE.BAD_REQUEST,
          STATUS_MESSAGES.FAILED,
          "Failed to compile email content",
          null
        ),
      };
    }

    if (
      !compiledEmailServiceResponse.data?.emailContent ||
      !compiledEmailServiceResponse.data?.subject
    ) {
      return {
        success: false,
        error: ServerErrorResponse.customError(
          false,
          STATUS_CODE.BAD_REQUEST,
          STATUS_MESSAGES.FAILED,
          "Email content or subject missing",
          null
        ),
      };
    }

    const sendEmailServiceResponse = await sendEmail(
      currentUser,
      compiledEmailServiceResponse.data.emailContent,
      compiledEmailServiceResponse.data.subject,
      receiverInstance.emailAddress
    );

    return {
      success: true,
      email: sendEmailServiceResponse,
    };
  } catch (error) {
    errorLog("Error in sendNotification:", error);
    return {
      success: false,
      error: ServerErrorResponse.internal(error),
    };
  }
};
