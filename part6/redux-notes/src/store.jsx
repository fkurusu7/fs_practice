import { configureStore } from "@reduxjs/toolkit";

import notesReducer from "./reducers/noteReducer";
import filterReducer from "./reducers/filterReducer";

const store = configureStore({
  reducer: {
    notes: notesReducer,
    filter: filterReducer,
  },
});

export default store;
