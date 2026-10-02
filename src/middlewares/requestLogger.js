export function requestLogger(req, res, next) {
  const requestTime = Date.now();
  console.log(
    `[LOG] ${req.method} request made to ${req.url} Request received at: ${requestTime}`,
  );
  next();
}
