import { useState, useEffect } from 'react';
import { getMyOrders, cancelOrder } from '../api';

export default function MyOrders({ user, onLogout, onViewDetails }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    try {
      const res = await getMyOrders();
      if (res.success) setOrders(res.orders);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleCancel = async (transactionId) => {
    if (!window.confirm('Cancel this order?')) return;
    await cancelOrder({ transactionId });
    loadOrders();
  };

  const getStatusBadge = (status) => {
    const styles = {
      0: { bg: '#fff3cd', color: '#856404', text: '⏳ Pending' },
      1: { bg: '#d4edda', color: '#155724', text: '✅ Completed' },
      2: { bg: '#f8d7da', color: '#721c24', text: '❌ Canceled' }
    };
    return styles[status] || styles[0];
  };

  if (loading) return <div style={{ padding: 40 }}>Loading orders...</div>;

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 900, margin: '0 auto', padding: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 16, borderBottom: '2px solid #eee' }}>
        <h2 style={{ margin: 0, fontSize: 24 }}>📦 My Orders</h2>
        <button onClick={onLogout} style={{ padding: '8px 16px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer' }}>Logout</button>
      </div>

      {/* Orders Table - Wireframe Style */}
      <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8f9fa' }}>
            <tr>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontSize: 14 }}>Transaction ID</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontSize: 14 }}>Date</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontSize: 14 }}>Items</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontSize: 14 }}>Total</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontSize: 14 }}>Status</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontSize: 14 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => {
              const badge = getStatusBadge(order.orderStatus);
              return (
                <tr key={order._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: 12, fontSize: 14, fontFamily: 'monospace' }}>{order.transactionId}</td>
                  <td style={{ padding: 12, fontSize: 14 }}>{new Date(order.dateOrdered).toLocaleDateString()}</td>
                  <td style={{ padding: 12, fontSize: 14 }}>1 item</td>
                  <td style={{ padding: 12, fontWeight: 500 }}>₱{(order.orderQuantity * 100).toFixed(2)}</td>
                  <td style={{ padding: 12 }}>
                    <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 500, background: badge.bg, color: badge.color }}>
                      {badge.text}
                    </span>
                  </td>
                  <td style={{ padding: 12 }}>
                    <button onClick={() => onViewDetails?.(order.transactionId)} style={{ marginRight: 8, padding: '4px 12px', background: '#e9ecef', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>View</button>
                    {order.orderStatus === 0 && (
                      <button onClick={() => handleCancel(order.transactionId)} style={{ padding: '4px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>Cancel</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>
            <p>No orders yet</p>
            <button onClick={() => window.location.reload()} style={{ marginTop: 12, padding: '8px 20px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Start Shopping</button>
          </div>
        )}
      </div>

      {/* Wireframe Annotation */}
      <div style={{ marginTop: 24, padding: 12, background: '#e7f3ff', border: '1px dashed #2196F3', borderRadius: 4, fontSize: 13, color: '#0d47a1' }}>
        💡 <strong>Wireframe Note:</strong> Table uses consistent 12px padding. In production, add pagination and expandable row details.
      </div>
    </div>
  );
}