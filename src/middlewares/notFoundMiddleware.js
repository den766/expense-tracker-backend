// 404 middleWare
import { AppError } from "../errors/AppError.js";

export function notFoundMiddleware(req, res, next) {
  console.log(`404 middleWare is running for a invalid request${req}`);
  throw new AppError(
    `There is no matching route for ${req.method} ${req.originalUrl}`,
    404,
  );
}
