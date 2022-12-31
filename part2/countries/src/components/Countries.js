import CountryDetail from "./CountryDetail";

const Countries = ({ countries, searchInput }) => {
  const filteredCountries = countries.filter((countries) =>
    countries.name.common.toLowerCase().includes(searchInput)
  );

  let countryView = () => {
    if (filteredCountries.length > 10) {
      return <p>Too many matches, specify another filter</p>;
    } else if (
      filteredCountries.length <= 10 &&
      filteredCountries.length !== 1
    ) {
      return (
        <ul>
          {filteredCountries.map((country) => ((
            <li key={country.cca2}>{country.name.common}</li>
          )))}
        </ul>
      );
    } else if (filteredCountries.length === 1) {
      return <CountryDetail country={filteredCountries[0]} />;
    }
  };

  return <div>{countryView()}</div>;
};

export default Countries;
