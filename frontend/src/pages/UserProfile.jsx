import { useState, useEffect } from 'react';
import { getMyOrders, updateUserProfile } from '../api';
import dayImage from '../assets/day.png';
import noonImage from '../assets/noon.png';
import sunsetImage from '../assets/sunset.png';
import nightImage from '../assets/night.png';

export default function UserProfile({ user, onLogout, onGoToProducts, onGoToCart, onGoToOrders, activeTab = 'profile' }) {
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [message, setMessage] = useState('');

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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getMyOrders();
        if (res.success) setOrders(res.orders || []);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
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

  const handleSaveProfile = async () => {
    setMessage('');
    try {
      const res = await updateUserProfile(editForm);
      if (res.success) {
        setMessage('Profile updated successfully!');
        setIsEditing(false);
        // Update localStorage with new user data
        const updatedUser = { ...user, ...editForm };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.location.reload(); // Reload to reflect changes
      } else {
        setMessage(res.message || 'Failed to update profile');
      }
    } catch (err) {
      setMessage('Unable to update profile. Please try again.');
    }
  };

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

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
        
        {/* Header */}
        <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
              Hello, {user?.firstName || user?.email}!
            </h1>
            <p style={{ margin: '8px 0 0 0', fontSize: 15, color: 'rgba(255,255,255,0.9)' }}>
              Manage your profile and view your order history
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={onGoToProducts} style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.35)', borderRadius: 10, cursor: 'pointer', fontWeight: 700 }}>Products</button>
            <button onClick={onGoToCart} style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.35)', borderRadius: 10, cursor: 'pointer', fontWeight: 700 }}>Cart</button>
            <button onClick={onGoToOrders} style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.35)', borderRadius: 10, cursor: 'pointer', fontWeight: 700 }}>Orders</button>
            <button onClick={onLogout} style={{ padding: '10px 16px', background: '#fff', color: theme.titleColor, border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 800 }}>Logout</button>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
          <div style={{
            background: theme.cardBg, borderRadius: 16, padding: '24px',
            boxShadow: `0 4px 16px ${theme.btnShadow}`, border: `1px solid ${theme.cardBorder}`,
            backdropFilter: 'blur(8px)'
          }}>
            <p style={{ margin: '0 0 8px 0', fontSize: 13, color: theme.textSecondary, fontWeight: 500 }}>Total Orders</p>
            <h3 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: theme.titleColor }}>{totalOrders}</h3>
          </div>
          <div style={{
            background: theme.cardBg, borderRadius: 16, padding: '24px',
            boxShadow: `0 4px 16px ${theme.btnShadow}`, border: `1px solid ${theme.cardBorder}`,
            backdropFilter: 'blur(8px)'
          }}>
            <p style={{ margin: '0 0 8px 0', fontSize: 13, color: theme.textSecondary, fontWeight: 500 }}>Total Spent</p>
            <h3 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: theme.titleColor }}>₱{totalSpent.toFixed(2)}</h3>
          </div>
          <div style={{
            background: theme.cardBg, borderRadius: 16, padding: '24px',
            boxShadow: `0 4px 16px ${theme.btnShadow}`, border: `1px solid ${theme.cardBorder}`,
            backdropFilter: 'blur(8px)'
          }}>
            <p style={{ margin: '0 0 8px 0', fontSize: 13, color: theme.textSecondary, fontWeight: 500 }}>Member Since</p>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: theme.titleColor }}>
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </h3>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 24 }}>
          
          {/* Profile Information */}
          <div style={{
            background: theme.cardBg, borderRadius: 20, padding: 28,
            boxShadow: `0 4px 20px ${theme.btnShadow}`, border: `1px solid ${theme.cardBorder}`,
            backdropFilter: 'blur(8px)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: theme.titleColor }}>Profile Information</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    padding: '8px 16px', background: 'rgba(0,0,0,0.05)', color: theme.textPrimary,
                    border: `1px solid ${theme.cardBorder}`, borderRadius: 8, cursor: 'pointer',
                    fontWeight: 600, fontSize: 13, transition: 'all 0.3s'
                  }}
                  onMouseOver={e => e.target.style.background = 'rgba(0,0,0,0.1)'}
                  onMouseOut={e => e.target.style.background = 'rgba(0,0,0,0.05)'}
                >
                  Edit Profile
                </button>
              )}
            </div>

            {message && (
              <div style={{
                marginBottom: 20, padding: '12px 16px',
                background: message.includes('success') ? '#ecfdf5' : '#fef2f2',
                border: `1px solid ${message.includes('success') ? '#a7f3d0' : '#fecaca'}`,
                borderRadius: 10, color: message.includes('success') ? '#047857' : '#b91c1c',
                fontSize: 14, fontWeight: 500
              }}>
                {message}
              </div>
            )}

            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: theme.textSecondary }}>First Name</label>
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={e => setEditForm({ ...editForm, firstName: e.target.value })}
                    style={{
                      width: '100%', padding: '12px 16px', border: `2px solid ${theme.inputBorder}`,
                      borderRadius: 10, fontSize: 14, outline: 'none', background: theme.inputBg,
                      color: '#333', transition: 'all 0.3s', boxSizing: 'border-box'
                    }}
                    onFocus={e => { e.target.style.borderColor = theme.inputFocus; e.target.style.boxShadow = `0 0 0 3px ${theme.inputFocus}20`; }}
                    onBlur={e => { e.target.style.borderColor = theme.inputBorder; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: theme.textSecondary }}>Last Name</label>
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={e => setEditForm({ ...editForm, lastName: e.target.value })}
                    style={{
                      width: '100%', padding: '12px 16px', border: `2px solid ${theme.inputBorder}`,
                      borderRadius: 10, fontSize: 14, outline: 'none', background: theme.inputBg,
                      color: '#333', transition: 'all 0.3s', boxSizing: 'border-box'
                    }}
                    onFocus={e => { e.target.style.borderColor = theme.inputFocus; e.target.style.boxShadow = `0 0 0 3px ${theme.inputFocus}20`; }}
                    onBlur={e => { e.target.style.borderColor = theme.inputBorder; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: theme.textSecondary }}>Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                    style={{
                      width: '100%', padding: '12px 16px', border: `2px solid ${theme.inputBorder}`,
                      borderRadius: 10, fontSize: 14, outline: 'none', background: theme.inputBg,
                      color: '#333', transition: 'all 0.3s', boxSizing: 'border-box'
                    }}
                    onFocus={e => { e.target.style.borderColor = theme.inputFocus; e.target.style.boxShadow = `0 0 0 3px ${theme.inputFocus}20`; }}
                    onBlur={e => { e.target.style.borderColor = theme.inputBorder; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: theme.textSecondary }}>Phone</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="Optional"
                    style={{
                      width: '100%', padding: '12px 16px', border: `2px solid ${theme.inputBorder}`,
                      borderRadius: 10, fontSize: 14, outline: 'none', background: theme.inputBg,
                      color: '#333', transition: 'all 0.3s', boxSizing: 'border-box'
                    }}
                    onFocus={e => { e.target.style.borderColor = theme.inputFocus; e.target.style.boxShadow = `0 0 0 3px ${theme.inputFocus}20`; }}
                    onBlur={e => { e.target.style.borderColor = theme.inputBorder; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: theme.textSecondary }}>Address</label>
                  <textarea
                    value={editForm.address}
                    onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                    placeholder="Optional"
                    rows={3}
                    style={{
                      width: '100%', padding: '12px 16px', border: `2px solid ${theme.inputBorder}`,
                      borderRadius: 10, fontSize: 14, outline: 'none', background: theme.inputBg,
                      color: '#333', transition: 'all 0.3s', boxSizing: 'border-box', resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                    onFocus={e => { e.target.style.borderColor = theme.inputFocus; e.target.style.boxShadow = `0 0 0 3px ${theme.inputFocus}20`; }}
                    onBlur={e => { e.target.style.borderColor = theme.inputBorder; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button
                    onClick={handleSaveProfile}
                    style={{
                      flex: 1, padding: '12px', background: `linear-gradient(135deg, ${theme.btnBg} 0%, ${theme.btnHover} 100%)`,
                      color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer',
                      fontWeight: 700, fontSize: 14, boxShadow: `0 4px 12px ${theme.btnShadow}`,
                      transition: 'all 0.3s'
                    }}
                    onMouseOver={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = `0 6px 16px ${theme.btnShadow}`; }}
                    onMouseOut={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = `0 4px 12px ${theme.btnShadow}`; }}
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => { setIsEditing(false); setEditForm({ firstName: user?.firstName || '', lastName: user?.lastName || '', email: user?.email || '', phone: user?.phone || '', address: user?.address || '' }); setMessage(''); }}
                    style={{
                      padding: '12px 20px', background: '#f5f5f5', color: '#666',
                      border: '1px solid #ddd', borderRadius: 10, cursor: 'pointer',
                      fontWeight: 600, fontSize: 14
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: 13, color: theme.textSecondary, fontWeight: 500 }}>Full Name</p>
                  <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: theme.textPrimary }}>{user?.firstName} {user?.lastName}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: 13, color: theme.textSecondary, fontWeight: 500 }}>Email Address</p>
                  <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: theme.textPrimary }}>{user?.email}</p>
                </div>
                {user?.phone && (
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: 13, color: theme.textSecondary, fontWeight: 500 }}>Phone Number</p>
                    <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: theme.textPrimary }}>{user.phone}</p>
                  </div>
                )}
                {user?.address && (
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: 13, color: theme.textSecondary, fontWeight: 500 }}>Address</p>
                    <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: theme.textPrimary }}>{user.address}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order History */}
          <div style={{
            background: theme.cardBg, borderRadius: 20, padding: 28,
            boxShadow: `0 4px 20px ${theme.btnShadow}`, border: `1px solid ${theme.cardBorder}`,
            backdropFilter: 'blur(8px)'
          }}>
            <h2 style={{ margin: '0 0 24px 0', fontSize: 22, fontWeight: 700, color: theme.titleColor }}>Order History</h2>
            
            {loading ? (
              <div style={{ textAlign: 'center', padding: 40, color: theme.textSecondary }}>Loading orders...</div>
            ) : orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: theme.textSecondary }}>
                <p style={{ margin: '0 0 16px 0', fontSize: 16 }}>No orders yet</p>
                <button
                  onClick={onGoToProducts}
                  style={{
                    padding: '12px 24px', background: theme.btnBg, color: '#fff',
                    border: 'none', borderRadius: 10, cursor: 'pointer',
                    fontWeight: 600, fontSize: 14
                  }}
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 500, overflowY: 'auto' }}>
                {orders.map(order => (
                  <div key={order._id} style={{
                    padding: '16px', background: '#fff', borderRadius: 12,
                    border: `1px solid ${theme.cardBorder}`,
                    transition: 'all 0.3s',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: 14, fontWeight: 700, color: theme.textPrimary }}>
                          Order #{order._id?.substring(0, 8).toUpperCase()}
                        </p>
                        <p style={{ margin: 0, fontSize: 13, color: theme.textSecondary }}>
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <span style={{
                        padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                        background: order.status === 'Delivered' ? '#ecfdf5' : order.status === 'Pending' ? '#fff7ed' : '#fef2f2',
                        color: order.status === 'Delivered' ? '#047857' : order.status === 'Pending' ? '#c2410c' : '#b91c1c',
                        border: `1px solid ${order.status === 'Delivered' ? '#a7f3d0' : order.status === 'Pending' ? '#fed7aa' : '#fecaca'}`
                      }}>
                        {order.status || 'Pending'}
                      </span>
                    </div>
                    <div style={{ borderTop: `1px solid ${theme.cardBorder}`, paddingTop: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ margin: 0, fontSize: 13, color: theme.textSecondary }}>
                          {order.items?.length || 0} item(s)
                        </p>
                        <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: theme.titleColor }}>
                          ₱{order.totalAmount?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
