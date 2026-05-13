import { useState, useEffect } from 'react';
import { getSalesReport } from '../api';
import dayImage from '../assets/day.png';
import noonImage from '../assets/noon.png';
import sunsetImage from '../assets/sunset.png';
import nightImage from '../assets/night.png';

export default function SalesReport({ onLogout, onBackToDashboard }) {
  const [report, setReport] = useState(null);
  const [period, setPeriod] = useState('annual');
  const [loading, setLoading] = useState(true);
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

  // Data fetching
  useEffect(() => { loadReport(); }, [period]);

  const loadReport = async () => {
    setLoading(true);
    try {
      const res = await getSalesReport(period);
      if (res.success) setReport(res);
    } catch (err) { console.error('Failed to load report:', err); }
    setLoading(false);
  };

  // Theme definitions (matches AdminDashboard)
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
  const uniqueProducts = new Set(report?.report?.map(r => r.productName) || []).size;

  // Reusable Stat Card
  const StatCard = ({ label, value }) => (
    <div style={{
      background: theme.cardBg,
      borderRadius: 16,
      padding: '24px',
      boxShadow: `0 4px 16px ${theme.btnShadow}`,
      border: `1px solid ${theme.cardBorder}`,
      backdropFilter: 'blur(8px)',
      transition: 'transform 0.3s ease'
    }}>
      <p style={{ margin: '0 0 8px 0', fontSize: 13, color: theme.textSecondary, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
      <h3 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: theme.titleColor }}>{value}</h3>
    </div>
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: theme.panelBg, color: theme.textSecondary }}>
        Loading sales data...
      </div>
    );
  }

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
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>Sales Analytics</h1>
            <p style={{ margin: '4px 0 0 0', fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>Revenue insights and transaction history</p>
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
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: 500 }}>Reporting Period:</span>
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            style={{
              padding: '10px 16px', borderRadius: 10, border: `2px solid rgba(255,255,255,0.3)`,
              background: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: 500, cursor: 'pointer',
              outline: 'none', color: '#333', transition: 'all 0.3s', minWidth: 140
            }}
            onFocus={e => { e.target.style.borderColor = theme.accent; e.target.style.boxShadow = `0 0 0 3px ${theme.accent}30`; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.3)'; e.target.style.boxShadow = 'none'; }}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="annual">Annual</option>
          </select>
          <button
            onClick={loadReport}
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
          <button
            style={{
              padding: '10px 20px', background: 'rgba(255,255,255,0.15)', color: '#fff',
              border: '1px solid rgba(255,255,255,0.3)', borderRadius: 10, cursor: 'pointer',
              fontWeight: 600, fontSize: 14, backdropFilter: 'blur(8px)', transition: 'all 0.3s'
            }}
            onMouseOver={e => e.target.style.background = 'rgba(255,255,255,0.25)'}
            onMouseOut={e => e.target.style.background = 'rgba(255,255,255,0.15)'}
          >
            Export CSV
          </button>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
          <StatCard label="Total Sales" value={`₱${(report?.totalSales || 0).toFixed(2)}`} />
          <StatCard label="Transactions" value={report?.report?.length || 0} />
          <StatCard label="Active Products" value={uniqueProducts} />
          <StatCard label="Period" value={period.charAt(0).toUpperCase() + period.slice(1)} />
        </div>

        {/* Data Table */}
        <div style={{ background: theme.cardBg, borderRadius: 16, overflow: 'hidden', boxShadow: `0 4px 20px ${theme.btnShadow}`, border: `1px solid ${theme.cardBorder}`, backdropFilter: 'blur(8px)' }}>
          <div style={{ padding: '20px 24px', borderBottom: `1px solid ${theme.cardBorder}` }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: theme.titleColor }}>Sales Breakdown</h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: 'rgba(0,0,0,0.03)' }}>
                <tr>
                  <th style={{ padding: '14px 24px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Product</th>
                  <th style={{ padding: '14px 24px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category</th>
                  <th style={{ padding: '14px 24px', textAlign: 'right', fontSize: 13, fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quantity Sold</th>
                  <th style={{ padding: '14px 24px', textAlign: 'right', fontSize: 13, fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Revenue</th>
                  <th style={{ padding: '14px 24px', textAlign: 'right', fontSize: 13, fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Share</th>
                </tr>
              </thead>
              <tbody>
                {report?.report?.map((item, idx) => {
                  const percent = report.totalSales > 0 ? ((item.totalIncome / report.totalSales) * 100).toFixed(1) : 0;
                  return (
                    <tr key={idx} style={{ borderBottom: `1px solid ${theme.cardBorder}`, transition: 'background 0.2s' }}
                      onMouseOver={e => e.currentTarget.style.background = 'rgba(0,0,0,0.02)'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '14px 24px', fontWeight: 600, color: theme.textPrimary }}>{item.productName}</td>
                      <td style={{ padding: '14px 24px', color: theme.textSecondary }}>
                        <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: item.productType === 1 ? '#e8f5e9' : '#fff3e0', color: item.productType === 1 ? '#2e7d32' : '#e65100' }}>
                          {item.productType === 1 ? 'Crop' : 'Poultry'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 24px', textAlign: 'right', color: theme.textSecondary }}>{item.totalQuantitySold}</td>
                      <td style={{ padding: '14px 24px', textAlign: 'right', fontWeight: 600, color: theme.textPrimary }}>₱{item.totalIncome.toFixed(2)}</td>
                      <td style={{ padding: '14px 24px', textAlign: 'right', color: theme.textSecondary }}>{percent}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {(!report?.report || report.report.length === 0) && (
              <div style={{ padding: '40px 24px', textAlign: 'center', color: theme.textSecondary }}>
                <p style={{ margin: 0, fontSize: 15 }}>No sales data available for the selected period.</p>
              </div>
            )}
          </div>
        </div>

        {/* Chart Placeholder */}
        <div style={{ marginTop: 24, padding: '32px', background: theme.cardBg, borderRadius: 16, textAlign: 'center', border: `1px solid ${theme.cardBorder}`, backdropFilter: 'blur(8px)' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(0,0,0,0.05)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.textSecondary }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
          </div>
          <p style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: 600, color: theme.titleColor }}>Sales Trend Visualization</p>
          <p style={{ margin: 0, fontSize: 14, color: theme.textSecondary }}>Interactive charts will be integrated in the next development phase.</p>
        </div>

      </div>
    </div>
  );
}