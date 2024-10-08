// require("dotenv").config();
// 2359;4632;8101;

const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const MONGODB_URI = process.env.MONGODB_URI;
console.log("*******************************");
console.log("*** Connecting to:", MONGODB_URI);

const ATLAS_STR = "MongoDB Atlas";

mongoose
  .connect(MONGODB_URI)
  .then((result) => console.log(`** connected to ${ATLAS_STR}`))
  .catch((error) =>
    console.log(`** error connecting to ${ATLAS_STR} - ${error.message}`)
  );

const noteSchema = mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true,
  },
  important: Boolean,
});

noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Note", noteSchema);
