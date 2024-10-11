import { createSlice, current } from "@reduxjs/toolkit";
import notesService from "../services/notes";

/* const initialState = [
  {
    content: "reducer defines how redux store works",
    important: true,
    id: 1,
  },
  {
    content: "state of store can contain any data",
    important: false,
    id: 2,
  },
];
const generateId = () => Number((Math.random() * 1000000).toFixed(0));
 */

const noteSlice = createSlice({
  name: "notes",
  initialState: [],
  reducers: {
    toggleImportanceOf(state, action) {
      const id = action.payload;
      const noteToChange = state.find((n) => n.id === id);
      const changedNote = {
        ...noteToChange,
        important: !noteToChange.important,
      };
      // console.log(current(state));
      return state.map((note) => (note.id !== id ? note : changedNote));
    },
    appendNote(state, action) {
      state.push(action.payload);
    },
    setNotes(state, action) {
      return action.payload;
    },
  },
});

export const { toggleImportanceOf, appendNote, setNotes } = noteSlice.actions;

export const initializedNotes = () => {
  return async (dispatch) => {
    const notes = await notesService.getAll();
    dispatch(setNotes(notes));
  };
};

export const createNote = (content) => {
  return async (dispatch) => {
    const newNote = await notesService.createNote(content);
    dispatch(appendNote(newNote));
  };
};

export default noteSlice.reducer;

// const noteReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case "NEW_NOTE":
//       return [...state, action.data];
//     case "TOGGLE_IMPORTANCE":
//       const id = action.data.id;
//       const noteToChange = state.find((n) => n.id === id);
//       const changedNote = {
//         ...noteToChange,
//         important: !noteToChange.important,
//       };
//       return state.map((note) => (note.id !== id ? note : changedNote));
//     default:
//       return state;
//   }
// };

// export const createNote = (content) => {
//   return {
//     type: "NEW_NOTE",
//     data: {
//       content,
//       important: false,
//       id: generateId(),
//     },
//   };
// };

// export const toggleImportanceOf = (id) => {
//   return {
//     type: "TOGGLE_IMPORTANCE",
//     data: { id },
//   };
// };

// export default noteReducer;
