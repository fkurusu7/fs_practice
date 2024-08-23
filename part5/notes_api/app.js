const config = require("./utils/config");
const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const notesRouter = require("./controllers/notes");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

// *******************************
// DATABASE Connection
// *******************************
mongoose.set("strictQuery", false);

logger.info("*******************************");
logger.info("*** Connecting to:", config.MONGODB_URI);
const ATLAS_STR = "MongoDB Atlas";

mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info(`** connected to ${ATLAS_STR}`))
  .catch((error) =>
    logger.info(`** error connecting to ${ATLAS_STR} - ${error.message}`)
  );

app.use(cors());
// To show static content
app.use(express.static("dist"));
app.use(express.json());
morgan.token("bodyToken", function (req, res) {
  return JSON.stringify(req.body);
});
morgan.format(
  "kurusu",
  ":method :url :status :response-time ms - :res[content-length] :bodyToken"
);
app.use(morgan("kurusu"));

// ROUTER Paths
app.use("/api/notes", notesRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(middleware.unknownEndpooint);
app.use(middleware.errorHandler);

module.exports = app;
