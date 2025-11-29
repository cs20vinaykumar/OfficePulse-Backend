import { STATUS_CODE, STATUS_MESSAGES } from "../../constant/status.js";
import { SUCCESS_MESSAGES } from "../../constant/success.js";
import ServerErrorResponse from "../../utils/classes/ServerErrorResponse.js";
import serverSuccessResponse from "../../utils/classes/ServerSuccessResponse.js";
import EmailTemplate from "../../models/emailTemplate.js";
import { getUserDataForTemplate } from "../user/userService.js";
import Handlebars from "handlebars";
import { ERROR_MESSAGES } from "../../constant/errors.js";

export const getEmailTemplateByType = async (currentUser, type) => {
  try {
    const emailTemplate = await EmailTemplate.findOne({
      user: currentUser,
      type: type,
    });

    if (!emailTemplate) {
      return ServerErrorResponse.customError(
        false,
        STATUS_CODE.BAD_REQUEST,
        STATUS_MESSAGES.FAILED,
        ERROR_MESSAGES.EMAIL_TEMPLATE_NOT_FOUND,
        null
      );
    }

    return serverSuccessResponse.successResponse(
      true,
      STATUS_CODE.OK,
      STATUS_MESSAGES.SUCCESS,
      SUCCESS_MESSAGES.RETRIEVED,
      emailTemplate
    );
  } catch (error) {
    return ServerErrorResponse.internal(error);
  }
};

export const compileAndGenerateEmailContent = async (
  currentUser,
  type,
  receiverInstance,
  extraData
) => {
  try {
    const emailTemplateResponse = await getEmailTemplateByType(
      currentUser,
      type
    );

    if (emailTemplateResponse.success) {
      const emailTemplate = emailTemplateResponse.data;
      const template = Handlebars.compile(emailTemplate.content);

      const userDataResponse = await getUserDataForTemplate(
        receiverInstance,
        extraData
      );

      if (userDataResponse.success) {
        const userData = userDataResponse.data;
        const compiledMessage = template(userData);

        return serverSuccessResponse.successResponse(
          true,
          STATUS_CODE.OK,
          STATUS_MESSAGES.SUCCESS,
          SUCCESS_MESSAGES.RETRIEVED,
          { emailContent: compiledMessage, subject: emailTemplate.subject }
        );
      }
    }
  } catch (error) {
    return ServerErrorResponse.internal(error);
  }
};
