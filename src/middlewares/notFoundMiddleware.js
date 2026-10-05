// 404 middleWare

export function notFoundMiddleware (req, res, next) {
  console.log(`404 middleWare is running for a invalid request${req}`);
  res.status(404).json({
    message: "There is no matching route for these Request",
  });
}