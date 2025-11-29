import jwt from "jsonwebtoken";

export const generateToken = (
  tokenPayload,
  secret = process.env.JWT_SECRET,
  expiresIn = "7d"
) => {
  return jwt.sign(tokenPayload, secret, { expiresIn });
};
