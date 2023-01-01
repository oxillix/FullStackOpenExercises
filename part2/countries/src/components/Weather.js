import axios from "axios";
import { useEffect, useState } from "react";

const Weather = ({ country }) => {
  const [weatherData, setWeatherData] = useState("empty");
  const api_key = process.env.REACT_APP_API_KEY;
  console.log(api_key);

  useEffect(() => {
    console.log("effect");
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${country.capitalInfo.latlng[0]}&lon=${country.capitalInfo.latlng[1]}&appid=${api_key}`
      )
      .then((response) => {
        console.log("promise fulfilled");
        setWeatherData(response.data);
      });
  }, []);

  console.log(weatherData);

  if (weatherData !== "empty")
    return (
      <div>
        <h2>Weather in {country.capital}</h2>
        <p>temperature {weatherData.main.temp} Celcius</p>

        <img
          src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
          alt={weatherData.weather[0].description}
          width="200"
          height="200"
        />
        <p>wind {weatherData.wind.speed} m/s</p>
      </div>
    );
};

export default Weather;
