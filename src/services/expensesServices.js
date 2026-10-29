import { AppError } from "../errors/AppError.js";
import { loadExpenses } from "../persistence/expensesFile.js";

export async function expensesService(dataObj) {
  let expenses = await loadExpenses();

  let result = expenses;

  if (dataObj.categoryInfo) {
    result = result.filter(
      (expense) => expense.category === dataObj.categoryInfo.toLowerCase(),
    );
  }

  if (dataObj.searchInfo) {
    result = result.filter((expense) =>
      expense.title.toLowerCase().includes(dataObj.searchInfo.toLowerCase()),
    );
  }

  if (dataObj.sortInfo === "amount_asc") {
    result = result.toSorted((a, b) => a.amount - b.amount);
  }

  if (dataObj.sortInfo === "amount_desc") {
    result = result.toSorted((a, b) => b.amount - a.amount);
  }

  if (dataObj.page) {
    const totalPages = Math.ceil(result.length / dataObj.limit);

    if (dataObj.page > totalPages) {
      throw new AppError("Page out of range", 404);
    }

    const start = (dataObj.page - 1) * dataObj.limit;

    const end = start + dataObj.limit;

    result = result.slice(start, end);
  }

  return result;
}
