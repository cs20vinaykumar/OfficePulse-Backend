import { STATUS_CODE, STATUS_MESSAGES } from "../../constant/status.js";

class ServerSuccessResponse {
  constructor(success, statusCode, statusMessage, message, data) {
    (this.success = success),
      (this.statusCode = statusCode),
      (this.statusMessage = statusMessage),
      (this.message = message),
      (this.data = data);
  }
  static successResponse(success, code, statusMessage, message, data) {
    return new ServerSuccessResponse(
      success,
      code,
      statusMessage,
      message,
      data
    );
  }
  static creationResponse(message, data) {
    return new ServerSuccessResponse(
      true,
      STATUS_CODE.CREATED,
      STATUS_MESSAGES.SUCCESS,
      message,
      data
    );
  }
}

export default ServerSuccessResponse;
