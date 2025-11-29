import { ROLES } from "../../constant/roles.js";
import { STATUS_CODE, STATUS_MESSAGES } from "../../constant/status.js";
import EmailGateway from "../../models/emailGateway.js";
import { ERROR_MESSAGES } from "../../constant/errors.js";
import ServerErrorResponse from "../../utils/classes/ServerErrorResponse.js";
import serverSuccessResponse from "../../utils/classes/ServerSuccessResponse.js";
import { SUCCESS_MESSAGES } from "../../constant/success.js";
import nodemailer from "nodemailer";
import { sendEmail } from "../../utils/emailSender.js";
import { testEmailTemplateContent } from "../../utils/template/template.js";
import { validateRequiredFields } from "../../utils/basic.js";
import { errorLog } from "../../utils/logger.js";

export const createEmailGateway = async (req, res) => {
  try {
    const currentUser = req.user;

    const requiredFields = [
      "smtpServerHost",
      "smtpServerPort",
      "smtpUsername",
      "smtpPassword",
    ];

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

    if (currentUser === ROLES.SUPER_ADMIN) {
      const superAdminEmailGatewayExists = await EmailGateway.exists({
        createdBySuperAdmin: true,
      });
      if (superAdminEmailGatewayExists) {
        return res
          .status(STATUS_CODE.BAD_REQUEST)
          .json(
            ServerErrorResponse.badRequest(
              ERROR_MESSAGES.EMAIL_GATEWAY_ALREADY_EXIST
            )
          );
      }
    }

    const emailGatewayExists = await EmailGateway.findOne({
      user: currentUser,
    });
    if (emailGatewayExists) {
      return res
        .status(STATUS_CODE.CONFLICT)
        .json(
          ServerErrorResponse.customError(
            false,
            STATUS_MESSAGES.PRECONDITION_REQUIRED,
            STATUS_CODE.CONFLICT,
            ERROR_MESSAGES.EMAIL_GATEWAY_ALREADY_EXIST
          )
        );
    }

    const {
      fromName,
      replyToEmailAddress,
      useServerSmtp,
      smtpServerHost,
      smtpServerPort,
      smtpSecurity,
      useSmtpAuthentication,
      smtpUsername,
      smtpPassword,
    } = req.body;

    const emailGateway = new EmailGateway({
      fromName,
      replyToEmailAddress,
      useServerSmtp,
      smtpServerHost,
      smtpServerPort,
      smtpSecurity,
      useSmtpAuthentication,
      smtpUsername,
      smtpPassword,
      user: currentUser._id,
      createdBySuperAdmin: currentUser.role === ROLES.SUPER_ADMIN,
    });

    await emailGateway.save();

    return res
      .status(STATUS_CODE.CREATED)
      .json(
        serverSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.CREATED,
          SUCCESS_MESSAGES.CREATED,
          emailGateway
        )
      );
  } catch (error) {
    errorLog("Create Email Gateway Error: ", error);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(error));
  }
};

export const verifyEmailGateway = async (req, res) => {
  const requiredFields = [
    "smtpServerHost",
    "smtpServerPort",
    "smtpUsername",
    "smtpPassword",
  ];

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

  const {
    smtpServerHost,
    smtpServerPort,
    smtpSecurity,
    smtpUsername,
    smtpPassword,
  } = req.body;

  const transporter = nodemailer.createTransport({
    host: smtpServerHost,
    port: smtpServerPort,
    secure: smtpSecurity,
    auth: {
      user: smtpUsername,
      pass: smtpPassword,
    },
  });

  try {
    const transportResponse = transporter.verify((error, success) => {
      if (error) {
        console.log("error: ", error);
        var { code, responseCode, command } = error;
        if (
          code === "EAUTH" &&
          responseCode === 535 &&
          command === "AUTH PLAIN"
        ) {
          res.send("SMTP server credentials are wrong!");
        } else {
          res.send(error);
        }
      } else {
        console.log("success: ", success);
        res
          .status(200)
          .json(
            serverSuccessResponse.successResponse(
              true,
              STATUS_CODE.OK,
              STATUS_MESSAGES.SUCCESS,
              SUCCESS_MESSAGES.SMTP_CREDENTIALS_VERIFIED,
              transportResponse
            )
          );
      }
    });
  } catch (error) {
    errorLog("Verify Email Gateway Error: ", error);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(error));
  }
};

