import express from "express";
import { getExpenses, getExpenseById } from "../controllers/expensesController.js";
import {queryValidationMiddleware} from "../middlewares/queryValidationMiddleware.js"
const expenseRouter = express.Router();

expenseRouter.get("/", queryValidationMiddleware, getExpenses);

expenseRouter.get("/:id", getExpenseById);

export default expenseRouter;
