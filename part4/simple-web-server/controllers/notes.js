// ************************************
// ************** ROUTES **************
// ************************************
const notesRouter = require("express").Router();
const Note = require("../models/note");
const { info } = require("../utils/logger");

notesRouter.get("/", async (req, res) => {
  await Note.find({}).then((notes) => res.json(notes));
});

// ROUTE GET a single note
notesRouter.get("/:id", async (req, res, next) => {
  const id = req.params.id;

  const note = await Note.findById(id);
  if (note) {
    res.json(note);
  } else {
    res.status(404).end();
  }
});

// ROUTE DELETE a note
notesRouter.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  await Note.findByIdAndDelete(id);
  res.status(204).end();
});

notesRouter.put("/:id", (req, res, next) => {
  const id = req.params.id;
  const { content, important } = req.body;

  Note.findByIdAndUpdate(
    id,
    { content, important },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedNote) => res.json(updatedNote))
    .catch((error) => next(error));
});

// ROUTE POST
notesRouter.post("/", async (req, res, next) => {
  const body = req.body;

  const note = new Note({
    content: body.content,
    important: Boolean(body.important) || false,
  });

  // await note
  //   .save()
  //   .then((savedNote) => {
  //     res.status(201).json(savedNote);
  //   })
  //   .catch((error) => next(error));

  const savedNote = await note.save();
  res.status(201).json(savedNote);
});

module.exports = notesRouter;
