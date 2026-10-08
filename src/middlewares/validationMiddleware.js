// Validation Middleware

export function validationMiddleware(req, res, next) {
  const userInputs = req.body;

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

  next()


}