export const updateEmailGateway = async (req, res) => {
  try {
    const currentUser = req.user;
    const { emailGatewayId } = req.params;

    const requiredFields = [
      "smtpServerHost",
      "smtpServerPort",
      "smtpUsername",
      "smtpPassword",
    ];
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

    const emailGatewayExists = await EmailGateway.findOne({
      _id: emailGatewayId,
      user: currentUser._id,
    });

    if (!emailGatewayExists) {
      console.log(
        `Email gateway not found for ID: ${emailGatewayId} and User ID: ${currentUser._id}`
      );
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(
          ServerErrorResponse.notFound(ERROR_MESSAGES.EMAIL_GATEWAY_NOT_FOUND)
        );
    }

    const {
      fromName,
      replyToEmailAddress,
      useServerSmtp,
      smtpServerHost,
      smtpServerPort,
      smtpSecurity,
      useSmtpAuthentication,
      smtpUsername,
      smtpPassword,
      isActive,
    } = req.body;

    const whereToUpdate = { _id: emailGatewayExists._id };

    const updateData = {
      fromName,
      replyToEmailAddress,
      useServerSmtp,
      smtpServerHost,
      smtpServerPort,
      smtpSecurity,
      useSmtpAuthentication,
      smtpUsername,
      smtpPassword,
      user: currentUser._id,
      isActive,
      createdBySuperAdmin: currentUser.role === ROLES.SUPER_ADMIN,
    };

    const updateEmailGateway = await EmailGateway.findByIdAndUpdate(
      whereToUpdate._id,
      updateData,
      {
        new: true,
      }
    );

    return res
      .status(STATUS_CODE.OK)
      .json(
        serverSuccessResponse.successResponse(
          true,
          STATUS_CODE.OK,
          STATUS_MESSAGES.SUCCESS,
          SUCCESS_MESSAGES.UPDATED,
          updateEmailGateway
        )
      );
  } catch (error) {
    errorLog("Update Email Gateway Error: ", error);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(error));
  }
};

export const getEmailGatewayBYId = async (req, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      return res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.UNAUTHORIZE));
    }

    const emailGateway = await EmailGateway.findOne({
      user: currentUser._id,
    }).populate({
      path: "user",
      select: "id fullName emailAddress",
    });

    if (!emailGateway) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(
          ServerErrorResponse.notFound(ERROR_MESSAGES.EMAIL_GATEWAY_NOT_FOUND)
        );
    }

    return res
      .status(STATUS_CODE.OK)
      .json(
        serverSuccessResponse.successResponse(
          true,
          STATUS_CODE.OK,
          STATUS_MESSAGES.SUCCESS,
          SUCCESS_MESSAGES.GET,
          emailGateway
        )
      );
  } catch (error) {
    errorLog("Get Email Gateway By ID Error: ", error);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(error));
  }
};

export const testEmailGateway = async (req, res) => {
  try {
    const currentUser = req.user;

    const { sendEmailTo } = req.body;

    if (!sendEmailTo) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS)
        );
    }

    const sendEmailServiceResponse = await sendEmail(
      currentUser,
      testEmailTemplateContent,
      "Test Email",
      sendEmailTo
    );

    console.log("sendEmailServiceResponse: ", sendEmailServiceResponse);

    return res
      .status(STATUS_CODE.OK)
      .json(
        serverSuccessResponse.successResponse(
          true,
          STATUS_CODE.OK,
          STATUS_MESSAGES.SUCCESS,
          SUCCESS_MESSAGES.EMAIL_SENT_SUCCESSFULLY,
          null
        )
      );
  } catch (error) {
    errorLog("Test Email Gateway Error: ", error);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(error));
  }
};
