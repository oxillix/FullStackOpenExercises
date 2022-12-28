import { useState } from "react";
import Contact from "./components/Contact";

const App = () => {
  const [persons, setPersons] = useState([{ name: "Arto Hellas" }]);
  const [newName, setNewName] = useState("");

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
      // This method works for our application since notes are never deleted
      id: newName,
    };

    setPersons(persons.concat(personObject));
    setNewName("");
  };

  const handlePersonChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };

  return (
    <div>
      <div>debug: {newName}</div>

      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handlePersonChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      <ul>
        {persons.map((person) => (
          <Contact key={person.id} person={person} />
        ))}
      </ul>
    </div>
  );
};

export default App;
