import { useEffect, useMemo, useState } from 'react';
import { confirmOrder, disapproveOrder, getAllOrders, getAllProducts } from '../api';

const STATUS = {
  0: { label: 'Pending confirmation', bg: '#fff7ed', color: '#c2410c' },
  1: { label: 'Confirmed - ready for delivery', bg: '#ecfdf5', color: '#047857' },
  2: { label: 'Cancelled', bg: '#fef2f2', color: '#b91c1c' }
};

export default function AdminOrders({ onLogout, onBackToDashboard }) {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [statusFilter, setStatusFilter] = useState('0');
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState(null);
  const [disapprovingId, setDisapprovingId] = useState(null);
  const [message, setMessage] = useState('');

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
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
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
    } finally {
      setConfirmingId(null);
    }
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
    } finally {
      setDisapprovingId(null);
    }
  };

  const formatMoney = (value) => `PHP ${Number(value || 0).toFixed(2)}`;

  return (
    <div style={{ minHeight: '100vh', background: '#f6f8f5', color: '#1f2933', padding: 24 }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 30, color: '#1b5e20' }}>Order Confirmation</h1>
            <p style={{ margin: '6px 0 0', color: '#607062' }}>
              Confirm customer orders before they become final and ready for delivery.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={onBackToDashboard} style={secondaryButtonStyle}>Back to Dashboard</button>
            <button onClick={onLogout} style={secondaryButtonStyle}>Logout</button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
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
                  padding: '10px 16px',
                  borderRadius: 8,
                  border: statusFilter === value ? '2px solid #2e7d32' : '1px solid #d8e2d5',
                  background: statusFilter === value ? '#e8f5e9' : '#fff',
                  color: statusFilter === value ? '#1b5e20' : '#435044',
                  cursor: 'pointer',
                  fontWeight: 700
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <button onClick={loadOrders} style={primaryButtonStyle}>Refresh</button>
        </div>

        {message && (
          <div style={{ marginBottom: 16, padding: 14, background: '#fff', border: '1px solid #d8e2d5', borderRadius: 8, color: '#36523a' }}>
            {message}
          </div>
        )}

        <div style={{ background: '#fff', border: '1px solid #d8e2d5', borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 24px rgba(27, 94, 32, 0.08)' }}>
          {loading ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#607062' }}>Loading orders...</div>
          ) : orders.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#607062' }}>No orders found for this filter.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
                <thead style={{ background: '#f1f8e9' }}>
                  <tr>
                    <th style={thStyle}>Transaction</th>
                    <th style={thStyle}>Customer</th>
                    <th style={thStyle}>Product</th>
                    <th style={thStyle}>Qty</th>
                    <th style={thStyle}>Total</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const product = productsById[order.productId];
                    const status = STATUS[order.orderStatus] || STATUS[0];
                    const total = product ? product.price * order.orderQuantity : 0;

                    return (
                      <tr key={order.transactionId} style={{ borderTop: '1px solid #edf2ea' }}>
                        <td style={tdStyle}>
                          <div style={{ fontWeight: 700 }}>{order.transactionId}</div>
                          <div style={{ fontSize: 12, color: '#607062', marginTop: 4 }}>
                            {order.dateOrdered ? new Date(order.dateOrdered).toLocaleDateString() : 'No date'} at {order.time}
                          </div>
                        </td>
                        <td style={tdStyle}>{order.email}</td>
                        <td style={tdStyle}>
                          <div style={{ fontWeight: 700 }}>{product?.productName || 'Unknown product'}</div>
                          <div style={{ fontSize: 12, color: '#607062', marginTop: 4 }}>
                            Stock: {product?.productQuantity ?? 'N/A'} | Unit price: {formatMoney(product?.price)}
                          </div>
                        </td>
                        <td style={tdStyle}>{order.orderQuantity}</td>
                        <td style={tdStyle}>{formatMoney(total)}</td>
                        <td style={tdStyle}>
                          <span style={{ padding: '6px 10px', borderRadius: 999, background: status.bg, color: status.color, fontSize: 12, fontWeight: 700 }}>
                            {status.label}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          {order.orderStatus === 0 ? (
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                              <button
                                onClick={() => handleConfirm(order.transactionId)}
                                disabled={confirmingId === order.transactionId || disapprovingId === order.transactionId}
                                style={{ ...primaryButtonStyle, opacity: confirmingId === order.transactionId ? 0.7 : 1 }}
                              >
                                {confirmingId === order.transactionId ? 'Confirming...' : 'Confirm Order'}
                              </button>
                              <button
                                onClick={() => handleDisapprove(order.transactionId)}
                                disabled={confirmingId === order.transactionId || disapprovingId === order.transactionId}
                                style={{ ...dangerButtonStyle, opacity: disapprovingId === order.transactionId ? 0.7 : 1 }}
                              >
                                {disapprovingId === order.transactionId ? 'Disapproving...' : 'Disapprove'}
                              </button>
                            </div>
                          ) : (
                            <span style={{ color: '#607062', fontSize: 13 }}>No action needed</span>
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

const primaryButtonStyle = {
  padding: '10px 16px',
  background: '#2e7d32',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 700
};

const secondaryButtonStyle = {
  padding: '10px 16px',
  background: '#fff',
  color: '#1b5e20',
  border: '1px solid #cdddcc',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 700
};

const dangerButtonStyle = {
  padding: '10px 16px',
  background: '#b91c1c',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 700
};

const thStyle = {
  padding: 14,
  textAlign: 'left',
  color: '#1b5e20',
  fontSize: 13,
  textTransform: 'uppercase',
  letterSpacing: 0
};

const tdStyle = {
  padding: 14,
  verticalAlign: 'top',
  fontSize: 14
};
