import { useState, useEffect } from "react";
import Note from "./components/Note";
import Notification from "./components/Notification";
import notesService from "./services/notes";
import loginService from "./services/login";
import NoteForm from "./components/NoteForm";
import LoginForm from "./components/LoginForm";

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

  // ********************************************
  // LOGIN
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  // ********************************************

  // GET http ALL Notes

  useEffect(() => {
    notesService.getAll().then((initialNotes) => {
      console.log(initialNotes);
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
    // return () => {
    // }
  }, []);

  const handleLogout = () => {
    console.log("Logging out...");
    window.localStorage.clear();
  };

  const handleLogin = async (ev) => {
    ev.preventDefault();
    console.log(`logged with: ${username} ${password}`);

    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedNoteAppUser", JSON.stringify(user));
      notesService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (error) {
      setErrorMessage("Wrong Credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      setUsername("");
      setPassword("");
    }
  };

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

      {user === null ? (
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      ) : (
        <div>
          <p>
            Welcome, {user.name}.
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </p>
          <NoteForm
            addNote={addNote}
            handleNoteChange={handleNoteChange}
            newNote={newNote}
          />
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
