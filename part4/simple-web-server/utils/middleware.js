// Middleware used for catching requests made to non-existent routes
const unknownEndpooint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, req, res, next) => {
  console.log("MSG =====> ", error.message);
  console.log("NAME ====> ", error.name);
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  } else if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    return res.status(400).json({ error: "expected `username` to be unique" });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "token invalid" });
  } else if (error.name === "TokenExpiredError") {
    return res.status(401).json({ error: "token expired" });
  } else {
    // Handle any other errors
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
  next(error);
};

module.exports = { unknownEndpooint, errorHandler };
