import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

function Crops() {
  const [crops, setCrops] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    season: '',
    growthDuration: '',
    description: '',
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/crops');
      if (!response.ok) throw new Error('Failed to fetch crops');
      const data = await response.json();
      setCrops(data);
      setError('');
    } catch (error) {
      console.error('Error fetching crops:', error);
      setError('Failed to load crops. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Please login to add crops.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/crops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to add crop');
      fetchCrops();
      setFormData({ name: '', type: '', season: '', growthDuration: '', description: '' });
      setError('');
    } catch (error) {
      console.error('Error adding crop:', error);
      setError('Failed to add crop. Please login or try again.');
    }
  };

  const handleFileUpload = async () => {
    if (!isAuthenticated) {
      setError('Please login to upload crops.');
      return;
    }
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        for (const crop of jsonData) {
          await fetch('http://localhost:5000/api/crops', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(crop),
          });
        }
        fetchCrops();
        setFile(null);
        setError('');
      } catch (error) {
        console.error('Error uploading crops:', error);
        setError('Failed to upload Excel file. Please ensure it has the correct format and you are logged in.');
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Crop Management</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-green-600 mb-4">Add New Crop</h3>
          {!isAuthenticated && (
            <p className="text-gray-600 mb-4">
              Please <a href="/login" className="text-green-600 hover:underline">login</a> to add crops.
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Crop Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
                disabled={!isAuthenticated}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
                disabled={!isAuthenticated}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Season</label>
              <input
                type="text"
                name="season"
                value={formData.season}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
                disabled={!isAuthenticated}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Growth Duration (days)</label>
              <input
                type="number"
                name="growthDuration"
                value={formData.growthDuration}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
                disabled={!isAuthenticated}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                rows="4"
                required
                disabled={!isAuthenticated}
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400"
              disabled={!isAuthenticated}
            >
              Add Crop
            </button>
          </form>
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-green-600 mb-4">Import Crops from Excel</h3>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="mb-4"
              disabled={!isAuthenticated}
            />
            <button
              onClick={handleFileUpload}
              disabled={!file || !isAuthenticated}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
              Upload Excel
            </button>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-green-600 mb-4">Available Crops</h3>
          {crops.length === 0 ? (
            <p className="text-gray-600">No crops available.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {crops.map((crop) => (
                <div key={crop._id} className="bg-white p-4 rounded-lg shadow-md">
                  <h4 className="text-lg font-semibold text-gray-900">{crop.name}</h4>
                  <p className="text-gray-600">Type: {crop.type}</p>
                  <p className="text-gray-600">Season: {crop.season}</p>
                  <p className="text-gray-600">Growth Duration: {crop.growthDuration} days</p>
                  <p className="text-gray-600">Description: {crop.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Crops;