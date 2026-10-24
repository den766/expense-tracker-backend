import fs from "node:fs/promises";
import path from "node:path";
const filePath = path.join("src", "data", "expenses.json");
export async function loadExpenses() {
  const data = await fs.readFile(filePath, "utf-8");

  return JSON.parse(data);
}

