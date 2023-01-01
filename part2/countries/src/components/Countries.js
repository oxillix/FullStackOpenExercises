import { useState } from "react";
import CountryDetail from "./CountryDetail";

const Countries = ({ countries, searchInput }) => {
  const [selectedCountries, setSelectedCountries] = useState([]);

  const filteredCountries = countries.filter((countries) =>
    countries.name.common.toLowerCase().includes(searchInput)
  );

  const buttonClickHandler = (country) => () => {
    if (selectedCountries.includes(country.cca2) === true) {
      console.log(
        selectedCountries.filter(
          (selectedCountry) => selectedCountry !== country.cca2
        )
      );
      setSelectedCountries(
        selectedCountries.filter(
          (selectedCountry) => selectedCountry !== country.cca2
        )
      );
    } else {
      setSelectedCountries([...selectedCountries, country.cca2]);
    }
  };

  console.log(selectedCountries);

  let countryView = () => {
    if (filteredCountries.length > 10) {
      return <p>Too many matches, specify another filter</p>;
    } else if (
      filteredCountries.length <= 10 &&
      filteredCountries.length !== 1
    ) {
      return (
        <ul>
          {filteredCountries.map((country) => (
            <li key={country.cca2}>
              {country.name.common}
              <button onClick={buttonClickHandler(country)}>show</button>

              {selectedCountries.includes(country.cca2) === true && (
                <CountryDetail country={country} />
              )}
            </li>
          ))}
        </ul>
      );
    } else if (filteredCountries.length === 1) {
      return <CountryDetail country={filteredCountries[0]} />;
    }
  };

  return <div>{countryView()}</div>;
};

export default Countries;
