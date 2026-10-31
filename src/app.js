import express from "express";
import fs from "node:fs/promises";
import cors from "cors";
import path from "node:path";
import crypto from "node:crypto";
import { requestLogger } from "./middlewares/requestLogger.js";
import { validationMiddleware } from "./middlewares/validationMiddleware.js";
import { notFoundMiddleware } from "./middlewares/notFoundMiddleware.js";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";
import { AppError } from "./errors/AppError.js";
import { loadExpenses } from "./persistence/expensesFile.js";
import expenseRouter from "./routes/expensesRouter.js";

const filePath = path.join("src", "data", "expenses.json");

async function saveExpenses(expense) {
  const data = JSON.stringify(expense);

  await fs.writeFile(filePath, data);
}


function expenseMiddleware(req, res, next) {
  // console.log("EXPENSE ROUTER MIDDLEWARE");
  next();
}

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);
expenseRouter.use(expenseMiddleware);
app.use("/api/expenses", expenseRouter);

  
expenseRouter.put("/:id", async (req, res) => {
  const expenses = await loadExpenses();
  const id = req.params.id;

  const matchingExpense = expenses.find((expense) => expense.id === id);

  if (!matchingExpense) {
    throw new AppError("Expense not found", 404);
  }

  const { title, amount, category } = req.body;

  matchingExpense.title = title;
  matchingExpense.amount = amount;
  matchingExpense.category = category;

  await saveExpenses(expenses);

  return res.status(200).json({
    matchingExpense,
    message: "Resource updated successfully",
  });
});

expenseRouter.delete("/:id", async (req, res) => {
  const expenses = await loadExpenses();

  const id = req.params.id;

  const removeExpense = expenses.filter((expense) => expense.id !== id);

  const requestedExpense = expenses.find((expense) => expense.id === id);

  if (!requestedExpense) {
    throw new AppError("Expense not found", 404);
  }

  await saveExpenses(removeExpense);

  res.status(204).send();
});

app.use(notFoundMiddleware);
app.use(globalErrorHandler);

export default app;
