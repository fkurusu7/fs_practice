function NoteForm({ addNote, newNote, handleNoteChange }) {
  return (
    <form onSubmit={addNote}>
      <input type="text" value={newNote} onChange={handleNoteChange} />
      <button type="submit">save</button>
    </form>
  );
}

export default NoteForm;
