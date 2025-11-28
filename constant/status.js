export const STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  PRECONDITION_REQUIRED: 428,
  SERVER_ERROR: 500,
};

export const STATUS_MESSAGES = {
  SUCCESS: "Success",
  FAILED: "Failed",
  ERROR: "An error occurred",
  SOMETHING_WENT_WRONG: "Something went wrong. Please try again!",
  SERVER_ERROR: "Internal server error.",
  CONFLICT: "Conflict detected. Check your request.",
  PRECONDITION_REQUIRED: "Precondition required. Missing necessary parameters.",
};

export const ACCOUNT_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};
