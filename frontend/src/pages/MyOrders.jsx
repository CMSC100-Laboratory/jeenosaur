import { useEffect, useState } from 'react';
import { cancelOrder, getMyOrders } from '../api';
import dayImage from '../assets/day.png';
import noonImage from '../assets/noon.png';
import sunsetImage from '../assets/sunset.png';
import nightImage from '../assets/night.png';
import logoImage from '../assets/site.png';

const statusMeta = {
  0: { label: 'Pending', bg: '#fff7ed', color: '#c2410c' },
  1: { label: 'Completed', bg: '#ecfdf5', color: '#047857' },
  2: { label: 'Cancelled', bg: '#fef2f2', color: '#b91c1c' }
};

export default function MyOrders({ user, onLogout, onGoToProducts, onGoToCart, onGoToOrders, onGoToProfile, activeTab = 'orders' }) {
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const themes = {
    morning: { bg: `url(${dayImage})`, overlay: 'linear-gradient(135deg, rgba(27, 94, 32, 0.55) 0%, rgba(46, 125, 50, 0.4) 100%)', accent: '#81C784', panelBg: '#F1F8E9', titleColor: '#1B5E20', textPrimary: '#2E7D32', btnBg: '#2E7D32', btnShadow: 'rgba(46, 125, 50, 0.3)', logoutColor: '#1b5e20', navBtnBorder: 'rgba(255,255,255,0.3)', navBtnBg: 'rgba(255,255,255,0.15)' },
    noon: { bg: `url(${noonImage})`, overlay: 'linear-gradient(135deg, rgba(27, 94, 32, 0.5) 0%, rgba(76, 175, 80, 0.35) 100%)', accent: '#66BB6A', panelBg: '#E8F5E9', titleColor: '#1B5E20', textPrimary: '#2E7D32', btnBg: '#2E7D32', btnShadow: 'rgba(46, 125, 50, 0.3)', logoutColor: '#2e7d32', navBtnBorder: 'rgba(255,255,255,0.3)', navBtnBg: 'rgba(255,255,255,0.15)' },
    sunset: { bg: `url(${sunsetImage})`, overlay: 'linear-gradient(135deg, rgba(27, 94, 32, 0.65) 0%, rgba(85, 139, 47, 0.5) 50%, rgba(178, 223, 138, 0.25) 100%)', accent: '#AED581', panelBg: '#F1F8E9', titleColor: '#1B5E20', textPrimary: '#2E7D32', btnBg: '#2E7D32', btnShadow: 'rgba(46, 125, 50, 0.3)', logoutColor: '#1b5e20', navBtnBorder: 'rgba(255,255,255,0.3)', navBtnBg: 'rgba(255,255,255,0.15)' },
    night: { bg: `url(${nightImage})`, overlay: 'linear-gradient(135deg, rgba(13, 71, 161, 0.6) 0%, rgba(46, 125, 50, 0.5) 100%)', accent: '#64B5F6', panelBg: '#E3F2FD', titleColor: '#1B5E20', textPrimary: '#2E7D32', btnBg: '#2E7D32', btnShadow: 'rgba(46, 125, 50, 0.3)', logoutColor: '#1565C0', navBtnBorder: 'rgba(255,255,255,0.3)', navBtnBg: 'rgba(255,255,255,0.15)' }
  };
  const theme = themes[timeOfDay];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getMyOrders();
      if (data.success) setOrders(data.orders || []);
    } catch (err) {
      console.error('Failed to load orders', err);
      setMessage('Unable to load orders.');
    } finally {
      setLoading(false);
    }
  };

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
    if (user) fetchOrders();
    return () => clearInterval(interval);
  }, [user]);

  const handleCancel = async (transactionId) => {
    if (!window.confirm('Cancel this pending order?')) return;
    const res = await cancelOrder({ transactionId });
    setMessage(res.message || (res.success ? 'Order cancelled.' : 'Unable to cancel order.'));
    if (res.success) fetchOrders();
  };

  const goTo = { Products: onGoToProducts, Cart: onGoToCart, Orders: onGoToOrders, Profile: onGoToProfile };

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: `linear-gradient(135deg, ${theme.panelBg} 0%, #ffffff 100%)`, minHeight: '100vh', paddingBottom: 40 }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: theme.bg, backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: `0 4px 24px ${theme.btnShadow}`, borderBottom: `3px solid ${theme.accent}` }}>
        <div style={{ position: 'absolute', inset: 0, background: theme.overlay }}></div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1280, margin: '0 auto', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={logoImage} alt="AniWay" style={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 10 }} />
            <div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#fff' }}>AniWay</h1>
              <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase' }}>Farm to Table</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {['Products', 'Cart', 'Orders', 'Profile'].map((item) => {
              const isCurrent = activeTab === item.toLowerCase();
              return <button key={item} onClick={goTo[item]} style={{ padding: '10px 18px', background: isCurrent ? 'rgba(255,255,255,0.2)' : theme.navBtnBg, color: '#fff', border: `2px solid ${isCurrent ? theme.accent : theme.navBtnBorder}`, borderRadius: 12, cursor: 'pointer', fontWeight: 700 }}>{item}</button>;
            })}
            <button onClick={onLogout} style={{ padding: '10px 20px', background: 'white', color: theme.logoutColor, border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 800 }}>Logout</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 32 }}>
        <h2 style={{ margin: '0 0 24px 0', fontSize: 32, fontWeight: 800, color: theme.titleColor }}>Order History</h2>
        {message && <div style={{ marginBottom: 16, padding: 12, background: '#fff', borderRadius: 8, color: '#36523a' }}>{message}</div>}
        {loading ? <p>Loading orders...</p> : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, background: 'white', borderRadius: 20 }}>
            <p>No orders yet.</p>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: `0 4px 20px ${theme.btnShadow}` }}>
            {orders.map(order => {
              const status = statusMeta[order.orderStatus] || statusMeta[0];
              return (
                <div key={order._id} style={{ padding: 24, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', gap: 20 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 16, color: theme.textPrimary }}>{order.transactionId}</span>
                      <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: status.bg, color: status.color }}>{status.label}</span>
                    </div>
                    <p style={{ margin: '0 0 4px', color: '#555', fontWeight: 600 }}>{order.product?.productName || 'Product unavailable'}</p>
                    <p style={{ margin: 0, color: '#888', fontSize: 14 }}>
                      {order.dateOrdered ? new Date(order.dateOrdered).toLocaleDateString() : 'N/A'} | Qty: {order.orderQuantity}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: theme.textPrimary }}>PHP {Number(order.totalAmount || 0).toFixed(2)}</div>
                    {order.orderStatus === 0 && (
                      <button onClick={() => handleCancel(order.transactionId)} style={{ marginTop: 10, padding: '8px 12px', background: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>Cancel</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
