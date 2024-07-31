import { useState, useEffect } from "react";
import Note from "./components/Note";
import axios from "axios";

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);

  const hook = () => {
    console.log("***** EFFECT ****");

    axios.get("http://localhost:3001/notes").then((res) => {
      console.log("promise fulfilled");
      setNotes(res.data);
    });
  };

  useEffect(hook, []);
  console.log("render", notes.length, "notes");

  const handleNoteChange = (ev) => {
    setNewNote(ev.target.value);
  };

  const addNote = (ev) => {
    ev.preventDefault();
    const newNoteObj = {
      id: String(notes.length + 1),
      content: newNote,
      important: Math.random() < 0.5,
    };

    setNotes(notes.concat(newNoteObj));
    setNewNote("");
  };

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note key={note.id} note={note} />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input type="text" value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
    </div>
  );
}

export default App;
