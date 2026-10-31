import { AppError } from "../errors/AppError.js";
import { loadExpenses } from "../persistence/expensesFile.js";

export async function findExpenses(expenseQuery) {
  let expenses = await loadExpenses();

  let result = expenses;

  if (expenseQuery.categoryInfo) {
    result = result.filter(
      (expense) => expense.category === expenseQuery.categoryInfo.toLowerCase(),
    );
  }

  if (expenseQuery.searchInfo) {
    result = result.filter((expense) =>
      expense.title
        .toLowerCase()
        .includes(expenseQuery.searchInfo.toLowerCase()),
    );
  }

  if (expenseQuery.sortInfo === "amount_asc") {
    result = result.toSorted((a, b) => a.amount - b.amount);
  }

  if (expenseQuery.sortInfo === "amount_desc") {
    result = result.toSorted((a, b) => b.amount - a.amount);
  }

  if (expenseQuery.page) {
    const totalPages = Math.ceil(result.length / expenseQuery.limit);

    if (expenseQuery.page > totalPages) {
      throw new AppError("Page out of range", 404);
    }

    const start = (expenseQuery.page - 1) * expenseQuery.limit;

    const end = start + expenseQuery.limit;

    result = result.slice(start, end);
  }

  return result;
}

export async function findExpenseById(id) {
  const expenses = await loadExpenses();

  const result = expenses.find((expense) => expense.id === id);

  if (!result) {
    throw new AppError("Expense not found", 404);
  }

  return result;
}
