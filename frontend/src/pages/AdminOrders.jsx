import { useEffect, useMemo, useState } from 'react';
import { confirmOrder, disapproveOrder, getAllOrders, getAllProducts } from '../api';
import dayImage from '../assets/day.png';
import noonImage from '../assets/noon.png';
import sunsetImage from '../assets/sunset.png';
import nightImage from '../assets/night.png';

const STATUS = {
  0: { label: 'Pending Confirmation', bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
  1: { label: 'Confirmed - Ready for Delivery', bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' },
  2: { label: 'Cancelled', bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' }
};

export default function AdminOrders({ onLogout, onBackToDashboard }) {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [statusFilter, setStatusFilter] = useState('0');
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState(null);
  const [disapprovingId, setDisapprovingId] = useState(null);
  const [message, setMessage] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('morning');

  // Time-based theme logic
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

  // Theme definitions
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

  const productsById = useMemo(() => {
    return products.reduce((map, product) => {
      map[product._id] = product;
      return map;
    }, {});
  }, [products]);

  const loadOrders = async () => {
    setLoading(true);
    setMessage('');
    try {
      const [ordersRes, productsRes] = await Promise.all([
        getAllOrders(statusFilter === 'all' ? undefined : statusFilter),
        getAllProducts()
      ]);
      setOrders(ordersRes.orders || []);
      setProducts(productsRes || []);
    } catch (err) {
      console.error('Failed to load admin orders:', err);
      setMessage('Unable to load orders. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getAllOrders(statusFilter === 'all' ? undefined : statusFilter),
      getAllProducts()
    ])
      .then(([ordersRes, productsRes]) => {
        if (cancelled) return;
        setOrders(ordersRes.orders || []);
        setProducts(productsRes || []);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Failed to load admin orders:', err);
        setMessage('Unable to load orders. Please check if the backend is running.');
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [statusFilter]);

  const handleConfirm = async (transactionId) => {
    if (!window.confirm('Confirm this customer order? This makes it final and ready for delivery.')) return;
    setConfirmingId(transactionId);
    setMessage('');
    try {
      const res = await confirmOrder({ transactionId });
      setMessage(res.message || (res.success ? 'Order confirmed.' : 'Could not confirm order.'));
      if (res.success) await loadOrders();
    } catch (err) {
      console.error('Failed to confirm order:', err);
      setMessage('Unable to confirm order. Please try again.');
    } finally { setConfirmingId(null); }
  };

  const handleDisapprove = async (transactionId) => {
    if (!window.confirm('Disapprove this customer order? This will cancel the order.')) return;
    setDisapprovingId(transactionId);
    setMessage('');
    try {
      const res = await disapproveOrder({ transactionId });
      setMessage(res.message || (res.success ? 'Order disapproved.' : 'Could not disapprove order.'));
      if (res.success) await loadOrders();
    } catch (err) {
      console.error('Failed to disapprove order:', err);
      setMessage('Unable to disapprove order. Please try again.');
    } finally { setDisapprovingId(null); }
  };

  const formatMoney = (value) => `₱${Number(value || 0).toFixed(2)}`;

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
      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1320, margin: '0 auto', padding: '24px 32px' }}>
        
        {/* Header */}
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
          <div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>Order Management</h1>
            <p style={{ margin: '4px 0 0 0', fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>Review, confirm, or cancel customer transactions</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={onBackToDashboard}
              style={{
                padding: '10px 16px', background: 'rgba(255,255,255,0.15)', color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)', borderRadius: 10, cursor: 'pointer',
                fontWeight: 600, fontSize: 13, backdropFilter: 'blur(8px)', transition: 'all 0.3s'
              }}
              onMouseOver={e => e.target.style.background = 'rgba(255,255,255,0.25)'}
              onMouseOut={e => e.target.style.background = 'rgba(255,255,255,0.15)'}
            >
              ← Back to Dashboard
            </button>
            <button
              onClick={onLogout}
              style={{
                padding: '10px 20px', background: 'white', color: theme.titleColor,
                border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700,
                fontSize: 14, boxShadow: '0 4px 12px rgba(0,0,0,0.2)', transition: 'all 0.3s'
              }}
              onMouseOver={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = `0 6px 16px ${theme.titleColor}40`; }}
              onMouseOut={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)'; }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              ['0', 'Pending'],
              ['1', 'Confirmed'],
              ['2', 'Cancelled'],
              ['all', 'All Orders']
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => {
                  setLoading(true);
                  setMessage('');
                  setStatusFilter(value);
                }}
                style={{
                  padding: '10px 18px',
                  borderRadius: 10,
                  border: statusFilter === value ? `2px solid ${theme.accent}` : '1px solid rgba(255,255,255,0.3)',
                  background: statusFilter === value ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 13,
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.3s'
                }}
                onMouseOver={e => {
                  if (statusFilter !== value) e.target.style.background = 'rgba(255,255,255,0.2)';
                }}
                onMouseOut={e => {
                  if (statusFilter !== value) e.target.style.background = 'rgba(255,255,255,0.1)';
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={loadOrders}
            style={{
              padding: '10px 20px',
              background: `linear-gradient(135deg, ${theme.btnBg} 0%, ${theme.btnHover} 100%)`,
              color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer',
              fontWeight: 600, fontSize: 14, boxShadow: `0 4px 12px ${theme.btnShadow}`,
              transition: 'all 0.3s'
            }}
            onMouseOver={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = `0 6px 16px ${theme.btnShadow}`; }}
            onMouseOut={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = `0 4px 12px ${theme.btnShadow}`; }}
          >
            Refresh Data
          </button>
        </div>

        {/* Message Banner */}
        {message && (
          <div style={{
            marginBottom: 20, padding: '14px 18px',
            background: message.includes('Unable') || message.includes('Failed') ? '#fef2f2' : '#ecfdf5',
            border: `1px solid ${message.includes('Unable') || message.includes('Failed') ? '#fecaca' : '#a7f3d0'}`,
            borderRadius: 12, color: message.includes('Unable') || message.includes('Failed') ? '#b91c1c' : '#047857',
            fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 10
          }}>
            <span style={{ fontSize: 16 }}>{message.includes('Unable') || message.includes('Failed') ? '⚠️' : '✓'}</span>
            {message}
          </div>
        )}

        {/* Table Container */}
        <div style={{
          background: theme.cardBg,
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: `0 4px 20px ${theme.btnShadow}`,
          border: `1px solid ${theme.cardBorder}`,
          backdropFilter: 'blur(8px)'
        }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: theme.textSecondary }}>Loading orders...</div>
          ) : orders.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: theme.textSecondary }}>No orders found for this filter.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 950 }}>
                <thead style={{ background: 'rgba(0,0,0,0.03)' }}>
                  <tr>
                    <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Transaction</th>
                    <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Customer</th>
                    <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Product</th>
                    <th style={{ padding: '14px 20px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Qty</th>
                    <th style={{ padding: '14px 20px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total</th>
                    <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                    <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const product = productsById[order.productId];
                    const status = STATUS[order.orderStatus] || STATUS[0];
                    const total = product ? product.price * order.orderQuantity : 0;
                    const isPending = order.orderStatus === 0;
                    const isActionDisabled = confirmingId === order.transactionId || disapprovingId === order.transactionId;

                    return (
                      <tr key={order.transactionId} style={{ borderTop: `1px solid ${theme.cardBorder}`, transition: 'background 0.2s' }}
                        onMouseOver={e => e.currentTarget.style.background = 'rgba(0,0,0,0.02)'}
                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                        
                        <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: theme.textPrimary }}>{order.transactionId}</div>
                          <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 4 }}>
                            {order.dateOrdered ? new Date(order.dateOrdered).toLocaleDateString() : 'No date'} {order.time ? `at ${order.time}` : ''}
                          </div>
                        </td>

                        <td style={{ padding: '16px 20px', verticalAlign: 'middle', color: theme.textSecondary, fontSize: 14 }}>
                          {order.email}
                        </td>

                        <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                          <div style={{ fontWeight: 600, fontSize: 14, color: theme.textPrimary }}>{product?.productName || 'Unknown Product'}</div>
                          <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 4 }}>
                            Stock: {product?.productQuantity ?? 'N/A'} • Unit: {formatMoney(product?.price)}
                          </div>
                        </td>

                        <td style={{ padding: '16px 20px', textAlign: 'right', color: theme.textSecondary, fontSize: 14, verticalAlign: 'middle' }}>
                          {order.orderQuantity}
                        </td>

                        <td style={{ padding: '16px 20px', textAlign: 'right', fontWeight: 700, color: theme.textPrimary, fontSize: 14, verticalAlign: 'middle' }}>
                          {formatMoney(total)}
                        </td>

                        <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '5px 10px',
                            borderRadius: 20,
                            background: status.bg,
                            color: status.color,
                            border: `1px solid ${status.border}`,
                            fontSize: 12,
                            fontWeight: 600,
                            whiteSpace: 'nowrap'
                          }}>
                            {status.label}
                          </span>
                        </td>

                        <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                          {isPending ? (
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                              <button
                                onClick={() => handleConfirm(order.transactionId)}
                                disabled={isActionDisabled}
                                style={{
                                  padding: '8px 14px',
                                  background: isActionDisabled ? '#d1d5db' : `linear-gradient(135deg, ${theme.btnBg} 0%, ${theme.btnHover} 100%)`,
                                  color: '#fff', border: 'none', borderRadius: 8, cursor: isActionDisabled ? 'not-allowed' : 'pointer',
                                  fontWeight: 600, fontSize: 12, opacity: isActionDisabled ? 0.7 : 1, transition: 'all 0.3s'
                                }}
                              >
                                {confirmingId === order.transactionId ? 'Processing...' : 'Confirm'}
                              </button>
                              <button
                                onClick={() => handleDisapprove(order.transactionId)}
                                disabled={isActionDisabled}
                                style={{
                                  padding: '8px 14px',
                                  background: isActionDisabled ? '#d1d5db' : '#ef4444',
                                  color: '#fff', border: 'none', borderRadius: 8, cursor: isActionDisabled ? 'not-allowed' : 'pointer',
                                  fontWeight: 600, fontSize: 12, opacity: isActionDisabled ? 0.7 : 1, transition: 'all 0.3s'
                                }}
                                onMouseOver={e => { if (!isActionDisabled) e.target.style.background = '#dc2626'; }}
                                onMouseOut={e => { if (!isActionDisabled) e.target.style.background = '#ef4444'; }}
                              >
                                {disapprovingId === order.transactionId ? 'Processing...' : 'Cancel'}
                              </button>
                            </div>
                          ) : (
                            <span style={{ color: theme.textSecondary, fontSize: 13, fontStyle: 'italic' }}>No action needed</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}