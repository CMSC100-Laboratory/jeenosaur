import { useState, useEffect } from 'react';
import dayImage from '../assets/day.png';
import noonImage from '../assets/noon.png';
import sunsetImage from '../assets/sunset.png';
import nightImage from '../assets/night.png';

//Accept activeTab prop for glowing navigation
export default function ShoppingCart({ user, onLogout, onCheckout, onCartUpdate, onGoToProducts, onGoToCart, onGoToOrders, activeTab = 'cart' }) {
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [cartItems, setCartItems] = useState([]);

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

  //Transparent Theme (Matches ProductList & Login)
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
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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
                <span style={{ marginRight: 12, fontSize: 20 }}>🔍</span>
                <input type="text" placeholder="Search orders..." style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 14, color: '#333', fontWeight: 500 }} />
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
                      fontSize: 13,
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
                    {item === 'Cart' && (
                      <span style={{
                        position: 'absolute', top: -8, right: -8, background: 'linear-gradient(135deg, #ff5252 0%, #d32f2f 100%)',
                        color: 'white', fontSize: 11, fontWeight: 800, minWidth: 22, height: 22, borderRadius: 11,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '3px solid rgba(255,255,255,0.3)', boxShadow: '0 2px 8px rgba(211, 47, 47, 0.4)'
                      }}>
                        {cartItems.length > 99 ? '99+' : cartItems.length}
                      </span>
                    )}
                  </button>
                );
              })}

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
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px' }}>
        <div style={{ marginBottom: 24, color: '#666', fontSize: 14 }}>
          <span style={{ color: '#666', cursor: 'pointer', onClick: onGoToProducts }}>Home</span>
          <span style={{ margin: '0 8px', color: '#999' }}>›</span>
          <span style={{ color: theme.titleColor, fontWeight: 600 }}>Shopping Cart</span>
        </div>

        <h2 style={{ 
          margin: '0 0 24px 0', fontSize: 32, fontWeight: 800, 
          background: `linear-gradient(135deg, ${theme.titleColor} 0%, ${theme.textPrimary} 100%)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-1px'
        }}>
          My Cart
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          {/* Cart Items List */}
          <div style={{ background: 'white', borderRadius: 20, padding: 24, boxShadow: `0 4px 20px ${theme.btnShadow}`, border: `1px solid ${theme.accent}15` }}>
            {cartItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: theme.textSecondary }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
                <p>Your cart is empty.</p>
                <button onClick={onGoToProducts} style={{ marginTop: 16, padding: '12px 24px', background: theme.btnBg, color: 'white', border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 600 }}>Browse Products</button>
              </div>
            ) : (
              cartItems.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 0', borderBottom: '1px solid #eee' }}>
                  <div style={{ width: 60, height: 60, background: theme.panelBg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>
                    {item.image}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: theme.textPrimary }}>{item.name}</h3>
                    <p style={{ margin: '4px 0 0', color: '#888', fontSize: 14 }}>₱{item.price.toFixed(2)} each</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${theme.inputBorder}`, background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</button>
                    <span style={{ fontWeight: 600, minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                    <button style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${theme.inputBorder}`, background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: theme.textPrimary, minWidth: 80, textAlign: 'right' }}>
                    ₱{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Order Summary */}
          <div style={{ background: 'white', borderRadius: 20, padding: 24, boxShadow: `0 4px 20px ${theme.btnShadow}`, border: `1px solid ${theme.accent}15`, height: 'fit-content' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 700, color: theme.titleColor }}>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, color: '#666' }}>
              <span>Subtotal</span>
              <span>₱{total.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, color: '#666' }}>
              <span>Delivery Fee</span>
              <span>₱40.00</span>
            </div>
            <div style={{ height: 1, background: '#eee', margin: '16px 0' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, fontSize: 18, fontWeight: 800, color: theme.textPrimary }}>
              <span>Total</span>
              <span>₱{(total + 40).toFixed(2)}</span>
            </div>
            <button 
              onClick={onCheckout}
              style={{
                width: '100%', padding: '16px',
                background: `linear-gradient(135deg, ${theme.btnBg} 0%, ${theme.btnHover} 100%)`,
                color: 'white', border: 'none', borderRadius: 14,
                cursor: 'pointer', fontSize: 16, fontWeight: 700,
                boxShadow: `0 4px 16px ${theme.btnShadow}`,
                transition: 'all 0.3s'
              }}
              onMouseOver={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = `0 6px 20px ${theme.btnShadow}`; }}
              onMouseOut={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = `0 4px 16px ${theme.btnShadow}`; }}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        maxWidth: 1000, margin: '40px auto 0', padding: '28px 32px',
        background: `linear-gradient(135deg, ${theme.panelBg} 0%, ${theme.accent}20 100%)`,
        borderRadius: 16, textAlign: 'center', border: `1px solid ${theme.accent}20`,
        boxShadow: `0 2px 12px ${theme.btnShadow}`
      }}>
        <p style={{ margin: 0, color: theme.titleColor, fontSize: 14, fontWeight: 600 }}>🌾 All products sourced directly from local farmers</p>
      </div>
    </div>
  );
}