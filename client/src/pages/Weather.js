import { useState } from 'react';

function Weather() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    if (!city) {
      setError('Please enter a city name');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/weather/${encodeURIComponent(city)}`);
      if (!response.ok) throw new Error('Failed to fetch weather data');
      const data = await response.json();
      setWeather(data);
      setError('');
    } catch (error) {
      console.error('Error fetching weather:', error);
      setError('Failed to load weather data. Please check the city name and try again.');
      setWeather(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Weather Insights</h2>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold text-green-600 mb-4">Check Weather</h3>
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
            className="flex-1 border border-gray-300 rounded-md p-2"
          />
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
          >
            Get Weather
          </button>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
      {weather && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-green-600 mb-4">Weather in {weather.city}</h3>
          <p className="text-gray-600">Temperature: {weather.temperature}°C</p>
          <p className="text-gray-600">Description: {weather.description}</p>
          <p className="text-gray-600">Humidity: {weather.humidity}%</p>
          <p className="text-gray-600">Wind Speed: {weather.windSpeed} m/s</p>
        </div>
      )}
    </div>
  );
}

export default Weather;