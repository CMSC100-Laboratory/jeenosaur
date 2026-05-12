import { useState, useEffect } from 'react';
import { getCart, removeFromCart, updateCartItem } from '../api'; //Import from api.js
import dayImage from '../assets/day.png';
import noonImage from '../assets/noon.png';
import sunsetImage from '../assets/sunset.png';
import nightImage from '../assets/night.png';
import logoImage from '../assets/site.png';

export default function ShoppingCart({ user, onLogout, onCheckout, onCartUpdate, onGoToProducts, onGoToCart, onGoToOrders, activeTab = 'cart' }) {
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

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

    //Fetch cart using api.js function
    const fetchCart = async () => {
      try {
        const data = await getCart(); // Uses /get-cart + auto x-user-id header
        if (data.success) {
          // Adjust based on your backend response structure
          setCartItems(data.items || data.cart || []);
        }
      } catch (err) {
        console.error("Failed to load cart", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchCart();
    return () => clearInterval(interval);
  }, [user]);

  //Transparent Themes
  const themes = {
    morning: { bg: `url(${dayImage})`, overlay: 'linear-gradient(135deg, rgba(27, 94, 32, 0.55) 0%, rgba(46, 125, 50, 0.4) 100%)', accent: '#81C784', panelBg: '#F1F8E9', titleColor: '#1B5E20', textPrimary: '#2E7D32', btnBg: '#2E7D32', btnHover: '#1B5E20', btnShadow: 'rgba(46, 125, 50, 0.3)', logoutColor: '#1b5e20', navBtnBorder: 'rgba(255,255,255,0.3)', navBtnBg: 'rgba(255,255,255,0.15)' },
    noon: { bg: `url(${noonImage})`, overlay: 'linear-gradient(135deg, rgba(27, 94, 32, 0.5) 0%, rgba(76, 175, 80, 0.35) 100%)', accent: '#66BB6A', panelBg: '#E8F5E9', titleColor: '#1B5E20', textPrimary: '#2E7D32', btnBg: '#2E7D32', btnHover: '#1B5E20', btnShadow: 'rgba(46, 125, 50, 0.3)', logoutColor: '#2e7d32', navBtnBorder: 'rgba(255,255,255,0.3)', navBtnBg: 'rgba(255,255,255,0.15)' },
    sunset: { bg: `url(${sunsetImage})`, overlay: 'linear-gradient(135deg, rgba(27, 94, 32, 0.65) 0%, rgba(85, 139, 47, 0.5) 50%, rgba(178, 223, 138, 0.25) 100%)', accent: '#AED581', panelBg: '#F1F8E9', titleColor: '#1B5E20', textPrimary: '#2E7D32', btnBg: '#2E7D32', btnHover: '#1B5E20', btnShadow: 'rgba(46, 125, 50, 0.3)', logoutColor: '#1b5e20', navBtnBorder: 'rgba(255,255,255,0.3)', navBtnBg: 'rgba(255,255,255,0.15)' },
    night: { bg: `url(${nightImage})`, overlay: 'linear-gradient(135deg, rgba(13, 71, 161, 0.6) 0%, rgba(46, 125, 50, 0.5) 100%)', accent: '#64B5F6', panelBg: '#E3F2FD', titleColor: '#1B5E20', textPrimary: '#2E7D32', btnBg: '#2E7D32', btnHover: '#1B5E20', btnShadow: 'rgba(46, 125, 50, 0.3)', logoutColor: '#1565C0', navBtnBorder: 'rgba(255,255,255,0.3)', navBtnBg: 'rgba(255,255,255,0.15)' }
  };

  const theme = themes[timeOfDay];
  const total = cartItems.reduce((sum, item) => {
    const price = item.product ? item.product.price : (item.price || 0);
    return sum + (price * item.quantity);
  }, 0);

  const handleRemove = async (productId) => {
    const res = await removeFromCart({ productId });
    if (res.success) {
      onCartUpdate?.();
      fetchCart(); // Refresh list
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: `linear-gradient(135deg, ${theme.panelBg} 0%, #ffffff 100%)`, minHeight: '100vh', paddingBottom: 40 }}>
      {/* NAVIGATION BAR (same as ProductList) */}
      <div style={{ position: 'relative', background: theme.bg, backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: `0 4px 24px ${theme.btnShadow}`, position: 'sticky', top: 0, zIndex: 100, borderBottom: `3px solid ${theme.accent}` }}>
        <div style={{ position: 'absolute', inset: 0, background: theme.overlay }}></div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1280, margin: '0 auto', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* LEFT: Logo & Branding */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img 
              src={logoImage} 
              alt="AniWay" 
              style={{
                width: '48px',
                height: '48px',
                objectFit: 'contain',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            />
            <div>
              <h1 style={{ 
                margin: 0, 
                fontSize: '26px', 
                fontWeight: 800, 
                color: '#fff', 
                letterSpacing: '-0.5px', 
                textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                lineHeight: 1.1
              }}>
                AniWay
              </h1>
              <p style={{ 
                margin: '2px 0 0 0', 
                fontSize: '11px', 
                color: 'rgba(255,255,255,0.85)', 
                fontWeight: 600,
                letterSpacing: '1.5px',
                textTransform: 'uppercase'
              }}>
                Farm to Table
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {['Products', 'Cart', 'Orders'].map((item) => {
              const isCurrent = activeTab === item.toLowerCase();
              return (
                <button key={item} onClick={item === 'Products' ? onGoToProducts : item === 'Cart' ? onGoToCart : onGoToOrders}
                  style={{ padding: '10px 20px', background: isCurrent ? 'rgba(255,255,255,0.2)' : theme.navBtnBg, color: '#FFFFFF', border: `2px solid ${isCurrent ? theme.accent : theme.navBtnBorder}`, borderRadius: 12, cursor: 'pointer', fontWeight: 700, fontSize: 13, backdropFilter: 'blur(8px)', transition: 'all 0.3s', boxShadow: isCurrent ? `0 0 15px ${theme.accent}` : 'none' }}>
                  {item}
                </button>
              );
            })}
            <button onClick={onLogout} style={{ padding: '10px 20px', background: 'white', color: theme.logoutColor, border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 800, fontSize: 13 }}>Logout</button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px' }}>
        <h2 style={{ margin: '0 0 24px 0', fontSize: 32, fontWeight: 800, color: theme.titleColor }}>My Cart</h2>
        {loading ? <p>Loading your cart...</p> : cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, background: 'white', borderRadius: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
            <p>Your cart is empty.</p>
            <button onClick={onGoToProducts} style={{ marginTop: 16, padding: '12px 24px', background: theme.btnBg, color: 'white', border: 'none', borderRadius: 12, cursor: 'pointer' }}>Browse Products</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
            <div style={{ background: 'white', borderRadius: 20, padding: 24, boxShadow: `0 4px 20px ${theme.btnShadow}` }}>
              {cartItems.map(item => (
                <div key={item._id || item.productId} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 0', borderBottom: '1px solid #eee' }}>
                  <div style={{ width: 60, height: 60, background: theme.panelBg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>
                    {item.product?.type === 1 ? '🌾' : '🐔'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: theme.textPrimary }}>{item.product?.name || 'Product'}</h3>
                    <p style={{ margin: '4px 0 0', color: '#888', fontSize: 14 }}>₱{item.product?.price || item.price} each</p>
                  </div>
                  <div style={{ fontWeight: 600 }}>x{item.quantity}</div>
                  <button onClick={() => handleRemove(item.product?._id || item.productId)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer' }}>🗑️</button>
                </div>
              ))}
            </div>
            <div style={{ background: 'white', borderRadius: 20, padding: 24, boxShadow: `0 4px 20px ${theme.btnShadow}`, height: 'fit-content' }}>
              <h3 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 700, color: theme.titleColor }}>Order Summary</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, color: '#666' }}><span>Subtotal</span><span>₱{total.toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, color: '#666' }}><span>Delivery</span><span>₱40.00</span></div>
              <div style={{ height: 1, background: '#eee', margin: '16px 0' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, fontSize: 18, fontWeight: 800, color: theme.textPrimary }}><span>Total</span><span>₱{(total + 40).toFixed(2)}</span></div>
              <button onClick={onCheckout} style={{ width: '100%', padding: '16px', background: theme.btnBg, color: 'white', border: 'none', borderRadius: 14, cursor: 'pointer', fontWeight: 700 }}>Checkout</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}