import express from "express";
import "dotenv/config";
import cors from "cors";

let expenses = [
  {
    id: 1,
    title: "Groceries",
    amount: 1850,
    category: "Food",
    createdAt: "2026-02-03T08:15:00.000Z",
  },
  {
    id: 2,
    title: "Internet Bill",
    amount: 150,
    category: "Utilities",
    createdAt: "2026-02-05T14:30:00.000Z",
  },
  {
    id: 3,
    title: "Movie Ticket",
    amount: 350,
    category: "Entertainment",
    createdAt: "2026-02-12T18:45:00.000Z",
  },
];

const app = express();

const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Expense Tracker Backend Running");
});

app.get("/expenses", (req, res) => {
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

app.post("/expenses", (req, res) => {
  const newExpense = {
    ...req.body,
    id: expenses.length + 1,
  };

  expenses.push(newExpense);

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
