import React from 'react';

const WeatherWidget = ({ weather }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">{weather.location}</h3>
            <p className="text-gray-600">Temperature: {weather.temperature}°C</p>
            <p className="text-gray-600">Condition: {weather.condition}</p>
            <p className="text-gray-600">Humidity: {weather.humidity}%</p>
        </div>
    );
};

export default WeatherWidget;