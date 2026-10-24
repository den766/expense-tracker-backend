import express from "express";
import fs from "node:fs/promises";
import "dotenv/config";
import cors from "cors";
import path from "node:path";
import crypto from "node:crypto";
import { requestLogger } from "./middlewares/requestLogger.js";
import { validationMiddleware } from "./middlewares/validationMiddleware.js";
import { queryValidationMiddleware } from "./middlewares/queryValidationMiddleware.js";
import { notFoundMiddleware } from "./middlewares/notFoundMiddleware.js";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";
import { AppError } from "./errors/AppError.js";
import { getExpenses } from "./controllers/expensesController.js";
import { loadExpenses } from "./persistence/expensesFile.js";

const filePath = path.join("src", "data", "expenses.json");

// async function loadExpenses() {
//   const data = await fs.readFile(filePath, "utf-8");

//   return JSON.parse(data);
// }

async function saveExpenses(expense) {
  const data = JSON.stringify(expense);

  await fs.writeFile(filePath, data);
}

const expenseRouter = express.Router();

// Router Level Middleware

function expenseMiddleware(req, res, next) {
  // console.log("EXPENSE ROUTER MIDDLEWARE");
  next();
}

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(requestLogger);
expenseRouter.use(expenseMiddleware);
app.use("/api/expenses", expenseRouter);

expenseRouter.get("/", queryValidationMiddleware,getExpenses );

expenseRouter.get("/:id", async (req, res) => {
  const expenses = await loadExpenses();
  const id = req.params.id;

  const result = expenses.find((expense) => expense.id === id);

  if (!result) {
    throw new AppError("Expense not found", 404);
  }

  res.status(200).json({
    result,
    message: "Succesfully retrieved the resource",
  });
});

expenseRouter.post("/", validationMiddleware, async (req, res) => {
  // console.log("postrouteExecuted");
  const expenses = await loadExpenses();
  const newExpense = {
    id: crypto.randomUUID(),
    title: req.body.title,
    amount: req.body.amount,
    category: req.body.category,
    createdAt: req.body.createdAt,
  };

  expenses.push(newExpense);

  await saveExpenses(expenses);

  res.status(201).json({
    newExpense,
    message: "expense created Sucessfully",
  });
});

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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
