import { useState, useEffect } from 'react';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ProductList from './pages/ProductList';
import AdminDashboard from './pages/AdminDashboard';
import ShoppingCart from './pages/ShoppingCart';
import MyOrders from './pages/MyOrders';

export default function App() {
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  // Load user and cart count on mount
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setPage(parsed.userType === 'Admin' ? 'admin' : 'products');
      // Load cart count for customers
      if (parsed.userType === 'Customer') {
        loadCartCount();
      }
    }
  }, []);

  // Load cart count from backend
  const loadCartCount = async () => {
    try {
      const res = await fetch('http://localhost:3001/get-cart', {
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id
        }
      });
      const data = await res.json();
      if (data.success) {
        setCartCount(data.totalItems);
      }
    } catch (err) {
      console.error('Failed to load cart:', err);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setPage(userData.userType === 'Admin' ? 'admin' : 'products');
    if (userData.userType === 'Customer') {
      loadCartCount();
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCartCount(0);
    localStorage.removeItem('user');
    setPage('login');
  };

  // Navigation components with cart badge
  const CustomerNav = () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <NavButton active={page === 'products'} onClick={() => setPage('products')}>🛍️ Products</NavButton>
      <NavButton active={page === 'cart'} onClick={() => setPage('cart')} badge={cartCount}>
        🛒 Cart
      </NavButton>
      <NavButton active={page === 'orders'} onClick={() => setPage('orders')}>📦 Orders</NavButton>
    </div>
  );

  const AdminNav = () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <NavButton active={page === 'admin'} onClick={() => setPage('admin')} primary>📊 Dashboard</NavButton>
      <NavButton active={page === 'admin-orders'} onClick={() => setPage('admin-orders')}>📋 Orders</NavButton>
      <NavButton active={page === 'reports'} onClick={() => setPage('reports')}>📈 Reports</NavButton>
    </div>
  );

  const NavButton = ({ children, active, onClick, badge, primary }) => (
    <button 
      onClick={onClick}
      style={{
        padding: '8px 16px',
        background: active ? (primary ? '#2196F3' : '#4CAF50') : '#f5f5f5',
        color: active ? 'white' : '#333',
        border: 'none',
        borderRadius: 4,
        cursor: 'pointer',
        fontWeight: active ? 600 : 400,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 4
      }}
    >
      {children}
      {badge > 0 && (
        <span style={{
          position: 'absolute',
          top: -6,
          right: -6,
          background: '#f44336',
          color: 'white',
          fontSize: 10,
          fontWeight: 600,
          minWidth: 18,
          height: 18,
          borderRadius: 9,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 4px'
        }}>
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  );

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 1200, margin: '0 auto', padding: 20 }}>
      {/* Global Header */}
      {user && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #eee' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20 }}>🌾 Farm-to-Table</h1>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#666' }}>
              {user.userType === 'Admin' ? 'Department of Agriculture' : `Hi, ${user.email.split('@')[0]}!`}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {user.userType === 'Admin' ? <AdminNav /> : <CustomerNav />}
          </div>
        </div>
      )}

      {/* Page Router */}
      {page === 'login' && <Login onLogin={handleLogin} onGoToSignUp={() => setPage('signup')} />}
      {page === 'signup' && <SignUp onGoToLogin={() => setPage('login')} />}
      
      {/* Customer Pages with Cart Persistence */}
      {page === 'products' && user?.userType === 'Customer' && (
        <ProductList 
          user={user} 
          onLogout={handleLogout} 
          onCartUpdate={loadCartCount} // Refresh cart badge after add
        />
      )}
      {page === 'cart' && user?.userType === 'Customer' && (
        <ShoppingCart 
          user={user} 
          onLogout={handleLogout} 
          onCheckout={() => setPage('orders')}
          onCartUpdate={loadCartCount}
        />
      )}
      {page === 'orders' && user?.userType === 'Customer' && (
        <MyOrders 
          user={user} 
          onLogout={handleLogout} 
          onBackToProducts={() => setPage('products')}
        />
      )}
      
      {/* Admin Pages */}
      {page === 'admin' && user?.userType === 'Admin' && <AdminDashboard user={user} onLogout={handleLogout} />}
      {page === 'admin-orders' && user?.userType === 'Admin' && (
        <div style={{ padding: 40, textAlign: 'center', background: '#f9f9f9', borderRadius: 8 }}>
          <h3>📋 Order Management</h3>
          <p style={{ color: '#666' }}>View & confirm customer orders</p>
          <button onClick={() => setPage('admin')} style={{ marginTop: 16, padding: '10px 24px', background: '#2196F3', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>← Back to Dashboard</button>
        </div>
      )}
      {page === 'reports' && user?.userType === 'Admin' && (
        <div style={{ padding: 40, textAlign: 'center', background: '#f9f9f9', borderRadius: 8 }}>
          <h3>📈 Sales Reports</h3>
          <p style={{ color: '#666' }}>Weekly/Monthly/Annual analytics</p>
          <button onClick={() => setPage('admin')} style={{ marginTop: 16, padding: '10px 24px', background: '#2196F3', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>← Back to Dashboard</button>
        </div>
      )}
    </div>
  );
}