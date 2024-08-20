// ************************************
// ************** ROUTES **************
// ************************************
const jwt = require("jsonwebtoken");
const notesRouter = require("express").Router();
const Note = require("../models/note");
const User = require("./../models/user");
const { info } = require("../utils/logger");

const getTokenFrom = (req) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

notesRouter.get("/", async (req, res, next) => {
  // await Note.find({}).then((notes) => res.json(notes));
  const notes = await Note.find({}).populate("user", { username: 1, name: 1 });
  try {
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
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
// :userId is passed to get A User
notesRouter.post("/", async (req, res, next) => {
  const body = req.body;
  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: "invalid token" });
  }
  const user = await User.findById(decodedToken.id);

  const note = new Note({
    content: body.content,
    important: Boolean(body.important) || false,
    user: user.id,
  });

  const savedNote = await note.save();
  user.notes = user.notes.concat(savedNote._id);
  await user.save();

  res.status(201).json(savedNote);
});

module.exports = notesRouter;
