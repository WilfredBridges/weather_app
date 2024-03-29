import React, { useState } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [firstName, setFirstName] = useState('');

  const handleSearch = async () => {
    try {
      const searchUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`;
      const searchResponse = await fetch(searchUrl);
      const searchResult = await searchResponse.json();

      if (searchResult.results.length > 0) {
        const { latitude, longitude, name } = searchResult.results[0];
        setLatitude(latitude);
        setLongitude(longitude);
        setFirstName(name);

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,is_day&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum&current_weather=true&timezone=auto`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherResult = await weatherResponse.json();
        setWeatherData(weatherResult);
      } else {
        setLatitude(null);
        setLongitude(null);
        setWeatherData(null);
        setFirstName('');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const formatForecastDate = (index) => {
    const today = new Date();
    today.setDate(today.getDate() + index + 1);
    
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = daysOfWeek[today.getDay()];
    
    const dayOfMonth = today.getDate();
    let suffix = 'th';
    if (dayOfMonth === 1 || dayOfMonth === 21 || dayOfMonth === 31) {
      suffix = 'st';
    } else if (dayOfMonth === 2 || dayOfMonth === 22) {
      suffix = 'nd';
    } else if (dayOfMonth === 3 || dayOfMonth === 23) {
      suffix = 'rd';
    }
    
    return `${dayOfWeek} ${dayOfMonth}${suffix}`;
  };
  
  return (
    <div className="container">
      <div className='search-bar'>
      <input
        type="text"
        placeholder="Enter a city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      </div>
      {latitude && longitude && (
        <div className="location">
          Latitude: {latitude}, Longitude: {longitude}
        </div>
      )}

      {weatherData && (
        <div className="weather-container">
          <h2>{firstName}</h2>
          <p className="current-temperature">Temperature: {Math.round(weatherData.current_weather.temperature)}°C</p>
          <p>Max: {Math.round(weatherData.daily.temperature_2m_max[0])}°C</p>
          <p>Min: {Math.round(weatherData.daily.temperature_2m_min[0])}°C</p>

          <h3>Forecast:</h3>
          <ul className="forecast-list">
            {weatherData.daily.temperature_2m_max.slice(1, 6).map((maxTemp, index) => (
              <li key={index} className="forecast-item">
                <span className="day">{formatForecastDate(index)}:</span>
                <span className="temperature">Max: {maxTemp}°C</span>
                <span className="temperature">Min: {weatherData.daily.temperature_2m_min[index + 1]}°C</span>
                <span className="precipitation">Rainfall: {weatherData.daily.precipitation_sum[index + 1]} mm</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;













