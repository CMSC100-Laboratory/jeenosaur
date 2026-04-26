import { useState, useEffect } from 'react';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ProductList from './pages/ProductList';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setPage(parsed.userType === 'Admin' ? 'admin' : 'products');
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setPage(userData.userType === 'Admin' ? 'admin' : 'products');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setPage('login');
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 900, margin: '0 auto', padding: 20 }}>
      {page === 'login' && <Login onLogin={handleLogin} onGoToSignUp={() => setPage('signup')} />}
      {page === 'signup' && <SignUp onGoToLogin={() => setPage('login')} />}
      {page === 'products' && user && <ProductList user={user} onLogout={handleLogout} />}
      {page === 'admin' && user?.userType === 'Admin' && <AdminDashboard user={user} onLogout={handleLogout} />}
    </div>
  );
}