function Hello({ name, age }) {
  return (
    <div>
      <p>
        Hello, {name}. You are {age} years old
      </p>
    </div>
  );
}

function App() {
  const name = "fer";
  const age = "30";
  const friends = ["Peter", "Maya"];

  return (
    <div>
      <p>Greetings!</p>
      <Hello name={name} age={age} />
      <p>{friends}</p>
    </div>
  );
}

export default App;
