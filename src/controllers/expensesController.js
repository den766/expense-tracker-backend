import { loadExpenses } from "../persistence/expensesFile.js";
import { AppError } from "../errors/AppError.js";
export async function getExpenses (req, res) {
  let expenses = await loadExpenses();

  const categoryInfo = req.query.category;
  const searchInfo = req.query.search;
  const sortInfo = req.query.sort;
  const page = Number(req.query.page);
  const defualtLimit = 5;
  const limit = Number(req.query.limit) || defualtLimit;

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

  if (page) {
    const totalPages = Math.ceil(result.length / limit);

    if (page > totalPages) {
      throw new AppError("Page out of range", 404);
    }

    const start = (page - 1) * limit;

    const end = start + limit;

    result = result.slice(start, end);
  }

  res.status(200).json(result);
}