import { render, screen } from "@testing-library/react";
import NoteForm from "../components/NoteForm";
import userEvent from "@testing-library/user-event";

test("<NoteForm/> should update parent state and calls submit", async () => {
  const createNote = vi.fn();
  const user = userEvent.setup();

  render(<NoteForm onCreateNote={createNote} />);

  const input = screen.getByRole("textbox");
  const sendButton = screen.getByText("save");

  await user.type(input, "testing a form...");
  await user.click(sendButton);

  expect(createNote.mock.calls).toHaveLength(1);
  expect(createNote.mock.calls[0][0].content).toBe("testing a form...");
});