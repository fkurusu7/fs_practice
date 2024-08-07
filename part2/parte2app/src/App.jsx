import { useState, useEffect } from "react";
import Note from "./components/Note";
import Notification from "./components/Notification";
import notesService from "./services/notes";

const Footer = () => {
  const footerStyle = { color: "green", fontStyle: "italic", fontSize: 16 };
  return (
    <div style={footerStyle}>
      <br />
      <em>
        Note app, Department of Computer Science, University of Helsinki 2024
      </em>
    </div>
  );
};

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // GET http ALL Notes
  useEffect(() => {
    notesService.getAll().then((initialNotes) => {
      console.log(initialNotes);
      setNotes(initialNotes);
    });
  }, []);

  // Input for new note
  const handleNoteChange = (ev) => {
    setNewNote(ev.target.value);
  };

  // POST http
  const addNote = (ev) => {
    ev.preventDefault();
    const newNoteObj = {
      // id: String(notes.length + 1),
      content: newNote,
      important: Math.random() < 0.5,
    };

    notesService.create(newNoteObj).then((returnedNote) => {
      setNotes(notes.concat(returnedNote));
      setNewNote("");
    });
  };

  // Toggle Importance of notes
  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changeNote = { ...note, important: !note.important };

    notesService
      .update(id, changeNote)
      .then((returnedNote) =>
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)))
      )
      .catch((error) => {
        setErrorMessage(
          `Note '${note.content}'  was already removed from server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  // Filtered notes
  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  return (
    <div>
      <h1>Notes</h1>
      {errorMessage && <Notification message={errorMessage} />}
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input type="text" value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  );
}

export default App;
