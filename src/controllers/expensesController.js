import {findExpenses } from "../services/expensesServices.js";
export async function getExpenses(req, res) {
  const defualtLimit = 5;
  const expenseQuery  = {
    categoryInfo: req.query.category,
    searchInfo: req.query.search,
    sortInfo: req.query.sort,
    page: Number(req.query.page),
    limit: Number(req.query.limit) || defualtLimit,
  };

  const expenses  = await findExpenses(expenseQuery );

  res.status(200).json(expenses );
}
