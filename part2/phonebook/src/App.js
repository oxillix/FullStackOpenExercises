import { useState } from "react";
import Contact from "./components/Contact";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchInput, setsearchInput] = useState("");

  const addPerson = (event) => {
    event.preventDefault();

    if (
      persons
        .map((person) => person.name.toLowerCase())
        .includes(newName.toLowerCase())
    )
      return alert(`${newName} is already added to phonebook`);

    const personObject = {
      name: newName,
      number: newNumber,
      // This method works for our application since notes are never deleted
      id: newName,
    };

    setPersons(persons.concat(personObject));
    setNewName("");
    setNewNumber("");
  };

  const handleNameChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  };

  const handlesearchInput = (event) => {
    console.log(event.target.value);
    setsearchInput(event.target.value);
  };

  return (
    <div>
      <div>debug: {newName}</div>

      <h2>Phonebook</h2>
      <div>
        filter shown with{" "}
        <input value={searchInput} onChange={handlesearchInput} />
      </div>

      <h2>add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      <ul>
        {persons
          .filter((person) => person.name.toLowerCase().includes(searchInput))
          .map((person) => (
            <Contact key={person.id} person={person} />
          ))}
      </ul>
    </div>
  );
};

export default App;
