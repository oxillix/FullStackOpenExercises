import axios from "axios";
import { useEffect, useState } from "react";
import AddPersonForm from "./components/AddPersonForm";
import FilterPerson from "./components/FilterPerson";
import Persons from "./components/Persons";

const App = () => {
  const [persons, setPersons] = useState([]);
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

  useEffect(() => {
    console.log("effect");
    axios.get("http://localhost:3001/persons").then((response) => {
      console.log("promise fulfilled");
      setPersons(response.data);
    });
  }, []);

  return (
    <div>
      <div>debug: {newName}</div>

      <h2>Phonebook</h2>
      <FilterPerson
        handlesearchInput={handlesearchInput}
        searchInput={searchInput}
      />

      <AddPersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        handleNameChange={handleNameChange}
      />

      <Persons persons={persons} searchInput={searchInput} />
    </div>
  );
};

export default App;
