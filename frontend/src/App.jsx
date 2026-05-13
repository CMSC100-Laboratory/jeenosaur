import { useState } from 'react';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ProductList from './pages/ProductList';
import AdminDashboard from './pages/AdminDashboard';
import ShoppingCart from './pages/ShoppingCart';
import MyOrders from './pages/MyOrders';
import SalesReport from './pages/SalesReport';
import AdminOrders from './pages/AdminOrders';

export default function App() {
  const getStoredUser = () => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  };

  const [user, setUser] = useState(getStoredUser);
  const [page, setPage] = useState(() => {
    const storedUser = getStoredUser();
    if (!storedUser) return 'login';
    return storedUser.userType === 'Admin' ? 'admin' : 'products';
  });
  const [cartCount, setCartCount] = useState(0);

  const loadCartCount = async (currentUser = user) => {
    if (!currentUser?.id) return;

    try {
      const res = await fetch('http://localhost:3001/get-cart', {
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id
        }
      });
      const data = await res.json();
      if (data.success) setCartCount(data.totalItems);
    } catch (err) {
      console.error('Failed to load cart:', err);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setPage(userData.userType === 'Admin' ? 'admin' : 'products');
    if (userData.userType === 'Customer') loadCartCount(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setCartCount(0);
    localStorage.removeItem('user');
    setPage('login');
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', width: '100%', minHeight: '100vh' }}>
      {page === 'login' && <Login onLogin={handleLogin} onGoToSignUp={() => setPage('signup')} />}
      {page === 'signup' && <SignUp onGoToLogin={() => setPage('login')} />}

      {page === 'products' && user?.userType === 'Customer' && (
        <ProductList
          activeTab="products"
          user={user}
          cartCount={cartCount}
          onLogout={handleLogout}
          onCartUpdate={() => loadCartCount(user)}
          onGoToProducts={() => setPage('products')}
          onGoToCart={() => setPage('cart')}
          onGoToOrders={() => setPage('orders')}
        />
      )}

      {page === 'cart' && user?.userType === 'Customer' && (
        <ShoppingCart
          activeTab="cart"
          user={user}
          onLogout={handleLogout}
          onCheckout={() => setPage('orders')}
          onCartUpdate={() => loadCartCount(user)}
          onGoToProducts={() => setPage('products')}
          onGoToCart={() => setPage('cart')}
          onGoToOrders={() => setPage('orders')}
        />
      )}

      {page === 'orders' && user?.userType === 'Customer' && (
        <MyOrders
          activeTab="orders"
          user={user}
          onLogout={handleLogout}
          onBackToProducts={() => setPage('products')}
          onGoToProducts={() => setPage('products')}
          onGoToCart={() => setPage('cart')}
          onGoToOrders={() => setPage('orders')}
        />
      )}

      {page === 'admin' && user?.userType === 'Admin' && (
        <AdminDashboard
          user={user}
          onLogout={handleLogout}
          onGoToOrders={() => setPage('admin-orders')}
          onGoToReports={() => setPage('reports')}
        />
      )}

      {page === 'admin-orders' && user?.userType === 'Admin' && (
        <AdminOrders
          user={user}
          onLogout={handleLogout}
          onBackToDashboard={() => setPage('admin')}
        />
      )}

      {page === 'reports' && user?.userType === 'Admin' && (
        <SalesReport
          user={user}
          onLogout={handleLogout}
          onBackToDashboard={() => setPage('admin')}
        />
      )}
    </div>
  );
}
