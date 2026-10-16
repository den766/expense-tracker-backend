import { AppError } from "../errors/AppError.js";

export function queryValidationMiddleware(req, res, next) {
  const categoryInfo = req.query.category;
  const searchInfo = req.query.search;
  const sortInfo = req.query.sort;
  const page = Number(req.query.page);
  const defualtLimit = 5;
  const limit = Number(req.query.limit) || defualtLimit;

  if (categoryInfo === "") {
    throw new AppError("Invalid Filter Query", 400);
  }

  if (searchInfo === "") {
    throw new AppError("Missing Search Query", 400);
  }

  if (sortInfo !== undefined) {
    if (sortInfo === "") {
      throw new AppError("Missing Sort Value", 400);
    }

    if (sortInfo !== "amount_asc" && sortInfo !== "amount_desc") {
      throw new AppError("Invalid Sort Value", 400);
    }
  }

  if (req.query.page !== undefined) {
    const page = Number(req.query.page);

    if (!Number.isInteger(page) || page < 1) {
      throw new AppError("Page must be a positive integer", 400);
    }
  }

  if (req.query.limit !== undefined) {
    const limit = Number(req.query.limit);

    if (!Number.isInteger(limit) || limit < 1) {
      throw new AppError("Limit must be a positive integer", 400);
    }
  }

  next();
}
