/* eslint-disable no-debugger */
import { useState } from "react";

function Button({ onClick, text }) {
  return <button onClick={onClick}>{text}</button>;
}

function History({ allClicks }) {
  if (allClicks.length === 0) {
    return <div>The app is used by pressing the buttons</div>;
  }

  return <div>button press history: {allClicks.join(" ")}</div>;
}

function Display({ value }) {
  return <div>{value}</div>;
}

const App = () => {
  const [value, setValue] = useState(0);
  const [clicks, setClicks] = useState({
    left: 0,
    right: 0,
  });
  const [allClicks, setAll] = useState([]);
  const [total, setTotal] = useState(0);

  const handleLeftClick = () => {
    const updatedLeft = clicks.left + 1;
    setClicks({ ...clicks, left: updatedLeft });

    setAll(allClicks.concat("L"));
    setTotal(updatedLeft + clicks.right);
  };

  const handleRightClick = () => {
    const updatedRight = clicks.right + 1;
    setClicks({ ...clicks, right: updatedRight });

    setAll(allClicks.concat("R"));
    setTotal(clicks.left + updatedRight);
  };

  const handleReset = () => {
    setClicks({
      left: 0,
      right: 0,
    });
    setAll([]);
    setTotal(0);
  };

  // debugger;

  // Function returning a function
  const handleHello = (who) => () => console.log(`Helolo, ${who}`);

  const setToValue = (value) => () => setValue(value);

  return (
    <div>
      {clicks.left}
      <Button onClick={handleLeftClick} text="left" />
      <Button onClick={handleRightClick} text="right" />
      {clicks.right}
      <History allClicks={allClicks} />
      <p>Total: {total}</p>
      <button onClick={handleReset}>Reset to Zero</button>
      <Button onClick={handleHello("Fer")} text="Say Hello in the console" />
      <hr />
      <Button onClick={setToValue(1000)} text="Set Vaue to???" />
      <Display value={value} />
    </div>
  );
};

export default App;
