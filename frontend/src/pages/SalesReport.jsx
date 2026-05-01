import { useState, useEffect } from 'react';
import { getSalesReport } from '../api';

export default function SalesReport({ user, onLogout }) {
  const [report, setReport] = useState(null);
  const [period, setPeriod] = useState('annual');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadReport(); }, [period]);

  const loadReport = async () => {
    try {
      const res = await getSalesReport(period);
      if (res.success) setReport(res);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  if (loading) return <div style={{ padding: 40 }}>Loading report...</div>;

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 1100, margin: '0 auto', padding: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 24 }}>📈 Sales Report</h2>
        <button onClick={onLogout} style={{ padding: '8px 16px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer' }}>Logout</button>
      </div>

      {/* Filters - Wireframe Controls */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <select value={period} onChange={(e) => setPeriod(e.target.value)} style={{ padding: '8px 12px', borderRadius: 4, border: '1px solid #ddd' }}>
          <option value="weekly">🗓️ Weekly</option>
          <option value="monthly">📅 Monthly</option>
          <option value="annual">📆 Annual</option>
        </select>
        <button onClick={loadReport} style={{ padding: '8px 20px', background: '#2196F3', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Refresh</button>
        <button style={{ padding: '8px 20px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer' }}>📥 Export CSV</button>
      </div>

      {/* Summary Cards - Wireframe Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ padding: 20, background: '#f9f9f9', border: '1px solid #e0e0e0', borderRadius: 8 }}>
          <p style={{ margin: '0 0 8px', color: '#666', fontSize: 14 }}>Total Sales</p>
          <p style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>₱{(report?.totalSales || 0).toFixed(2)}</p>
        </div>
        <div style={{ padding: 20, background: '#f9f9f9', border: '1px solid #e0e0e0', borderRadius: 8 }}>
          <p style={{ margin: '0 0 8px', color: '#666', fontSize: 14 }}>Transactions</p>
          <p style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>{report?.report?.length || 0}</p>
        </div>
        <div style={{ padding: 20, background: '#f9f9f9', border: '1px solid #e0e0e0', borderRadius: 8 }}>
          <p style={{ margin: '0 0 8px', color: '#666', fontSize: 14 }}>Period</p>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 500, textTransform: 'capitalize' }}>{period}</p>
        </div>
      </div>

      {/* Data Table - Wireframe Style */}
      <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8f9fa' }}>
            <tr>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontSize: 14 }}>Product</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontSize: 14 }}>Type</th>
              <th style={{ padding: 12, textAlign: 'right', borderBottom: '1px solid #e0e0e0', fontSize: 14 }}>Qty Sold</th>
              <th style={{ padding: 12, textAlign: 'right', borderBottom: '1px solid #e0e0e0', fontSize: 14 }}>Revenue</th>
              <th style={{ padding: 12, textAlign: 'right', borderBottom: '1px solid #e0e0e0', fontSize: 14 }}>% of Total</th>
            </tr>
          </thead>
          <tbody>
            {report?.report?.map((item, idx) => {
              const percent = report.totalSales > 0 ? ((item.totalIncome / report.totalSales) * 100).toFixed(1) : 0;
              return (
                <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: 12, fontWeight: 500 }}>{item.productName}</td>
                  <td style={{ padding: 12, color: '#666' }}>{item.productType === 1 ? '🌾 Crop' : '🐔 Poultry'}</td>
                  <td style={{ padding: 12, textAlign: 'right' }}>{item.totalQuantitySold}</td>
                  <td style={{ padding: 12, textAlign: 'right', fontWeight: 500 }}>₱{item.totalIncome.toFixed(2)}</td>
                  <td style={{ padding: 12, textAlign: 'right', color: '#666' }}>{percent}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {(!report?.report || report.report.length === 0) && (
          <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>
            <p>No sales data for this period</p>
          </div>
        )}
      </div>

      {/* Chart Placeholder - Wireframe */}
      <div style={{ marginTop: 24, padding: 40, background: '#f9f9f9', border: '2px dashed #ddd', borderRadius: 8, textAlign: 'center', color: '#999' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
        <p style={{ margin: 0 }}>Sales Trend Chart Placeholder</p>
        <p style={{ margin: '8px 0 0', fontSize: 13 }}>→ Integrate Chart.js or Recharts in hi-fi phase</p>
      </div>

      {/* Wireframe Annotation */}
      <div style={{ marginTop: 24, padding: 12, background: '#e8f5e9', border: '1px dashed #4CAF50', borderRadius: 4, fontSize: 13, color: '#2e7d32' }}>
        💡 <strong>Wireframe Note:</strong> Export buttons and interactive charts are stubs. Focus on data structure first.
      </div>
    </div>
  );
}