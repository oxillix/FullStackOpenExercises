import { useEffect, useState } from "react";
import AddPersonForm from "./components/AddPersonForm";
import FilterPerson from "./components/FilterPerson";
import Persons from "./components/Persons";
import personService from "./services/persons";

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
    };

    personService.create(personObject).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson));
      setNewName("");
      setNewNumber("");
    });
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
    personService.getAll().then((initalPersons) => {
      setPersons(initalPersons);
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
