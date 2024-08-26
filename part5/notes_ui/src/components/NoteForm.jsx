import { useState } from "react";

function NoteForm({ onCreateNote }) {
  const [newNote, setNewNote] = useState("");

  // POST http
  const addNote = (ev) => {
    ev.preventDefault();
    onCreateNote({
      content: newNote,
      important: false,
    });

    setNewNote("");
  };

  return (
    <div>
      <h2>Create a new Note</h2>
      <form onSubmit={addNote}>
        <input
          type="text"
          value={newNote}
          onChange={({ target }) => setNewNote(target.value)}
        />
        <button type="submit">save</button>
      </form>
    </div>
  );
}

export default NoteForm;
