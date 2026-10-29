import { expensesService } from "../services/expensesServices.js";
export async function getExpenses(req, res) {
  const defualtLimit = 5;
  const dataObj = {
    categoryInfo: req.query.category,
    searchInfo: req.query.search,
    sortInfo: req.query.sort,
    page: Number(req.query.page),
    limit: Number(req.query.limit) || defualtLimit,
  };

  const result = await expensesService(dataObj);

  res.status(200).json(result);
}
