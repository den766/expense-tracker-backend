// Validation Middleware

export function validationMiddleware(req, res, next) {
  const userInputs = req.body;

  // title Validation

  if (!userInputs.hasOwnProperty("title")) {
    return res.status(400).json({
      message: "title is missing , please input the title",
    });
  }

  if (typeof userInputs.title !== "string") {
    return res.status(400).json({
      message: "title must be a string",
    });
  }

  if (userInputs.title.trim() === "") {
    return res.status(400).json({
      message: "title cant be empty",
    });
  }

  // Amount validation

  if (!userInputs.hasOwnProperty("amount")) {
  return res.status(400).json({
    message: "amount is missing, please input the amount",
  });
}

if (typeof userInputs.amount !== "number") {
  return res.status(400).json({
    message: "amount must be a number",
  });
}

if (userInputs.amount <= 0) {
  return res.status(400).json({
    message: "amount must be greater than zero",
  });
}

  next()

  
}
