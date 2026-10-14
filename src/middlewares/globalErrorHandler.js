export function globalErrorHandler(err, req, res, next) {
  const status =
    typeof err.statusCode === "number" &&
    err.statusCode >= 400 &&
    err.statusCode <= 599
      ? err.statusCode
      : 500;
  if (status === 500) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }

  return res.status(status).json({
    success: false,
    message: err.message,
  });
}
