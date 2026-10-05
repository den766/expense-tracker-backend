// Validation Middleware

export function validationMiddleware(req, res, next) {
  const userInputs = req.body;
  userInputs.hasOwnProperty("amount") && userInputs.amount > 0
    ? next()
    : res.status(400).json({
        message: "Amount is missing , please input the amount",
      });
}
