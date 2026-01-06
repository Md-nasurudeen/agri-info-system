import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Navbar() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setUsername(localStorage.getItem('username') || '');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUsername('');
    navigate('/');
    window.location.reload(); // to force update navbar state
  };

  return (
    <nav className="bg-green-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center text-xl font-bold">
              AgriInfo
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link to="/crops" className="hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium">
              Crops
            </Link>
            <Link to="/weather" className="hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium">
              Weather
            </Link>
            <Link to="/forum" className="hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium">
              Forum
            </Link>

            {username ? (
              <>
                <span className="px-3 py-2 text-sm font-medium">Hi, {username}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link to="/signup" className="hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
