import { useState, useEffect } from 'react';
import { getAllProducts, addToCart } from '../api';
import dayImage from '../assets/day.png';
import noonImage from '../assets/noon.png';
import sunsetImage from '../assets/sunset.png';
import nightImage from '../assets/night.png';

// ✅ Accept activeTab prop
export default function ProductList({ user, onLogout, onCartUpdate, onGoToProducts, onGoToCart, onGoToOrders, activeTab = 'products' }) {
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('productName');
  const [order, setOrder] = useState('asc');
  const [addingToCart, setAddingToCart] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [cartCount, setCartCount] = useState(0);

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
    getAllProducts(sortBy, order).then(setProducts).catch(console.error);
    if (user?.id) loadCartCount();
  }, [sortBy, order, user]);

  const loadCartCount = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch('http://localhost:3001/get-cart', {
        headers: { 'Content-Type': 'application/json', 'x-user-id': user.id }
      });
      const data = await res.json();
      if (data.success) setCartCount(data.totalItems);
    } catch (err) { console.error('Cart load failed:', err); }
  };

  const handleAddToCart = async (productId) => {
    if (addingToCart === productId) return;
    setAddingToCart(productId);
    try {
      const res = await addToCart({ productId, quantity: 1 });
      if (res.success) {
        onCartUpdate?.();
        loadCartCount();
      } else {
        alert('Failed: ' + (res.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setAddingToCart(null);
    }
  };

  const getStockStatus = (qty) => {
    if (qty <= 0) return { text: 'Out of Stock', color: '#c62828', bg: '#ffebee', disabled: true, badge: 'OUT OF STOCK', badgeColor: '#c62828' };
    if (qty <= 5) return { text: `Only ${qty} left`, color: '#ef6c00', bg: '#fff3e0', disabled: false, badge: 'LOW STOCK', badgeColor: '#ff9800' };
    return { text: 'In Stock', color: '#2e7d32', bg: '#e8f5e9', disabled: false, badge: null, badgeColor: '#4CAF50' };
  };

  const filteredProducts = products.filter(p => 
    p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.productDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const themes = {
    morning: {
      bg: `url(${dayImage})`,
      overlay: 'linear-gradient(135deg, rgba(27, 94, 32, 0.55) 0%, rgba(46, 125, 50, 0.4) 100%)',
      accent: '#81C784', panelBg: '#F1F8E9', titleColor: '#1B5E20',
      textPrimary: '#2E7D32', textSecondary: '#666666',
      inputBg: '#FFFFFF', inputBorder: '#E0E0E0', inputFocus: '#4CAF50',
      btnBg: '#2E7D32', btnHover: '#1B5E20', btnShadow: 'rgba(46, 125, 50, 0.3)',
      linkColor: '#2E7D32', logoutColor: '#1b5e20',
      navBtnBorder: 'rgba(255,255,255,0.3)', navBtnBg: 'rgba(255,255,255,0.15)', navBtnActive: 'rgba(255,255,255,0.35)'
    },
    noon: {
      bg: `url(${noonImage})`,
      overlay: 'linear-gradient(135deg, rgba(27, 94, 32, 0.5) 0%, rgba(76, 175, 80, 0.35) 100%)',
      accent: '#66BB6A', panelBg: '#E8F5E9', titleColor: '#1B5E20',
      textPrimary: '#2E7D32', textSecondary: '#666666',
      inputBg: '#FFFFFF', inputBorder: '#E0E0E0', inputFocus: '#43A047',
      btnBg: '#2E7D32', btnHover: '#1B5E20', btnShadow: 'rgba(46, 125, 50, 0.3)',
      linkColor: '#2E7D32', logoutColor: '#2e7d32',
      navBtnBorder: 'rgba(255,255,255,0.3)', navBtnBg: 'rgba(255,255,255,0.15)', navBtnActive: 'rgba(255,255,255,0.35)'
    },
    sunset: {
      bg: `url(${sunsetImage})`,
      overlay: 'linear-gradient(135deg, rgba(27, 94, 32, 0.65) 0%, rgba(85, 139, 47, 0.5) 50%, rgba(178, 223, 138, 0.25) 100%)',
      accent: '#AED581', panelBg: '#F1F8E9', titleColor: '#1B5E20',
      textPrimary: '#2E7D32', textSecondary: '#666666',
      inputBg: '#FFFFFF', inputBorder: '#E0E0E0', inputFocus: '#4CAF50',
      btnBg: '#2E7D32', btnHover: '#1B5E20', btnShadow: 'rgba(46, 125, 50, 0.3)',
      linkColor: '#2E7D32', logoutColor: '#1b5e20',
      navBtnBorder: 'rgba(255,255,255,0.3)', navBtnBg: 'rgba(255,255,255,0.15)', navBtnActive: 'rgba(255,255,255,0.35)'
    },
    night: {
      bg: `url(${nightImage})`,
      overlay: 'linear-gradient(135deg, rgba(13, 71, 161, 0.6) 0%, rgba(46, 125, 50, 0.5) 100%)',
      accent: '#64B5F6', panelBg: '#E3F2FD', titleColor: '#1B5E20',
      textPrimary: '#2E7D32', textSecondary: '#666666',
      inputBg: '#FFFFFF', inputBorder: '#E0E0E0', inputFocus: '#4CAF50',
      btnBg: '#2E7D32', btnHover: '#1B5E20', btnShadow: 'rgba(46, 125, 50, 0.3)',
      linkColor: '#2E7D32', logoutColor: '#1565C0',
      navBtnBorder: 'rgba(255,255,255,0.3)', navBtnBg: 'rgba(255,255,255,0.15)', navBtnActive: 'rgba(255,255,255,0.35)'
    }
  };

  const theme = themes[timeOfDay];

  return (
    <div style={{ 
      fontFamily: "'Inter', system-ui, sans-serif", 
      background: `linear-gradient(135deg, ${theme.panelBg} 0%, #ffffff 100%)`,
      minHeight: '100vh',
      paddingBottom: 40
    }}>

      {/* NAVIGATION BAR */}
      <div style={{ 
        position: 'relative',
        background: theme.bg,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: `0 4px 24px ${theme.btnShadow}`,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: `3px solid ${theme.accent}`,
        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: theme.overlay, transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
        
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1280, margin: '0 auto', padding: '20px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ 
                width: 54, height: 54, background: 'rgba(255,255,255,0.25)', borderRadius: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32,
                backdropFilter: 'blur(12px)', border: '2px solid rgba(255,255,255,0.4)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
              }}>🌾</div>
              <div>
                <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-1px', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>AniWay</h1>
                <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.95)', fontWeight: 500 }}>Farm to Table</p>
              </div>
            </div>

            {/* Search Bar */}
            <div style={{ flex: 1, maxWidth: 500, margin: '0 40px' }}>
              <div style={{ 
                display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.98)', 
                borderRadius: 16, padding: '12px 20px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                border: '2px solid rgba(255,255,255,0.5)', transition: 'all 0.3s'
              }}>
                <span style={{ marginRight: 12, fontSize: 20 }}></span>
                <input
                  type="text"
                  placeholder="Search for fresh produce..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 14, color: '#333', fontWeight: 500 }}
                />
              </div>
            </div>

            {/* Navigation Buttons with Glow Effect */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {['Products', 'Cart', 'Orders'].map((item) => {
                const isCurrent = activeTab === item.toLowerCase();
                return (
                  <button 
                    key={item}
                    onClick={item === 'Products' ? onGoToProducts : item === 'Cart' ? onGoToCart : onGoToOrders}
                    style={{ 
                      padding: '10px 20px', 
                      background: isCurrent ? 'rgba(255,255,255,0.2)' : theme.navBtnBg,
                      color: '#FFFFFF',
                      border: `2px solid ${isCurrent ? theme.accent : theme.navBtnBorder}`,
                      borderRadius: 12,
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: 14,
                      backdropFilter: 'blur(8px)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                      boxShadow: isCurrent ? `0 0 15px ${theme.accent}, 0 0 30px ${theme.accent}40` : '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = isCurrent 
                        ? `0 0 20px ${theme.accent}, 0 0 40px ${theme.accent}50` 
                        : '0 6px 20px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = isCurrent 
                        ? `0 0 15px ${theme.accent}, 0 0 30px ${theme.accent}40` 
                        : '0 4px 12px rgba(0,0,0,0.1)';
                    }}
                  >
                    <span>{item}</span>
                    {item === 'Cart' && cartCount > 0 && (
                      <span style={{
                        position: 'absolute', top: -8, right: -8, background: 'linear-gradient(135deg, #ff5252 0%, #d32f2f 100%)',
                        color: 'white', fontSize: 11, fontWeight: 800, minWidth: 22, height: 22, borderRadius: 11,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '3px solid rgba(255,255,255,0.3)', boxShadow: '0 2px 8px rgba(211, 47, 47, 0.4)'
                      }}>
                        {cartCount > 99 ? '99+' : cartCount}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Divider */}
              <div style={{ width: 2, height: 28, background: 'rgba(255,255,255,0.3)', margin: '0 4px', borderRadius: 1 }}></div>

              {/* Logout */}
              <button 
                onClick={onLogout} 
                style={{ 
                  padding: '10px 20px', background: 'white', color: theme.logoutColor,
                  border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 800,
                  fontSize: 13, boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', letterSpacing: '0.5px'
                }}

                onMouseOver={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = `0 6px 20px ${theme.logoutColor}40`; }}
                onMouseOut={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)'; }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px' }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: 24, color: '#666', fontSize: 14 }}>
          <span>Home</span><span style={{ margin: '0 8px', color: '#999' }}>›</span>
          <span style={{ color: theme.titleColor, fontWeight: 600 }}>Products</span>
        </div>

        {/* Section Header */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ 
            margin: '0 0 8px 0', fontSize: 32, fontWeight: 800, 
            background: `linear-gradient(135deg, ${theme.titleColor} 0%, ${theme.textPrimary} 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-1px'
          }}>
            Fresh Products Available
          </h2>
          <p style={{ margin: 0, color: theme.textSecondary, fontSize: 15 }}>Direct from local farmers to your table</p>
        </div>

        {/* Sorting Controls */}
        <div style={{ 
          display: 'flex', gap: 12, marginBottom: 32, alignItems: 'center', flexWrap: 'wrap',
          padding: '16px 20px', background: 'white', borderRadius: 14,
          boxShadow: '0 2px 12px rgba(46, 125, 50, 0.08)', border: `1px solid ${theme.accent}20`
        }}>
          <span style={{ color: theme.textSecondary, fontSize: 14, fontWeight: 600, marginRight: 4 }}>Sort by:</span>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ 
            padding: '10px 14px', borderRadius: 10, border: `2px solid ${theme.inputBorder}`,
            background: theme.inputBg, fontSize: 14, fontWeight: 500, cursor: 'pointer',
            outline: 'none', color: '#333', transition: 'all 0.3s', minWidth: 140
          }}
            onFocus={e => { e.target.style.borderColor = theme.accent; e.target.style.boxShadow = `0 0 0 3px ${theme.accent}30`; }}
            onBlur={e => { e.target.style.borderColor = theme.inputBorder; e.target.style.boxShadow = 'none'; }}
          >
            <option value="productName">Product Name</option>
            <option value="price">Price</option>
            <option value="productQuantity">Stock Quantity</option>
            <option value="productType">Category</option>
          </select>
          <select value={order} onChange={e => setOrder(e.target.value)} style={{ 
            padding: '10px 14px', borderRadius: 10, border: `2px solid ${theme.inputBorder}`,
            background: theme.inputBg, fontSize: 14, fontWeight: 500, cursor: 'pointer',
            outline: 'none', color: '#333', transition: 'all 0.3s', minWidth: 130
          }}
            onFocus={e => { e.target.style.borderColor = theme.accent; e.target.style.boxShadow = `0 0 0 3px ${theme.accent}30`; }}
            onBlur={e => { e.target.style.borderColor = theme.inputBorder; e.target.style.boxShadow = 'none'; }}
          >
            <option value="asc">↑ Ascending</option>
            <option value="desc">↓ Descending</option>
          </select>
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{
              padding: '10px 18px', background: `linear-gradient(135deg, ${theme.btnBg} 0%, ${theme.btnHover} 100%)`,
              color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer',
              fontSize: 14, fontWeight: 600, marginLeft: 'auto', transition: 'all 0.3s',
              boxShadow: `0 2px 8px ${theme.btnShadow}`
            }}
              onMouseOver={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = `0 4px 12px ${theme.btnShadow}`; }}
              onMouseOut={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = `0 2px 8px ${theme.btnShadow}`; }}
            >✕ Clear Search</button>
          )}
        </div>

        {/* Product Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          {filteredProducts.map(p => {
            const stock = getStockStatus(p.productQuantity);
            return (
              <div key={p._id} style={{ 
                background: 'white', borderRadius: 20, overflow: 'hidden',
                boxShadow: `0 4px 20px ${theme.btnShadow}`,
                border: `1px solid ${theme.accent}15`,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = `0 12px 40px ${theme.btnShadow}`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 20px ${theme.btnShadow}`; }}
              >
                {/* Image Area */}
                <div style={{ 
                  position: 'relative', height: 200,
                  background: `linear-gradient(135deg, ${stock.bg} 0%, ${stock.bg}dd 100%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
                }}>
                  {stock.badge && (
                    <div style={{
                      position: 'absolute', top: 16, right: 16, padding: '6px 14px',
                      background: `linear-gradient(135deg, ${stock.badgeColor} 0%, ${stock.badgeColor}dd 100%)`,
                      color: 'white', borderRadius: 8, fontSize: 10, fontWeight: 800,
                      letterSpacing: '1px', boxShadow: `0 2px 12px ${stock.badgeColor}60`, textTransform: 'uppercase'
                    }}>{stock.badge}</div>
                  )}
                  <div style={{ fontSize: 80, opacity: 0.3, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}>
                    {p.productType === 1 ? '🌾' : '🐔'}
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: 24 }}>
                  <span style={{ 
                    fontSize: 11, padding: '6px 12px',
                    background: p.productType === 1 ? '#e8f5e9' : '#fff3e0',
                    color: p.productType === 1 ? '#2e7d32' : '#e65100',
                    borderRadius: 8, fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.5px', display: 'inline-block', marginBottom: 14
                  }}>
                    {p.productType === 1 ? '🌱 Crop' : '🥚 Poultry'}
                  </span>

                  <h3 style={{ margin: '0 0 10px 0', fontSize: 18, fontWeight: 700, color: theme.titleColor, lineHeight: 1.3 }}>
                    {p.productName}
                  </h3>

                  <p style={{ margin: '0 0 18px 0', fontSize: 13, color: theme.textSecondary, lineHeight: 1.6,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                  }}>
                    {p.productDescription}
                  </p>

                  <div style={{ 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginBottom: 18, padding: '14px 16px', background: '#f8faf8', borderRadius: 12,
                    border: `1px solid ${theme.accent}20`
                  }}>
                    <div>
                      <div style={{ fontSize: 26, fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.5px' }}>
                        ₱{p.price.toFixed(2)}
                      </div>
                      <div style={{ fontSize: 12, color: stock.color, fontWeight: 600, marginTop: 4 }}>{stock.text}</div>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button 
                    onClick={() => handleAddToCart(p._id)}
                    disabled={stock.disabled || addingToCart === p._id}
                    style={{
                      width: '100%', padding: '16px',
                      background: stock.disabled ? '#e8e8e8' : `linear-gradient(135deg, ${theme.btnBg} 0%, ${theme.btnHover} 100%)`,
                      color: 'white', border: 'none', borderRadius: 14,
                      cursor: stock.disabled ? 'not-allowed' : 'pointer',
                      fontSize: 15, fontWeight: 700, letterSpacing: '0.3px',
                      opacity: addingToCart === p._id ? 0.8 : 1,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: stock.disabled ? 'none' : `0 4px 16px ${theme.btnShadow}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                    }}
                    onMouseOver={e => {
                      if (!stock.disabled) {
                        e.target.style.transform = 'translateY(-3px)';
                        e.target.style.boxShadow = `0 6px 20px ${theme.btnShadow}`;
                        e.target.style.background = `linear-gradient(135deg, ${theme.btnHover} 0%, ${theme.btnBg} 100%)`;
                      }
                    }}
                    onMouseOut={e => {
                      if (!stock.disabled) {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = `0 4px 16px ${theme.btnShadow}`;
                        e.target.style.background = `linear-gradient(135deg, ${theme.btnBg} 0%, ${theme.btnHover} 100%)`;
                      }
                    }}
                  >
                    {addingToCart === p._id ? '⏳ Adding...' : '🛒 Add to Cart'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div style={{ 
            textAlign: 'center', padding: 100, background: 'white', borderRadius: 20,
            boxShadow: `0 4px 20px ${theme.btnShadow}`, border: `1px solid ${theme.accent}15`
          }}>
            <div style={{ fontSize: 80, marginBottom: 24, opacity: 0.4 }}>🔍</div>
            <h3 style={{ margin: '0 0 12px 0', color: theme.titleColor, fontSize: 24, fontWeight: 700 }}>No products found</h3>
            <p style={{ margin: '0 0 32px 0', color: theme.textSecondary, fontSize: 15 }}>
              {searchQuery ? 'Try adjusting your search terms' : 'No products available at the moment'}
            </p>
            {user?.userType === 'Admin' && (
              <button onClick={() => window.location.href = '#admin'} style={{
                padding: '16px 36px', background: `linear-gradient(135deg, ${theme.btnBg} 0%, ${theme.btnHover} 100%)`,
                color: 'white', border: 'none', borderRadius: 14, cursor: 'pointer', fontWeight: 700,
                fontSize: 15, boxShadow: `0 4px 16px ${theme.btnShadow}`, transition: 'all 0.3s'
              }}
                onMouseOver={e => { e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = `0 6px 20px ${theme.btnShadow}`; }}
                onMouseOut={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = `0 4px 16px ${theme.btnShadow}`; }}
              >➕ Add Products</button>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ 
        maxWidth: 1280, margin: '40px auto 0', padding: '28px 32px',
        background: `linear-gradient(135deg, ${theme.panelBg} 0%, ${theme.accent}20 100%)`,
        borderRadius: 16, textAlign: 'center', border: `1px solid ${theme.accent}20`,
        boxShadow: `0 2px 12px ${theme.btnShadow}`
      }}>
        <p style={{ margin: 0, color: theme.titleColor, fontSize: 14, fontWeight: 600 }}>🌾 All products sourced directly from local farmers</p>
        <p style={{ margin: '8px 0 0 0', color: theme.textSecondary, fontSize: 13 }}>Cart data persists in MongoDB • Items remain after page refresh</p>
      </div>
    </div>
  );
}