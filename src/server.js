import express from "express";
import "dotenv/config";

const app = express();

// console.log(app);

const PORT = process.env.PORT;

// console.log(process.env);

app.get("/", (req, res) => {
  res.send("Expense Tracker Api Running");
});

app.get("/about", (req, res) => {
  res.send("Welcome to the About Page");
});

app.get("/health", (req, res) => {
  res.statusCode = 500;
  res.json({ status: "ok" });
});

app.get("/api/status", (req, res) => {
  res.json({
    status: "running",
    service: "expense-tracker-api",
  });
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log(process.env.PORT);
