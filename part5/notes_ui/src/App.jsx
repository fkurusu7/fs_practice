import { useState, useEffect } from "react";
import Note from "./components/Note";
import Notification from "./components/Notification";
import notesService from "./services/notes";
import NoteForm from "./components/NoteForm";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";

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
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState(null);
  // ********************************************

  // GET http ALL Notes

  useEffect(() => {
    notesService.getAll().then((initialNotes) => {
      setNotes(initialNotes);
    });
  }, []);

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem("loggedNoteAppUser");
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON);
      setUser(user);
      notesService.setToken(user.token);
    }
  }, []);

  const handleLogout = () => {
    console.log("Logging out...");
    window.localStorage.clear();
    setUser(null);
  };

  const createNote = (noteObject) => {
    notesService.create(noteObject).then((returnedNote) => {
      setNotes(notes.concat(returnedNote));
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

      {user === null ? (
        <Togglable buttonLabel={"Log in"}>
          <LoginForm setErrorMessage={setErrorMessage} setUser={setUser} />
        </Togglable>
      ) : (
        <div>
          <p>
            Welcome, {user.name}.
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </p>
          <Togglable buttonLabel={"new note"}>
            <NoteForm onCreateNote={createNote} />
          </Togglable>
        </div>
      )}

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

      <Footer />
    </div>
  );
}

export default App;
