import {findExpenses , findExpenseById } from "../services/expensesServices.js";

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

export async function getExpenseById(req, res) {

  const id = req.params.id;

  const expense = await findExpenseById(id);

  res.status(200).json({
    expense,
    message: "Succesfully retrieved the resource",
  });
  
} 
