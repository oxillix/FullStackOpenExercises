import axios from "axios";
import { useEffect, useState } from "react";
import Weather from "./Weather";

const CountryDetail = ({ country }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>

      <p>capital {country.capital}</p>
      <p>area {country.area}</p>

      <p>
        <b>languages</b>
      </p>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>

      <img src={country.flags.png} alt="flag" width="200" height="200" />

      <Weather country={country} />
    </div>
  );
};

export default CountryDetail;
