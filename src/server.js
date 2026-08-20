import express from "express";
import "dotenv/config";

const expenses = [
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

app.get("/", (req, res) => {
  res.send("Expense Tracker Backend Running");
});

app.get("/expenses", (req, res) => {
  res.json(expenses);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
