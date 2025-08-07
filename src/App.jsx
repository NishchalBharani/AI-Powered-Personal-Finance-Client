import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { restoreSession, logout } from './store/authSlice';
import Login from './components/Login';
import Register from './components/Register';
import './index.css';
import { useNavigate } from 'react-router-dom';
import FinanceDashboard from './components/FinanceDashboard';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Finance Dashboard</h1>
        {token && (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded transition duration-200"
          >
            Logout
          </button>
        )}
      </header>

      <main className="container mx-auto p-4">
      {token ? (
        <FinanceDashboard />
      ) : showLogin ? (
        <Login onSwitchToRegister={() => setShowLogin(false)} />
      ) : (
        <Register onSwitchToLogin={() => setShowLogin(true)} />
      )}
    </main>
    </div>
  );
}

export default App;
