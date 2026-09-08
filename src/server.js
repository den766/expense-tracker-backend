import express from "express";
import fs from "node:fs/promises";
import "dotenv/config";
import cors from "cors";
import path from "node:path";

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
  res.status(200).send(expenses);
});

app.get("/expenses/:id", (req, res) => {
  const id = req.params.id;

  const result = expenses.find((expense) => expense.id === Number(id));

  if (!result) {
    return res.status(404).json({ message: "Expense not found" });
  }

  res.status(200).json({
    result,
    message: "Succesfully retrieved the resource",
  });
});

app.post("/expenses", async (req, res) => {
  const newExpense = {
    ...req.body,
    id: expenses.length + 1,
  };

  expenses.push(newExpense);

  await saveExpenses(expenses);

  res.status(201).json({
    newExpense,
    message: "expense created Sucessfully",
  });
});

app.put("/expenses/:id", (req, res) => {
  const id = Number(req.params.id);

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

  

  return res.status(200).json({
    matchingExpense,
    message: "Resource updated successfully",
  });
});

app.delete("/expenses/:id", (req, res) => {
  const id = req.params.id;

  const removeExpense = expenses.filter((expense) => expense.id !== Number(id));

  const requestedExpense = expenses.find(
    (expense) => expense.id === Number(id),
  );

  if (!requestedExpense) {
    return res.status(404).json({
      message: "Requested Resource coudnt find",
    });
  }

  expenses = removeExpense;

  res.status(204).send();
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
