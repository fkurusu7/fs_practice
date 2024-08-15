const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://admin:admin@cluster0-fs.qnjdn.mongodb.net/testNoteApp?retryWrites=true&w=majority&appName=Cluster0-FS`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

// FIND --> select
if (process.argv.length === 3) {
  Note.find({}).then((result) => {
    result.forEach((note) => console.log(note));
    mongoose.connection.close();
  });
}

// Note.find({ important: false }).then((result) => {
//   result.forEach((note) => console.log(note));
//   mongoose.connection.close();
// });

// SAVE --> insert
if (process.argv.length >= 4) {
  const note = new Note({
    content: process.argv[3],
    important: process.argv[4] && Math.random() < 0.5,
  });
  note.save().then((result) => {
    console.log("note saved: \n", result);
    mongoose.connection.close();
  });
}
