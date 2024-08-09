require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Note = require("./models/note");

const app = express();
app.use(express.json());
app.use(cors());
// To show static content
app.use(express.static("dist"));

morgan.token("type", function (req, res) {
  return JSON.stringify(req.body);
});
morgan.format(
  "kurusu",
  ":method :url :status :response-time ms - :res[content-length] :type"
);

app.use(morgan("kurusu"));

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
app.get("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  Note.findById(id).then((note) => res.json(note));
});

// ROUTE DELETE a note
app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  notes = notes.filter((note) => note.id !== id);
  res.status(204).end();
});

const generateId = () => {
  const maxId =
    notes.length > 0 ? Math.max(...notes.map((note) => Number(note.id))) : 0;

  return String(maxId + 1);
};

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

// const PORT = 10001;
// const PORT = process.env.PORT || 10001;
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
