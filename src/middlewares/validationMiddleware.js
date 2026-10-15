import { AppError } from "../errors/AppError.js";

// Validation Middleware

export function validationMiddleware(req, res, next) {
  const userInputs = req.body;

  // title Validation

  if (!userInputs.hasOwnProperty("title")) {
    throw new AppError("title is missing , please input the title", 400);
  }

  if (typeof userInputs.title !== "string") {
    throw new AppError("title must be a string", 400);
  }

  if (userInputs.title.trim() === "") {
    throw new AppError("title cant be empty", 400);
  }

  // Amount validation

  if (!userInputs.hasOwnProperty("amount")) {
    throw new AppError("amount is missing, please input the amount", 400);
  }

  if (typeof userInputs.amount !== "number") {
    throw new AppError("amount must be a number", 400);
  }

  if (userInputs.amount <= 0) {
    throw new AppError("amount must be greater than zero", 400);
  }

  // Category Validation

  if (!userInputs.hasOwnProperty("category")) {
    throw new AppError("category is missing, please input the category", 400);
  }

  if (typeof userInputs.category !== "string") {
    throw new AppError("category must be a string", 400);
  }

  if (userInputs.category.trim() === "") {
    throw new AppError("category can't be empty", 400);
  }

  next();
}
