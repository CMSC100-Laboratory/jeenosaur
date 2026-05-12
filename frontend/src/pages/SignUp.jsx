import { useState, useEffect } from 'react';
import { signUp } from '../api';
import dayImage from '../assets/day.png';
import noonImage from '../assets/noon.png';
import sunsetImage from '../assets/sunset.png';
import nightImage from '../assets/night.png';
import logoImage from '../assets/aniway.png';

export default function SignUp({ onGoToLogin }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 12) setTimeOfDay('morning');
      else if (hour >= 12 && hour < 16) setTimeOfDay('noon');
      else if (hour >= 16 && hour < 18) setTimeOfDay('sunset');
      else setTimeOfDay('night');
    };
    updateTime();
    setIsLoaded(true);
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const themes = {
    morning: {
      bg: `url(${dayImage})`,
      overlay: 'linear-gradient(135deg, rgba(27, 94, 32, 0.55) 0%, rgba(46, 125, 50, 0.4) 100%)',
      accent: '#81C784', panelBg: '#F1F8E9', titleColor: '#1B5E20',
      textPrimary: '#2E7D32', textSecondary: '#666666',
      inputBg: '#FFFFFF', inputBorder: '#E0E0E0', inputFocus: '#4CAF50',
      btnBg: '#2E7D32', btnHover: '#1B5E20', btnShadow: 'rgba(46, 125, 50, 0.3)',
      linkColor: '#2E7D32', greeting: 'Sunrise Harvests', sub: 'Fresh from the fields to your table'
    },
    noon: {
      bg: `url(${noonImage})`,
      overlay: 'linear-gradient(135deg, rgba(27, 94, 32, 0.5) 0%, rgba(76, 175, 80, 0.35) 100%)',
      accent: '#66BB6A', panelBg: '#E8F5E9', titleColor: '#1B5E20',
      textPrimary: '#2E7D32', textSecondary: '#666666',
      inputBg: '#FFFFFF', inputBorder: '#E0E0E0', inputFocus: '#43A047',
      btnBg: '#2E7D32', btnHover: '#1B5E20', btnShadow: 'rgba(46, 125, 50, 0.3)',
      linkColor: '#2E7D32', greeting: 'Peak Harvest', sub: 'Market is open, fresh picks await'
    },
    sunset: {
      bg: `url(${sunsetImage})`,
      overlay: 'linear-gradient(135deg, rgba(27, 94, 32, 0.65) 0%, rgba(85, 139, 47, 0.5) 50%, rgba(178, 223, 138, 0.25) 100%)',
      accent: '#AED581', panelBg: '#F1F8E9', titleColor: '#1B5E20',
      textPrimary: '#2E7D32', textSecondary: '#666666',
      inputBg: '#FFFFFF', inputBorder: '#E0E0E0', inputFocus: '#4CAF50',
      btnBg: '#2E7D32', btnHover: '#1B5E20', btnShadow: 'rgba(46, 125, 50, 0.3)',
      linkColor: '#2E7D32', greeting: 'Golden Hour', sub: 'Daily market closing soon'
    },
    night: {
      bg: `url(${nightImage})`,
      overlay: 'linear-gradient(135deg, rgba(13, 71, 161, 0.6) 0%, rgba(46, 125, 50, 0.5) 100%)',
      accent: '#64B5F6', panelBg: '#E3F2FD', titleColor: '#1B5E20',
      textPrimary: '#2E7D32', textSecondary: '#666666',
      inputBg: '#FFFFFF', inputBorder: '#E0E0E0', inputFocus: '#4CAF50',
      btnBg: '#2E7D32', btnHover: '#1B5E20', btnShadow: 'rgba(46, 125, 50, 0.3)',
      linkColor: '#2E7D32', greeting: 'Starlight Harvests', sub: 'Resting for tomorrow\'s fresh picks'
    }
  };

  const theme = themes[timeOfDay];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    
    try {
      const res = await signUp({ firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password });
      if (res.success) { setSuccess('Account created! Redirecting...'); setTimeout(onGoToLogin, 1500); }
      else setError(res.message);
    } catch { setError('Connection error'); }
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      width: '100vw', 
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      overflow: 'hidden'
    }}>
      
      {/* LEFT: Dynamic Image Section */}
      <div style={{
        flex: '2.2',
        backgroundImage: theme.bg,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px',
        animation: isLoaded ? 'fadeIn 1s ease-out' : 'none'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: theme.overlay,
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
        }}></div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '10px 24px',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(12px)',
            borderRadius: '50px',
            border: '1px solid rgba(255,255,255,0.25)',
            marginBottom: '32px',
            animation: isLoaded ? 'slideUp 0.8s ease-out 0.2s both' : 'none'
          }}>
            <span style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: '#FFFFFF',
              textShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}>
              Farm to Table
            </span>
          </div>

          <h1 style={{
            fontSize: '5rem',
            fontWeight: 900,
            margin: '0 0 16px',
            lineHeight: 1,
            color: '#FFFFFF',
            textShadow: '0 4px 24px rgba(0,0,0,0.3)',
            letterSpacing: '-2px',
            animation: isLoaded ? 'slideUp 0.8s ease-out 0.3s both' : 'none'
          }}>
            AniWay
          </h1>

          <h2 style={{
            fontSize: '2rem',
            fontWeight: 600,
            margin: '0 0 16px',
            color: '#FFFFFF',
            textShadow: '0 2px 12px rgba(0,0,0,0.2)',
            animation: isLoaded ? 'slideUp 0.8s ease-out 0.4s both' : 'none'
          }}>
            {theme.greeting}
          </h2>

          <p style={{
            fontSize: '1.1rem',
            color: 'rgba(255,255,255,0.95)',
            lineHeight: 1.6,
            marginBottom: '40px',
            fontWeight: 400,
            textShadow: '0 1px 4px rgba(0,0,0,0.2)',
            animation: isLoaded ? 'slideUp 0.8s ease-out 0.5s both' : 'none'
          }}>
            {theme.sub}
          </p>

          <div style={{
            width: '60px',
            height: '3px',
            background: 'linear-gradient(90deg, rgba(255,255,255,0.8), transparent)',
            borderRadius: '2px',
            animation: isLoaded ? 'expandWidth 0.8s ease-out 0.6s both' : 'none'
          }}></div>
        </div>
      </div>

      {/* RIGHT: Sign Up Form Panel */}
      <div style={{
        flex: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FAFAFA',
        padding: '40px',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '-30%',
          right: '-20%',
          width: '500px',
          height: '500px',
          background: `radial-gradient(circle, ${theme.btnShadow} 0%, transparent 70%)`,
          opacity: 0.08,
          pointerEvents: 'none'
        }}></div>

        <div style={{
          width: '100%',
          maxWidth: '420px',
          background: theme.panelBg,
          padding: '56px 48px',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)',
          position: 'relative',
          zIndex: 1,
          animation: isLoaded ? 'fadeIn 1s ease-out 0.3s both' : 'none',
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          
          {/* Logo Image */}
          <img 
            src={logoImage} 
            alt="AniWay Logo" 
            style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 28px',
            display: 'block',
            borderRadius: '18px',
            boxShadow: `0 8px 24px ${theme.btnShadow}`,
            transition: 'all 0.3s ease',
            objectFit: 'cover'
            }}
          />

          // Create Account Header
          <h2 style={{
            textAlign: 'center',
            margin: '0 0 12px',
            fontSize: '28px',
            fontWeight: 800,
            color: theme.titleColor,
            letterSpacing: '-0.5px'
          }}>
            CREATE ACCOUNT
          </h2>

          <p style={{
            textAlign: 'center',
            margin: '0 0 36px',
            color: theme.textSecondary,
            fontSize: '15px',
            lineHeight: 1.5
          }}>
            Join the AniWay marketplace today!
          </p>

          {error && (
            <div style={{
              background: '#FFF3E0',
              color: '#E65100',
              padding: '14px 18px',
              borderRadius: '12px',
              marginBottom: '28px',
              fontSize: '14px',
              textAlign: 'center',
              border: '1px solid #FFCC80',
              fontWeight: 500,
              animation: 'shake 0.5s ease-in-out'
            }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{
              background: '#E8F5E9',
              color: '#2E7D32',
              padding: '14px 18px',
              borderRadius: '12px',
              marginBottom: '28px',
              fontSize: '14px',
              textAlign: 'center',
              border: '1px solid #81C784',
              fontWeight: 500
            }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '10px', color: theme.textPrimary, fontSize: '14px', fontWeight: 600 }}>First Name</label>
                <input type="text" placeholder="Juan" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} required style={{ width: '100%', padding: '16px 18px', border: '2px solid #E0E0E0', borderRadius: '14px', fontSize: '15px', outline: 'none', boxSizing: 'border-box', background: theme.inputBg, transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', color: '#333', fontWeight: 400 }} onFocus={e => { e.target.style.borderColor = theme.inputFocus; e.target.style.boxShadow = `0 0 0 4px ${theme.inputFocus}20`; }} onBlur={e => { e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'; }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '10px', color: theme.textPrimary, fontSize: '14px', fontWeight: 600 }}>Last Name</label>
                <input type="text" placeholder="Dela Cruz" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} required style={{ width: '100%', padding: '16px 18px', border: '2px solid #E0E0E0', borderRadius: '14px', fontSize: '15px', outline: 'none', boxSizing: 'border-box', background: theme.inputBg, transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', color: '#333', fontWeight: 400 }} onFocus={e => { e.target.style.borderColor = theme.inputFocus; e.target.style.boxShadow = `0 0 0 4px ${theme.inputFocus}20`; }} onBlur={e => { e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'; }} />
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '10px', color: theme.textPrimary, fontSize: '14px', fontWeight: 600 }}>Email</label>
              <input type="email" placeholder="juan@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required style={{ width: '100%', padding: '16px 18px', border: '2px solid #E0E0E0', borderRadius: '14px', fontSize: '15px', outline: 'none', boxSizing: 'border-box', background: theme.inputBg, transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', color: '#333', fontWeight: 400 }} onFocus={e => { e.target.style.borderColor = theme.inputFocus; e.target.style.boxShadow = `0 0 0 4px ${theme.inputFocus}20`; }} onBlur={e => { e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'; }} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '10px', color: theme.textPrimary, fontSize: '14px', fontWeight: 600 }}>Password</label>
              <input type="password" placeholder="Min 6 characters" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required style={{ width: '100%', padding: '16px 18px', border: '2px solid #E0E0E0', borderRadius: '14px', fontSize: '15px', outline: 'none', boxSizing: 'border-box', background: theme.inputBg, transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', color: '#333', fontWeight: 400 }} onFocus={e => { e.target.style.borderColor = theme.inputFocus; e.target.style.boxShadow = `0 0 0 4px ${theme.inputFocus}20`; }} onBlur={e => { e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'; }} />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', marginBottom: '10px', color: theme.textPrimary, fontSize: '14px', fontWeight: 600 }}>Confirm Password</label>
              <input type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} required style={{ width: '100%', padding: '16px 18px', border: '2px solid #E0E0E0', borderRadius: '14px', fontSize: '15px', outline: 'none', boxSizing: 'border-box', background: theme.inputBg, transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', color: '#333', fontWeight: 400 }} onFocus={e => { e.target.style.borderColor = theme.inputFocus; e.target.style.boxShadow = `0 0 0 4px ${theme.inputFocus}20`; }} onBlur={e => { e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'; }} />
            </div>
            <button type="submit" style={{ display: 'block', width: '100%', padding: '18px', background: `linear-gradient(135deg, ${theme.btnBg} 0%, ${theme.btnHover} 100%)`, color: '#fff', border: 'none', borderRadius: '14px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', marginBottom: '24px', boxShadow: `0 4px 16px ${theme.btnShadow}`, letterSpacing: '0.5px' }} onMouseOver={e => { e.target.style.background = `linear-gradient(135deg, ${theme.btnHover} 0%, ${theme.btnBg} 100%)`; e.target.style.transform = 'translateY(-2px)'; }} onMouseOut={e => { e.target.style.background = `linear-gradient(135deg, ${theme.btnBg} 0%, ${theme.btnHover} 100%)`; e.target.style.transform = 'translateY(0)'; }}>Create Account</button>
            <p style={{ textAlign: 'center', color: '#888888', fontSize: '14px', margin: 0 }}>Already have an account?{' '}<span onClick={onGoToLogin} style={{ color: theme.linkColor, fontWeight: 700, cursor: 'pointer', textDecoration: 'none', borderBottom: '2px solid transparent', transition: 'all 0.3s', paddingBottom: '2px' }} onMouseOver={e => e.target.style.borderBottomColor = theme.linkColor} onMouseOut={e => e.target.style.borderBottomColor = 'transparent'}>Sign In</span></p>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes expandWidth { from { width: 0; } to { width: 60px; } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-8px); } 40% { transform: translateX(8px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } }
      `}</style>
    </div>
  );
}