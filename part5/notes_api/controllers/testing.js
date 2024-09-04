const router = require("express").Router();
const User = require("./../models/user");
const Note = require("./../models/note");

router.post("/reset", async (req, res) => {
  await Note.deleteMany({});
  await User.deleteMany({});

  res.status(204).end();
});

module.exports = router;
