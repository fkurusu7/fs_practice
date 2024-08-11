// ************************************
// ************** ROUTES **************
// ************************************
const notesRouter = require("express").Router();
const Note = require("../models/note");

notesRouter.get("/", (request, response) => {
  Note.find({}).then((notes) => response.json(notes));
});

// ROUTE GET a single note
notesRouter.get("/:id", (req, res, next) => {
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
notesRouter.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  Note.findByIdAndDelete(id)
    .then((result) => res.status(204).end())
    .catch((error) => next(error));
});

notesRouter.put("/:id", (req, res, next) => {
  const id = req.params.id;
  const { content, important } = req.body;

  // const note = {
  //   content: body.content,
  //   important: body.important,
  // };

  Note.findByIdAndUpdate(
    id,
    { content, important },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedNote) => res.json(updatedNote))
    .catch((error) => next(error));
});

// ROUTE POST
notesRouter.post("/", (req, res, next) => {
  const body = req.body;

  const note = new Note({
    content: body.content,
    important: Boolean(body.important) || false,
  });

  note
    .save()
    .then((savedNote) => {
      res.json(savedNote);
    })
    .catch((error) => next(error));
});

module.exports = notesRouter;
