import jwt from "jsonwebtoken";
import { verifyAccessToken } from "../services/token.service.js";
import logger from "../config/logger.js";

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    logger.warn("Access attempt without token");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn(`Invalid token: ${error.message}`);
    return res.status(401).json({ message: "Invalid token" });
  }
};
