import axios from "axios";
import { useEffect, useState } from "react";
import FilterCountries from "./components/FilterCountries";
import Countries from "./components/Countries";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [searchInput, setsearchInput] = useState("");

  // const addPerson = (event) => {
  //   event.preventDefault();

  //   if (
  //     count
  //       .map((person) => person.name.toLowerCase())
  //       .includes(newName.toLowerCase())
  //   )
  //     return alert(`${newName} is already added to phonebook`);

  //   const personObject = {
  //     name: newName,
  //     number: newNumber,
  //     // This method works for our application since notes are never deleted
  //     id: newName,
  //   };

  //   setPersons(persons.concat(personObject));
  //   setNewName("");
  //   setNewNumber("");
  // };

  const handlesearchInput = (event) => {
    console.log(event.target.value);
    setsearchInput(event.target.value);

    let countriesLength = countries.filter((countries) =>
      countries.name.common.toLowerCase().includes(searchInput)
    ).length;

    console.log(countriesLength);
  };

  useEffect(() => {
    console.log("effect");
    axios.get("https://restcountries.com/v3.1/all").then((response) => {
      console.log("promise fulfilled");
      setCountries(response.data);
    });
  }, []);

  return (
    <div>
      <FilterCountries
        handlesearchInput={handlesearchInput}
        searchInput={searchInput}
      />

      <Countries countries={countries} searchInput={searchInput} />
    </div>
  );
};

export default App;
