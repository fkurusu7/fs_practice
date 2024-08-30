import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Note from "../components/Note";

test("should render content field", () => {
  const note = {
    content: "Component testing is done with react-testing-library",
    important: true,
  };

  const { container } = render(<Note note={note} />);
  screen.debug();
  const element = screen.getByText(
    "Component testing is done with react-testing-library"
  );
  screen.debug(element);
  expect(element).toBeDefined();

  const div = container.querySelector(".note");
  expect(div).toHaveTextContent(
    "Component testing is done with react-testing-library"
  );
});

test("should click the button to call event handler once", async () => {
  const note = {
    content: "Component testing is done with react-testing-library",
    important: true,
  };

  const mockHandler = vi.fn();
  render(<Note note={note} toggleImportance={mockHandler} />);

  const user = userEvent.setup();
  const button = screen.getByText("make not important");
  await user.click(button);

  expect(mockHandler.mock.calls).toHaveLength(1);
});
