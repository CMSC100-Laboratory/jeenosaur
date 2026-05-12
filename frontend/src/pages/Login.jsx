import { useState, useEffect } from 'react';
import { login } from '../api';
import dayImage from '../assets/day.png';
import noonImage from '../assets/noon.png';
import sunsetImage from '../assets/sunset.png';
import nightImage from '../assets/night.png';
import logoImage from '../assets/aniway.png'

export default function Login({ onLogin, onGoToSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  //Themes depending on the time 
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
    try {
      const res = await login({ email, password });
      if (res.success && res.user) {
        onLogin(res.user);
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection error');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      width: '100vw', 
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      overflow: 'hidden'
    }}>
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
            width: '100px',
            height: '100px',
            margin: '0 auto 28px',
            display: 'block',
            borderRadius: '18px',
            boxShadow: `0 8px 24px ${theme.btnShadow}`,
            transition: 'all 0.3s ease',
            objectFit: 'cover'
          }}
        />

          <h2 style={{
            textAlign: 'center',
            margin: '0 0 12px',
            fontSize: '28px',
            fontWeight: 800,
            color: theme.titleColor,
            letterSpacing: '-0.5px'
          }}>
            LOGIN
          </h2>

          <p style={{
            textAlign: 'center',
            margin: '0 0 36px',
            color: theme.textSecondary,
            fontSize: '15px',
            lineHeight: 1.5
          }}>
            Welcome back! Please sign in to continue.
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

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                color: theme.textPrimary,
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '0.2px'
              }}>
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '16px 18px',
                  border: '2px solid #E0E0E0',
                  borderRadius: '14px',
                  fontSize: '15px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  background: theme.inputBg,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  color: '#333',
                  fontWeight: 400
                }}
                onFocus={e => {
                  e.target.style.borderColor = theme.inputFocus;
                  e.target.style.boxShadow = `0 0 0 4px ${theme.inputFocus}20`;
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#E0E0E0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                color: theme.textPrimary,
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '0.2px'
              }}>
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '16px 18px',
                  border: '2px solid #E0E0E0',
                  borderRadius: '14px',
                  fontSize: '15px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  background: theme.inputBg,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  color: '#333',
                  fontWeight: 400
                }}
                onFocus={e => {
                  e.target.style.borderColor = theme.inputFocus;
                  e.target.style.boxShadow = `0 0 0 4px ${theme.inputFocus}20`;
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#E0E0E0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                display: 'block',
                width: '100%',
                padding: '18px',
                background: `linear-gradient(135deg, ${theme.btnBg} 0%, ${theme.btnHover} 100%)`,
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '14px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                marginBottom: '24px',
                boxShadow: `0 4px 16px ${theme.btnShadow}`,
                letterSpacing: '0.5px'
              }}
              onMouseOver={e => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = `0 6px 24px ${theme.btnShadow}`;
              }}
              onMouseOut={e => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = `0 4px 16px ${theme.btnShadow}`;
              }}
            >
              Sign In
            </button>

            <p style={{
              textAlign: 'center',
              color: '#888888',
              fontSize: '14px',
              margin: 0,
              fontWeight: 400
            }}>
              Don't have an account?{' '}
              <span
                onClick={onGoToSignUp}
                style={{
                  color: theme.linkColor,
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'none',
                  borderBottom: '2px solid transparent',
                  transition: 'all 0.3s',
                  paddingBottom: '2px'
                }}
                onMouseOver={e => {
                  e.target.style.borderBottomColor = theme.linkColor;
                  e.target.style.opacity = '0.8';
                }}
                onMouseOut={e => {
                  e.target.style.borderBottomColor = 'transparent';
                  e.target.style.opacity = '1';
                }}
              >
                Sign Up
              </span>
            </p>
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