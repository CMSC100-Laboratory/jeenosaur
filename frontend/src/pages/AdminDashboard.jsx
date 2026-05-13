import { useState, useEffect } from 'react';
import { addProduct, getAllUsers, deleteUser, getAllProducts, updateProduct, deleteProduct } from '../api';
import dayImage from '../assets/day.png';
import noonImage from '../assets/noon.png';
import sunsetImage from '../assets/sunset.png';
import nightImage from '../assets/night.png';

export default function AdminDashboard({ onLogout, onGoToOrders, onGoToReports }) {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ id: '', productName: '', productDescription: '', productType: 1, productQuantity: 1, price: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [timeOfDay, setTimeOfDay] = useState('morning');

  // Time-based theme logic (same as other pages)
  useEffect(() => {
    const updateTime = () => {
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 12) setTimeOfDay('morning');
      else if (hour >= 12 && hour < 16) setTimeOfDay('noon');
      else if (hour >= 16 && hour < 18) setTimeOfDay('sunset');
      else setTimeOfDay('night');
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, productsRes] = await Promise.all([
          getAllUsers(),
          getAllProducts()
        ]);
        setUsers(usersRes.users || []);
        setProducts(productsRes || []);
      } catch (err) {
        console.error('Failed to fetch admin data', err);
      }
    };
    fetchData();
  }, []);

  const themes = {
    morning: {
      bg: `url(${dayImage})`,
      overlay: 'linear-gradient(135deg, rgba(27, 94, 32, 0.85) 0%, rgba(46, 125, 50, 0.75) 100%)',
      accent: '#81C784', panelBg: '#F1F8E9', titleColor: '#1B5E20',
      textPrimary: '#2E7D32', textSecondary: '#666666',
      inputBg: '#FFFFFF', inputBorder: '#E0E0E0', inputFocus: '#4CAF50',
      btnBg: '#2E7D32', btnHover: '#1B5E20', btnShadow: 'rgba(46, 125, 50, 0.3)',
      cardBg: 'rgba(255,255,255,0.85)', cardBorder: 'rgba(46, 125, 50, 0.15)'
    },
    noon: {
      bg: `url(${noonImage})`,
      overlay: 'linear-gradient(135deg, rgba(27, 94, 32, 0.8) 0%, rgba(76, 175, 80, 0.7) 100%)',
      accent: '#66BB6A', panelBg: '#E8F5E9', titleColor: '#1B5E20',
      textPrimary: '#2E7D32', textSecondary: '#666666',
      inputBg: '#FFFFFF', inputBorder: '#E0E0E0', inputFocus: '#43A047',
      btnBg: '#2E7D32', btnHover: '#1B5E20', btnShadow: 'rgba(46, 125, 50, 0.3)',
      cardBg: 'rgba(255,255,255,0.85)', cardBorder: 'rgba(46, 125, 50, 0.15)'
    },
    sunset: {
      bg: `url(${sunsetImage})`,
      overlay: 'linear-gradient(135deg, rgba(27, 94, 32, 0.88) 0%, rgba(85, 139, 47, 0.75) 100%)',
      accent: '#AED581', panelBg: '#F1F8E9', titleColor: '#1B5E20',
      textPrimary: '#2E7D32', textSecondary: '#666666',
      inputBg: '#FFFFFF', inputBorder: '#E0E0E0', inputFocus: '#4CAF50',
      btnBg: '#2E7D32', btnHover: '#1B5E20', btnShadow: 'rgba(46, 125, 50, 0.3)',
      cardBg: 'rgba(255,255,255,0.85)', cardBorder: 'rgba(46, 125, 50, 0.15)'
    },
    night: {
      bg: `url(${nightImage})`,
      overlay: 'linear-gradient(135deg, rgba(13, 71, 161, 0.85) 0%, rgba(46, 125, 50, 0.8) 100%)',
      accent: '#64B5F6', panelBg: '#E3F2FD', titleColor: '#0D47A1',
      textPrimary: '#1565C0', textSecondary: '#666666',
      inputBg: '#FFFFFF', inputBorder: '#E0E0E0', inputFocus: '#1976D2',
      btnBg: '#1565C0', btnHover: '#0D47A1', btnShadow: 'rgba(21, 101, 192, 0.3)',
      cardBg: 'rgba(255,255,255,0.85)', cardBorder: 'rgba(21, 101, 192, 0.15)'
    }
  };

  const theme = themes[timeOfDay];
  const lowStockCount = products.filter(p => p.productQuantity <= 5).length;
  const totalRevenue = products.reduce((sum, p) => sum + (p.price * p.productQuantity), 0);

  const inputStyle = {
    padding: '12px 16px',
    border: `2px solid ${theme.inputBorder}`,
    borderRadius: 10,
    fontSize: 14,
    outline: 'none',
    background: theme.inputBg,
    transition: 'all 0.3s',
    color: '#333'
  };

  const renderField = ({ label, hint, fullWidth = false, children }) => (
    <label style={{ gridColumn: fullWidth ? '1 / -1' : 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: theme.titleColor }}>{label}</span>
      {children}
      <span style={{ fontSize: 12, color: theme.textSecondary, lineHeight: 1.4 }}>{hint}</span>
    </label>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) await updateProduct(form);
      else {
        await addProduct({
          productName: form.productName,
          productDescription: form.productDescription,
          productType: form.productType,
          productQuantity: form.productQuantity,
          price: form.price
        });
      }
      setForm({ id: '', productName: '', productDescription: '', productType: 1, productQuantity: 1, price: 0 });
      setIsEditing(false);
      const updated = await getAllProducts();
      setProducts(updated);
    } catch (err) { alert('Failed: ' + (err.message || 'Unknown')); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await deleteUser(id);
    setUsers(users.filter(u => u._id !== id));
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await deleteProduct(id);
    setProducts(products.filter(p => p._id !== id));
  };

  const renderStatCard = ({ icon, label, value, color }) => (
    <div style={{
      background: theme.cardBg,
      borderRadius: 16,
      padding: '20px 24px',
      boxShadow: `0 4px 16px ${theme.btnShadow}`,
      border: `1px solid ${theme.cardBorder}`,
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(8px)'
    }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        background: `${color}20`,
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 24
      }}>
        {icon}
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 13, color: theme.textSecondary, fontWeight: 500 }}>{label}</p>
        <h3 style={{ margin: '4px 0 0 0', fontSize: 24, fontWeight: 700, color: theme.titleColor }}>{value}</h3>
      </div>
    </div>
  );

  return (
    <div style={{
      fontFamily: "'Inter', system-ui, sans-serif",
      background: theme.bg,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      position: 'relative'
    }}>
      {/* Overlay */}
      <div style={{ position: 'absolute', inset: 0, background: theme.overlay, zIndex: 1 }}></div>

      {/* Content Wrapper */}
      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1280, margin: '0 auto', padding: '24px 32px' }}>
        
        {/* Admin Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 32,
          padding: '20px 24px',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(12px)',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              border: '1px solid rgba(255,255,255,0.3)'
            }}>
              Administrator
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                AniWay
              </h1>
              <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
                Farm to Table Management
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={onGoToOrders}
              style={{
                padding: '10px 20px',
                background: 'rgba(255,255,255,0.18)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.35)',
                borderRadius: 10,
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 14
              }}
            >
              Confirm Orders
            </button>
            <button
              onClick={onGoToReports}
              style={{
                padding: '10px 20px',
                background: 'rgba(255,255,255,0.18)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.35)',
                borderRadius: 10,
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 14
              }}
            >
              Sales Report
            </button>
            <button
              onClick={onLogout}
              style={{
                padding: '10px 20px',
                background: 'white',
                color: theme.titleColor,
                border: 'none',
                borderRadius: 10,
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 14,
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                transition: 'all 0.3s'
              }}
              onMouseOver={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = `0 6px 16px ${theme.titleColor}40`; }}
              onMouseOut={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)'; }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
          {renderStatCard({ icon: '📦', label: 'Total Products', value: products.length, color: theme.accent })}
          {renderStatCard({ icon: '👥', label: 'Registered Users', value: users.length, color: theme.accent })}
          {renderStatCard({ icon: '⚠️', label: 'Low Stock Items', value: lowStockCount, color: '#FF9800' })}
          {renderStatCard({ icon: '💰', label: 'Inventory Value', value: `₱${totalRevenue.toLocaleString()}`, color: theme.accent })}
        </div>

        {/* Main Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
          
          {/* Products Section */}
          <div style={{
            background: theme.cardBg,
            borderRadius: 20,
            padding: 28,
            boxShadow: `0 4px 20px ${theme.btnShadow}`,
            border: `1px solid ${theme.cardBorder}`,
            backdropFilter: 'blur(8px)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: theme.titleColor }}>Product Management</h2>
              <button
                onClick={() => setActiveTab('products')}
                style={{
                  padding: '8px 16px',
                  background: activeTab === 'products' ? theme.btnBg : 'rgba(0,0,0,0.05)',
                  color: activeTab === 'products' ? '#fff' : theme.textPrimary,
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 13,
                  transition: 'all 0.3s'
                }}
              >
                Manage
              </button>
            </div>

            {/* Add/Edit Form */}
            <form onSubmit={handleSubmit} style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              marginBottom: 24,
              padding: 20,
              background: '#f8faf8',
              borderRadius: 14,
              border: `1px solid ${theme.cardBorder}`
            }}>
              {renderField({ label: 'Product name', fullWidth: true, children: (
                <input
                  placeholder="Example: Fresh tomatoes"
                  value={form.productName}
                  onChange={e => setForm({...form, productName: e.target.value})}
                  required
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = theme.inputFocus; e.target.style.boxShadow = `0 0 0 3px ${theme.inputFocus}20`; }}
                  onBlur={e => { e.target.style.borderColor = theme.inputBorder; e.target.style.boxShadow = 'none'; }}
                />
              ) })}
              {renderField({ label: 'Description', fullWidth: true, children: (
                <input
                  placeholder="Example: Locally grown, packed per kilo"
                  value={form.productDescription}
                  onChange={e => setForm({...form, productDescription: e.target.value})}
                  required
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = theme.inputFocus; e.target.style.boxShadow = `0 0 0 3px ${theme.inputFocus}20`; }}
                  onBlur={e => { e.target.style.borderColor = theme.inputBorder; e.target.style.boxShadow = 'none'; }}
                />
              ) })}
              {renderField({ label: 'Product type', children: (
                <select
                  value={form.productType}
                  onChange={e => setForm({...form, productType: Number(e.target.value)})}
                  style={inputStyle}
                >
                  <option value={1}>Crop</option>
                  <option value={2}>Poultry</option>
                </select>
              ) })}
              {renderField({ label: 'Quantity', children: (
                <input
                  type="number"
                  min="0"
                  placeholder="Example: 25"
                  value={form.productQuantity}
                  onChange={e => setForm({...form, productQuantity: e.target.value})}
                  required
                  style={inputStyle}
                />
              ) })}
              {renderField({ label: 'Price', children: (
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Example: 120.00"
                  value={form.price}
                  onChange={e => setForm({...form, price: e.target.value})}
                  required
                  style={inputStyle}
                />
              ) })}
              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 12 }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: `linear-gradient(135deg, ${theme.btnBg} 0%, ${theme.btnHover} 100%)`,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 10,
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: 14,
                    boxShadow: `0 4px 12px ${theme.btnShadow}`,
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = `0 6px 16px ${theme.btnShadow}`; }}
                  onMouseOut={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = `0 4px 12px ${theme.btnShadow}`; }}
                >
                  {isEditing ? 'Update Product' : 'Add Product'}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => { setIsEditing(false); setForm({ id: '', productName: '', productDescription: '', productType: 1, productQuantity: 1, price: 0 }); }}
                    style={{
                      padding: '14px 20px',
                      background: '#f5f5f5',
                      color: '#666',
                      border: '1px solid #ddd',
                      borderRadius: 10,
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: 14
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* Product List */}
            <div style={{ maxHeight: 320, overflowY: 'auto' }}>
              {products.length === 0 ? (
                <p style={{ textAlign: 'center', color: theme.textSecondary, padding: 20 }}>No products yet.</p>
              ) : (
                products.map(p => (
                  <div key={p._id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 16px',
                    background: '#fff',
                    borderRadius: 12,
                    marginBottom: 10,
                    border: `1px solid ${theme.cardBorder}`,
                    transition: 'all 0.3s',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15, color: theme.textPrimary }}>{p.productName}</div>
                      <div style={{ fontSize: 13, color: theme.textSecondary, marginTop: 2 }}>
                        {p.productType === 1 ? '🌱 Crop' : '🥚 Poultry'} • Stock: {p.productQuantity} • ₱{p.price}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => { setForm({ id: p._id, productName: p.productName, productDescription: p.productDescription, productType: p.productType, productQuantity: p.productQuantity, price: p.price }); setIsEditing(true); }}
                        style={{ padding: '8px 12px', background: '#e3f2fd', color: '#1565c0', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 12 }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p._id)}
                        style={{ padding: '8px 12px', background: '#ffebee', color: '#c62828', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 12 }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Users Section */}
          <div style={{
            background: theme.cardBg,
            borderRadius: 20,
            padding: 28,
            boxShadow: `0 4px 20px ${theme.btnShadow}`,
            border: `1px solid ${theme.cardBorder}`,
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: 22, fontWeight: 700, color: theme.titleColor }}>User Management</h2>
            
            <div style={{ flex: 1, overflowY: 'auto', maxHeight: 400 }}>
              {users.length === 0 ? (
                <p style={{ textAlign: 'center', color: theme.textSecondary, padding: 20 }}>No users found.</p>
              ) : (
                users.map(u => (
                  <div key={u._id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 16px',
                    background: '#fff',
                    borderRadius: 12,
                    marginBottom: 10,
                    border: `1px solid ${theme.cardBorder}`,
                    transition: 'all 0.3s',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15, color: theme.textPrimary }}>
                        {u.firstName} {u.lastName}
                      </div>
                      <div style={{ fontSize: 13, color: theme.textSecondary, marginTop: 2 }}>
                        {u.email} • <span style={{
                          padding: '2px 8px',
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 600,
                          background: u.userType === 'Admin' ? '#e3f2fd' : '#e8f5e9',
                          color: u.userType === 'Admin' ? '#1565c0' : '#2e7d32'
                        }}>
                          {u.userType}
                        </span>
                      </div>
                    </div>
                    {u.userType !== 'Admin' && (
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        style={{ padding: '8px 12px', background: '#ffebee', color: '#c62828', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 12 }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
