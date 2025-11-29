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

  // Country related errors
  COUNTRY_NAME_REQUIRED: "Country name is required.",
  COUNTRY_CODE_REQUIRED: "Country code is required.",
  COUNTRY_NAME_ALREADY_EXISTS: "Country name already exists.",
  COUNTRY_CODE_ALREADY_EXISTS: "Country code already exists.",
  COUNTRY_NOT_FOUND: "Country not found.",
  COUNTRIES_NOT_FOUND: "No countries found.",
  INVALID_INPUT: "Invalid input. Please provide valid data.",

  // Province related errors
  PROVINCE_NAME_REQUIRED: "Province name is required.",
  COUNTRY_ID_REQUIRED_FOR_PROVINCE: "Country ID is required for province.",
  PROVINCE_NAME_ALREADY_EXISTS: "Province name already exists.",
  PROVINCE_NOT_FOUND: "Province not found.",
  PROVINCES_NOT_FOUND: "No provinces found.",

  // City related errors
  CITY_NAME_REQUIRED: "City name is required.",
  COUNTRY_ID_REQUIRED_FOR_CITY: "Country ID is required for city.",
  PROVINCE_ID_REQUIRED_FOR_CITY: "Province ID is required for city.",
  CITY_NAME_ALREADY_EXISTS: "City name already exists.",
  CITY_NOT_FOUND: "City not found.",
  CITIES_NOT_FOUND: "No cities found.",

  // Packages related errors
  PACKAGE_NAME_REQUIRED: "Package name is required.",
  PACKAGE_PRICE_REQUIRED: "Package price is required.",
  PACKAGE_DURATION_REQUIRED: "Package duration is required.",
  PACKAGE_DAYS_REQUIRED: "Number of days is required for custom packages.",
  INVALID_PACKAGE_DURATION: "Invalid package duration.",
  INVALID_CUSTOM_PACKAGE_DAYS: "Custom package days must be greater than 0.",
  PACKAGE_ALREADY_EXISTS: "Package already exists.",
  PACKAGE_NOT_FOUND: "Package not found.",
  PACKAGES_NOT_FOUND: "No packages found.",

  // Email Template related errors
  EMAIL_TEMPLATE_ALREADY_EXISTS: "Email template of this type already exists.",
  EMAIL_TEMPLATE_NOT_FOUND: "Email template not found.",
  EMAIL_TEMPLATES_NOT_FOUND: "No email templates found.",
  EMAIL_TEMPLATE_SUBJECT_REQUIRED: "Email template subject is required.",
  EMAIL_TEMPLATE_CONTENT_REQUIRED: "Email template content is required.",
  EMAIL_TEMPLATE_TYPE_REQUIRED: "Email template type is required.",

  // Email Gateway related errors
  EMAIL_GATEWAY_ALREADY_EXIST: "Email gateway already exists.",
  EMAIL_GATEWAY_NOT_FOUND: "Email gateway not found.",
  EMPTY_REQUIRED_FIELDS: "Required fields are empty.",
  INVALID_EMAIL_GATEWAY_ID: "Invalid Email Gateway ID provided.",
  INVALID_SMTP_CREDENTIALS: "Invalid SMTP credentials provided.",
  EMAIL_GATEWAY_DEACTIVATED: "Email gateway is deactivated.",
  GATEWAY_ERROR: "Error occurred while processing email gateway.",

  // Company related errors
  COMPANY_NOT_FOUND: "Company not found.",
  INVALID_IS_ACTIVE: "Invalid input for isActive.",
  INVALID_PREVIOUS_DOCUMENTS: "Invalid input for previousDocuments.",
  INVALID_SUBSCRIPTION_PLAN: "Invalid subscription plan.",
  INVALID_EMAIL_OR_PHONE: "Invalid email or phone number.",
  DUPLICATE_COMPANY: "Company with this email already exists.",

  // General Errors
  INVALID_INPUT: "Invalid input for isActive.",
  NOT_FOUND: "Not Found.",
  EMPTY_REQUIRED_FIELDS: "Required fields are empty.",
  ICON_NOT_FOUND: "Icon not found.",
  MISSING_REQUIRED_FIELDS: "Missing required fields.",
  INVALID_DATA: "Invalid data.",
  FIELD_REQUIRED: (fieldName) => `${fieldName} is required.`,
  SERVER_ERROR: "Something went wrong on the server. Please try again later.",
  OTP_FAILED_TO_SENT: "Failed to send OTP. Please try again later.",
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
