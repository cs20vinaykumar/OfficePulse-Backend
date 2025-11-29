import { ERROR_MESSAGES } from "../../constant/errors.js";
import { ROLES } from "../../constant/roles.js";
import { STATUS_CODE, STATUS_MESSAGES } from "../../constant/status.js";
import { SUCCESS_MESSAGES } from "../../constant/success.js";
import ServerSuccessResponse from "../../utils/classes/ServerSuccessResponse.js";
import ServerErrorResponse from "../../utils/classes/ServerErrorResponse.js";
import EmailGateway from "../../models/emailGateway.js";
import User from "../../models/user.js";
import { getUserById } from "../user/userService.js";

export const getUserEmailGateway = async (currentUser) => {
  try {
    const userEmailGateway = await EmailGateway.findOne({
      user: currentUser._id,
      createdBySuperAdmin:
        currentUser.role === ROLES.SUPER_ADMIN ? true : false,
    });

    if (!userEmailGateway) {
      return ServerErrorResponse.notFound(
        ERROR_MESSAGES.EMAIL_GATEWAY_NOT_FOUND
      );
    }

    if (!userEmailGateway.isActive) {
      return ServerErrorResponse.badRequest(
        ERROR_MESSAGES.EMAIL_GATEWAY_DEACTIVATED
      );
    }
    return ServerSuccessResponse.successResponse(
      true,
      STATUS_CODE.OK,
      STATUS_MESSAGES.SUCCESS,
      SUCCESS_MESSAGES.EMAIL_OPERATION_SUCCESSFUL,
      userEmailGateway
    );
  } catch (error) {
    errorLog("Get User Email Gateway Error: ", error);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(error));
  }
};

export const determineGatewayUser = async (user) => {
  let gatewayUser;

  if (user.role === ROLES.SUPER_ADMIN) {
    gatewayUser = user;
  } else if (user.role === ROLES.COMPANY) {
    gatewayUser = await User.findOne({ role: ROLES.SUPER_ADMIN });
  } else {
    gatewayUser = await getUserById(user.company);
  }

  if (!gatewayUser) {
    throw new Error("No gateway user found for this role");
  }

  return gatewayUser;
};
