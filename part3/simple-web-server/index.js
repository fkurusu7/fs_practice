require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Note = require("./models/note");

const app = express();

// *************************************
// ************ MIDDLEWAREs ************
// *************************************
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
app.use(cors());

// *************************************
// *********** ROUTES ***********
// *************************************
app.get("/", (request, response) => {
  response.send("<h1>Hello, Express!</h1>");
});

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => response.json(notes));
});

// ROUTE GET a single note
app.get("/api/notes/:id", (req, res, next) => {
  const id = req.params.id;
  Note.findById(id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// ROUTE DELETE a note
app.delete("/api/notes/:id", (req, res, next) => {
  const id = req.params.id;
  Note.findByIdAndDelete(id)
    .then((result) => res.status(204).end())
    .catch((error) => next(error));
});

app.put("/api/notes/:id", (req, res, next) => {
  const id = req.params.id;
  const body = req.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(id, note, { new: true })
    .then((updatedNote) => res.json(updatedNote))
    .catch((error) => next(error));
});

// ROUTE POST
app.post("/api/notes", (req, res) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({ error: "content missing" });
  }

  const note = new Note({
    content: body.content,
    important: Boolean(body.important) || false,
  });

  note.save().then((savedNote) => {
    res.json(savedNote);
  });
});

// Middleware used for catching requests made to non-existent routes
const unknownEndpooint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpooint);

const errorHandler = (error, req, res, next) => {
  console.log(error.message);
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }
  next(error);
};
app.use(errorHandler);

// const PORT = 10001;
// const PORT = process.env.PORT || 10001;
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
