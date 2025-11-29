import { ERROR_MESSAGES } from "../../constant/errors.js";
import { SUCCESS_MESSAGES } from "../../constant/success.js";
import { STATUS_CODE, STATUS_MESSAGES } from "../../constant/status.js";
import EmailTemplate from "../../models/emailTemplate.js";
import ServerErrorResponse from "../../utils/classes/ServerErrorResponse.js";
import ServerSuccessResponse from "../../utils/classes/ServerSuccessResponse.js";
import { validateRequiredFields } from "../../utils/basic.js";
import { errorLog } from "../../utils/logger.js";

export const createEmailTemplate = async (req, res) => {
  const currentUser = req.user;
  const { subject, content, type } = req.body;

  const requiredFields = ["subject", "content", "type"];
  const validationResponse = await validateRequiredFields(
    req.body,
    requiredFields
  );

  if (!validationResponse.success) {
    return res.status(validationResponse.statusCode).json(validationResponse);
  }

  try {
    const existingTemplate = await EmailTemplate.findOne({ type });
    if (existingTemplate) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(
            ERROR_MESSAGES.EMAIL_TEMPLATE_ALREADY_EXISTS
          )
        );
    }

    const newTemplate = await EmailTemplate.create({
      subject,
      content,
      type,
      createdBySuperAdmin: true,
      user: currentUser._id,
    });

    return res
      .status(STATUS_CODE.CREATED)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_CODE.CREATED,
          STATUS_MESSAGES.SUCCESS,
          SUCCESS_MESSAGES.CREATED,
          newTemplate
        )
      );
  } catch (error) {
    errorLog("Error in createEmailTemplate:", error.stack);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(ERROR_MESSAGES.SERVER_ERROR));
  }
};

export const getEmailTemplate = async (req, res) => {
  try {
    const templates = await EmailTemplate.find();

    if (!templates || templates.length === 0) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(
          ServerErrorResponse.notFound(ERROR_MESSAGES.EMAIL_TEMPLATES_NOT_FOUND)
        );
    }

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_CODE.OK,
          STATUS_MESSAGES.SUCCESS,
          SUCCESS_MESSAGES.RETRIEVED,
          templates
        )
      );
  } catch (error) {
    errorLog("Error in getEmailTemplate:", error.stack);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(ERROR_MESSAGES.SERVER_ERROR));
  }
};

export const updateEmailTemplate = async (req, res) => {
  const { templateId } = req.params;
  const { subject, content, type } = req.body;

  try {
    const existingTemplate = await EmailTemplate.findById(templateId);
    if (!existingTemplate) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(
          ServerErrorResponse.notFound(ERROR_MESSAGES.EMAIL_TEMPLATE_NOT_FOUND)
        );
    }

    const updatedTemplate = await EmailTemplate.findByIdAndUpdate(
      templateId,
      { subject, content, type },
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
          updatedTemplate
        )
      );
  } catch (error) {
    errorLog("Error in updateEmailTemplate:", error.stack);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(ERROR_MESSAGES.SERVER_ERROR));
  }
};

export const deleteEmailTemplate = async (req, res) => {
  const { templateId } = req.params;

  try {
    const existingTemplate = await EmailTemplate.findById(templateId);
    if (!existingTemplate) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(
          ServerErrorResponse.notFound(ERROR_MESSAGES.EMAIL_TEMPLATE_NOT_FOUND)
        );
    }

    const deletedTemplate = await EmailTemplate.findByIdAndDelete(templateId);

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_CODE.OK,
          STATUS_MESSAGES.SUCCESS,
          SUCCESS_MESSAGES.DELETED,
          deletedTemplate
        )
      );
  } catch (error) {
    errorLog("Error in deleteEmailTemplate:", error.stack);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(ERROR_MESSAGES.SERVER_ERROR));
  }
};
