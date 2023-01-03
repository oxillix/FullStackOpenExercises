import { useEffect, useState } from "react";
import AddPersonForm from "./components/AddPersonForm";
import FilterPerson from "./components/FilterPerson";
import Notification from "./components/Notification";
import Persons from "./components/Persons";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchInput, setsearchInput] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const addPerson = (event) => {
    event.preventDefault();

    if (
      persons
        .map((person) => person.name.toLowerCase())
        .includes(newName.toLowerCase())
    ) {
      const person = persons.filter(
        (person) => person.name.toLowerCase() === newName.toLowerCase()
      )[0];

      if (
        window.confirm(
          `${person.name} is already added to the phonebook, replace the old number with a new one?`
        )
      ) {
        const updatedPerson = { ...person, number: newNumber };
        personService
          .update(updatedPerson.id, updatedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== updatedPerson.id ? person : returnedPerson
              )
            );

            setSuccessMessage(`Successfully updated ${updatedPerson.name}`);
            setTimeout(() => {
              setSuccessMessage("");
            }, 5000);
          });
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
      };

      personService.create(personObject).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");

        setSuccessMessage(`Added ${returnedPerson.name}`);
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      });
    }
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
      <Notification message={successMessage} />

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
