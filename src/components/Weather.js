import React, { useState } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFrown } from "@fortawesome/free-solid-svg-icons";

function Weather() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({
    loading: false,
    data: {},
    forecast: [],
    error: false,
  });

  const toDate = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const currentDate = new Date();
    const date = `${days[currentDate.getDay()]} ${currentDate.getDate()} ${
      months[currentDate.getMonth()]
    }`;
    return date;
  };

  const fetchForecast = async (lat, lon) => {
    const forecastUrl = "https://api.openweathermap.org/data/2.5/onecall";
    const appid = "f00c38e0279b7bc85480c3fe775d518c";

    try {
      const response = await axios.get(forecastUrl, {
        params: {
          lat: lat,
          lon: lon,
          exclude: "minutely,hourly",
          units: "metric",
          appid: appid,
        },
      });

      setWeather((prevState) => ({
        ...prevState,
        forecast: response.data.daily,
      }));
    } catch (error) {
      console.error("Error fetching the forecast data", error);
    }
  };

  const search = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setQuery("");
      setWeather({ ...weather, loading: true });

      const url = "https://api.openweathermap.org/data/2.5/weather";
      const appid = "f00c38e0279b7bc85480c3fe775d518c";

      try {
        const response = await axios.get(url, {
          params: {
            q: query,
            units: "metric",
            appid: appid,
          },
        });

        const { lat, lon } = response.data.coord;
        setWeather({
          data: response.data,
          loading: false,
          error: false,
          forecast: [],
        });

        fetchForecast(lat, lon);
      } catch (error) {
        setWeather({ ...weather, data: {}, error: true });
        setQuery("");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1d7874] text-white p-4">
      <h1 className="text-4xl font-bold mb-6">
        Weather App<span>🌤</span>
      </h1>
      <div className="w-full max-w-md">
        <input
          type="text"
          className="w-full p-3 rounded-lg text-black placeholder-gray-400 outline-none mb-4"
          placeholder="Search City..."
          name="query"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyPress={search}
        />
      </div>

      {weather.loading && (
        <div className="flex justify-center items-center mt-4">
          <Oval color="#ffffff" height={80} width={80} />
        </div>
      )}

      {weather.error && (
        <div className="text-red-500 text-center mt-4">
          <FontAwesomeIcon icon={faFrown} className="mr-2" />
          Sorry, City not found
        </div>
      )}

      {weather && weather.data && weather.data.main && (
        <div className="w-full max-w-md bg-[#2b857c] p-6 rounded-lg shadow-lg mt-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold">
              {weather.data.name}, <span>{weather.data.sys.country}</span>
            </h2>
            <p className="text-sm text-gray-200">{toDate()}</p>
          </div>

          <div className="flex justify-center items-center my-4">
            <img
              src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
              alt={weather.data.weather[0].description}
            />
            <div className="text-6xl font-light ml-4">
              {Math.round(weather.data.main.temp)}
              <sup>&deg;C</sup>
            </div>
          </div>

          <div className="text-center text-lg">
            <p>{weather.data.weather[0].description.toUpperCase()}</p>
            <p>Wind Speed: {weather.data.wind.speed} m/s</p>
          </div>

          {/* 7-Day Forecast */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">7-Day Forecast</h3>
            <div className="grid grid-cols-2 gap-4">
              {weather.forecast.map((day, index) => (
                <div
                  key={index}
                  className="bg-[#1a6160] p-4 rounded-lg flex flex-col items-center"
                >
                  <p className="text-sm">
                    {new Date(day.dt * 1000).toLocaleDateString()}
                  </p>
                  <img
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                    alt={day.weather[0].description}
                    className="w-12 h-12"
                  />
                  <div className="text-xl mt-2">
                    {Math.round(day.temp.day)}&deg;C
                  </div>
                  <p className="text-sm text-gray-300 mt-1">
                    {day.weather[0].description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Weather;
