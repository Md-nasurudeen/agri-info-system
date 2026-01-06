import React from 'react';

const CropCard = ({ crop }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">{crop.name}</h3>
            <p className="text-gray-600">Type: {crop.type}</p>
            <p className="text-gray-600">Season: {crop.season}</p>
            <p className="text-gray-600">Growth Duration: {crop.growthDuration} days</p>
        </div>
    );
};

export default CropCard;