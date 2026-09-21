import express from "express";
import fs from "node:fs/promises";
import "dotenv/config";
import cors from "cors";
import path from "node:path";
import crypto from "node:crypto";

const filePath = path.join("src", "data", "expenses.json");

async function loadExpenses() {
  const data = await fs.readFile(filePath, "utf-8");

  return JSON.parse(data);
}

async function saveExpenses(expense) {
  const data = JSON.stringify(expense);

  await fs.writeFile(filePath, data);
}

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Expense Tracker Backend Running");
});

app.get("/expenses", async (req, res) => {
  let expenses = await loadExpenses();

  const categoryInfo = req.query.category;
  const searchInfo = req.query.search;
  const sortInfo = req.query.sort;

  if (categoryInfo === "") {
    return res.status(404).json({
      message: "Invalid Filter Query",
    });
  }

  if (searchInfo === "") {
    return res.status(404).json({
      message: "Missing Search Query",
    });
  }

  if (sortInfo !== undefined) {
    if (sortInfo === "") {
      return res.status(400).json({
        message: "Missing Sort Value",
      });
    }

    if (sortInfo !== "amount_asc" && sortInfo !== "amount_desc") {
      return res.status(400).json({
        message: "Invalid Sort Value",
      });
    }
  }

  let result = expenses;

  if (categoryInfo) {
    result = result.filter(
      (expense) => expense.category === categoryInfo.toLowerCase(),
    );
  }

  if (searchInfo) {
    result = result.filter((expense) =>
      expense.title.toLowerCase().includes(searchInfo.toLowerCase()),
    );
  }

  if (sortInfo === "amount_asc") {
    result = result.toSorted((a, b) => a.amount - b.amount);
  }

  if (sortInfo === "amount_desc") {
    result = result.toSorted((a, b) => b.amount - a.amount);
  }

  res.status(200).json(result);
});

app.get("/expenses/:id", async (req, res) => {
  const expenses = await loadExpenses();
  const id = req.params.id;

  const result = expenses.find((expense) => expense.id === id);

  if (!result) {
    return res.status(404).json({ message: "Expense not found" });
  }

  res.status(200).json({
    result,
    message: "Succesfully retrieved the resource",
  });
});

app.post("/expenses", async (req, res) => {
  const expenses = await loadExpenses();
  const newExpense = {
    ...req.body,
    id: crypto.randomUUID(),
  };

  expenses.push(newExpense);

  await saveExpenses(expenses);

  res.status(201).json({
    newExpense,
    message: "expense created Sucessfully",
  });
});

app.put("/expenses/:id", async (req, res) => {
  const expenses = await loadExpenses();
  const id = req.params.id;

  const matchingExpense = expenses.find((expense) => expense.id === id);

  if (!matchingExpense) {
    return res.status(404).json({
      message: "Requested resource couldn't be found",
    });
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

app.delete("/expenses/:id", async (req, res) => {
  const expenses = await loadExpenses();

  const id = req.params.id;

  const removeExpense = expenses.filter((expense) => expense.id !== id);

  const requestedExpense = expenses.find((expense) => expense.id === id);

  if (!requestedExpense) {
    return res.status(404).json({
      message: "Requested Resource coudnt find",
    });
  }

  await saveExpenses(removeExpense);

  res.status(204).send();
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
