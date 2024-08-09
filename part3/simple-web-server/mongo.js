const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://admin:${password}@cluster0-fs.qnjdn.mongodb.net/noteApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

// SAVE --> insert
const note = new Note({
  content: "JS is pretty hard",
  important: false,
});
note.save().then((result) => {
  console.log("note saved");
  // mongoose.connection.close();
});

// FIND --> select
Note.find({}).then((result) => {
  result.forEach((note) => console.log(note));
  // console.log(result);
  // mongoose.connection.close();
});

Note.find({ important: false }).then((result) => {
  result.forEach((note) => console.log(note));
  mongoose.connection.close();
});
