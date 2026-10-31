import express from "express";
import {
  getExpenses,
  getExpenseById,
  createExpenseController,
} from "../controllers/expensesController.js";
import { queryValidationMiddleware } from "../middlewares/queryValidationMiddleware.js";

import { validationMiddleware } from "../middlewares/validationMiddleware.js";
const expenseRouter = express.Router();

expenseRouter.get("/", queryValidationMiddleware, getExpenses);

expenseRouter.get("/:id", getExpenseById);

expenseRouter.post("/", validationMiddleware, createExpenseController);

export default expenseRouter;
