const express = require("express");
const app = express();
app.use(express.json());

let notes = [
  { id: "1", content: "HTML is easy", important: true },
  { id: "2", content: "Browser can execute only JavaScript", important: false },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello, Express!</h1>");
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

// ROUTE GET a single note
app.get("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  const note = notes.find((note) => note.id === id);

  if (note) {
    res.json(note);
  } else {
    res.status(404).end();
  }
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

  const note = {
    id: generateId(),
    content: body.content,
    important: Boolean(body.important) || false,
  };

  notes = notes.concat(note);

  res.json(note);
});

const PORT = 10001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
