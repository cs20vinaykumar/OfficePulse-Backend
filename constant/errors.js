export const ERROR_MESSAGES = {
  // Basic Authentication Errors
  EMAIL_REQUIRED: "Email address is required.",
  PASSWORD_REQUIRED: "Password is required.",
  INVALID_EMAIL: "The email address provided is not valid.",
  INVALID_PASSWORD:
    "Password must contain at least 8 characters, including uppercase, lowercase, digit & special char.",
  PASSWORDS_DO_NOT_MATCH: "Passwords do not match.",
  INVALID_LOGIN_CREDENTIALS: "Email or Password is incorrect.",
  USER_ALREADY_EXISTS: "User already exists.",
  SUPER_ADMIN_NOT_FOUND: "Super admin not found!",

  // JWT & Authorization
  INVALID_JWT: "Invalid token! Please login again.",
  EXPIRED_JWT: "Your token has expired! Please login again.",
  UNAUTHORIZE: "You are not authorized to perform this action.",
  ENDPOINT_ACCESS_DENIED: (userType) =>
    `Forbidden! Only ${userType}s are allowed.`,
  INACTIVE_ACCOUNT: "Your account is deactivated, please contact your admin.",
  BANNED: "You have violated our Privacy Policy & Terms.",

  // General Errors
  INVALID_INPUT: "Invalid input for isActive.",
  NOT_FOUND: "Not Found.",
  EMPTY_REQUIRED_FIELDS: "Required fields are empty.",
  ICON_NOT_FOUND: "Icon not found.",
  MISSING_REQUIRED_FIELDS: "Missing required fields.",
  INVALID_DATA: "Invalid data.",
  FIELD_REQUIRED: (fieldName) => `${fieldName} is required.`,
};

export const UNAUTHORIZE_MESSAGES = {
  USER_NOT_FOUND: "No user found with this email address.",
  USER_ALREADY_EXISTS: "User already exists with this email address.",
  NOT_LOGGED_IN: "You are not logged in.",
  INCORRECT_PASSWORD: "Incorrect password.",
  OTP_EXPIRED: "OTP has expired.",
  OTP_INVALID: "OTP is invalid.",
  INVALID_JWT: "Invalid token! Please login again.",
  EXPIRED_JWT: "Your token has expired! Please login again.",
  INVALID_EXPIRED: "Token is invalid or expired.",
  INACTIVE_ACCOUNT: "Your account is deactivated.",
  BANNED: "You have violated our Privacy Policy & Terms.",
  ENDPOINT_ACCESS_DENIED: (userType) =>
    `Forbidden! Only ${userType}s are allowed.`,
  UNAUTHORIZED_ACCESS: "Unauthorized access.",
  FORBIDDEN: "Access denied.",
};

export default { ERROR_MESSAGES, UNAUTHORIZE_MESSAGES };
