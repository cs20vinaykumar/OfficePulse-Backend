import { ERROR_MESSAGES, UNAUTHORIZE_MESSAGES } from "../../constant/errors.js";
import { STATUS_CODE, STATUS_MESSAGES } from "../../constant/status.js";
import { SUCCESS_MESSAGES } from "../../constant/success.js";
import User from "../../models/user.js";
import ServerErrorResponse from "../../utils/classes/ServerErrorResponse.js";
import { errorLog } from "../../utils/logger.js";

export const getUserByEmail = async (email) => {
  var serviceResponse = {};

  const exsitingUser = await User.findOne({ email });
  serviceResponse = {
    success: exsitingUser ? true : false,
    data: exsitingUser,
    successMessage: exsitingUser ? "user already exists" : "good to go!",
  };

  return serviceResponse;
};

export const getUserById = async (id) => {
  const existingUser = await User.findById(id);
  if (!existingUser) {
    ServerErrorResponse.notFound(UNAUTHORIZE_MESSAGES.USER_NOT_FOUND);
  }
  return existingUser;
};

export const getUserDataForTemplate = async (
  receiverInstance,
  extraData = {}
) => {
  try {
    const user = await User.findById(receiverInstance._id).populate("company");
    if (!user)
      return ServerErrorResponse.notFound(ERROR_MESSAGES.USER_NOT_FOUND);

    const userPackage = user.packages
      ? await packageModel.findById(user.packages)
      : null;

    const companyName =
      user.role === "COMPANY"
        ? user.companyName || ""
        : user.company?.companyName || "";

    const templateData = {
      id: user._id,
      fullName: user.fullName || companyName,
      email: user.emailAddress,
      phoneNo: user.phoneNo,
      city: user.city,
      package: userPackage?.packageName || "",
      currentDate: new Date().toLocaleDateString(),
      password: extraData?.password || "",
      otp: extraData?.otp || "",
      companyName,
      ...extraData,
    };

    return ServerSuccessResponse.successResponse(
      true,
      STATUS_CODE.OK,
      STATUS_MESSAGES.SUCCESS,
      SUCCESS_MESSAGES.CREATED,
      templateData
    );
  } catch (error) {
    errorLog("Error in getUserDataForTemplate:", error);
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(error));
  }
};
