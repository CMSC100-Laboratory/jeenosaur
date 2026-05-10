import { useState } from 'react';
import { login } from '../api';
import dayImage from '../assets/day.png';
import sunsetImage from '../assets/sunset.png';
import nightImage from '../assets/night.png';

export default function Login({ onLogin, onGoToSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Time Logic
  const hour = new Date().getHours();
  const isDaytime = hour >= 6 && hour < 16;
  const isSunset = hour >= 16 && hour < 18;
  const isNighttime = hour >= 18 || hour < 6;

  let backgroundImage;
  let greeting;
  let slogan;

  if (isNighttime) {
    backgroundImage = nightImage;
    greeting = "Starlight Harvests";
    slogan = "Resting for tomorrow's fresh picks";
  } else if (isSunset) {
    backgroundImage = sunsetImage;
    greeting = "Golden Hour";
    slogan = "Daily market closing soon";
  } else {
    backgroundImage = dayImage;
    greeting = "Sunrise Harvests";
    slogan = "Fresh from the fields to your table";
  }

  const theme = {
    primary: '#1B5E20',
    secondary: '#2E7D32',
    accent: '#81C784',
    light: '#E8F5E9',
    button: '#1B5E20',
    buttonHover: '#2E7D32',
    panelBg: '#F1F8E9',
    inputBg: '#FFFFFF',
    text: '#1B5E20'
  };

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
      height: '100vh', 
      width: '100vw',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      
      {/* LEFT: Dynamic Image with Refined Overlay & Branding */}
      <div style={{
        flex: 3,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px'
      }}>
        {/* Refined Gradient Overlay - preserves image details */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: isNighttime 
            ? 'linear-gradient(135deg, rgba(13, 71, 161, 0.85) 0%, rgba(27, 94, 32, 0.75) 100%)' 
            : 'linear-gradient(135deg, rgba(27, 94, 32, 0.6) 0%, rgba(46, 125, 50, 0.3) 50%, rgba(129, 199, 132, 0.1) 100%)',
          zIndex: 1 
        }}></div>
        
        {/* Branding Content */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '650px' }}>
          {/* Top Label */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '20px',
            fontWeight: 500,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            padding: '8px 16px',
            borderRadius: '50px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <span style={{ fontSize: '1.1rem' }}></span>
            <span>Farm to Table</span>
          </div>

          {/* Main Title */}
          <h1 style={{ 
            fontSize: '4.5rem', 
            fontWeight: 800, 
            margin: '0 0 16px',
            lineHeight: 1.05,
            color: '#FFFFFF',
            textShadow: '0 2px 20px rgba(0,0,0,0.15)',
            letterSpacing: '-1px'
          }}>
            AniWay
          </h1>

          {/* Subtitle */}
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 500,
            margin: '0 0 24px',
            color: '#FFFFFF',
            opacity: 0.95,
            textShadow: '0 1px 8px rgba(0,0,0,0.1)'
          }}>
            {greeting}
          </h2>

          {/* Description */}
          <p style={{ 
            fontSize: '1.15rem', 
            color: 'rgba(255, 255, 255, 0.9)',
            lineHeight: 1.7,
            maxWidth: '480px',
            fontWeight: 400
          }}>
            {slogan}
          </p>

          {/* Decorative Line */}
          <div style={{
            width: '60px',
            height: '3px',
            background: 'linear-gradient(90deg, #81C784, transparent)',
            marginTop: '32px',
            borderRadius: '2px'
          }}></div>
        </div>
      </div>

      {/* RIGHT: Login Panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F5F5F5',
        padding: '40px 20px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '380px',
          background: theme.panelBg,
          padding: '48px 36px',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(27, 94, 32, 0.12), 0 4px 12px rgba(0,0,0,0.05)',
          border: '1px solid rgba(255, 255, 255, 0.8)'
        }}>
          
          {/* Logo */}
          <div style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
            margin: '0 auto 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '16px',
            fontSize: '28px',
            boxShadow: '0 8px 24px rgba(27, 94, 32, 0.3)'
          }}>
            
          </div>

          {/* LOGIN Title */}
          <h2 style={{
            textAlign: 'center',
            margin: '0 0 8px',
            fontSize: '28px',
            fontWeight: 700,
            color: theme.primary,
            letterSpacing: '-0.5px'
          }}>
            LOGIN
          </h2>

          {/* Subtitle */}
          <p style={{
            textAlign: 'center',
            margin: '0 0 32px',
            color: '#666',
            fontSize: '14px'
          }}>
            Welcome back! Please sign in to continue.
          </p>

          {/* Error Message */}
          {error && (
            <div style={{
              background: '#FFF3E0',
              color: '#E65100',
              padding: '12px 16px',
              borderRadius: '10px',
              marginBottom: '20px',
              fontSize: '13px',
              textAlign: 'center',
              border: '1px solid #FFCC80',
              fontWeight: 500
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: theme.text, 
                fontSize: '13px', 
                fontWeight: 600,
                letterSpacing: '0.3px'
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
                  padding: '14px 16px',
                  border: '2px solid #E0E0E0',
                  borderRadius: '12px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  background: theme.inputBg,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  color: '#333'
                }}
                onFocus={e => {
                  e.target.style.borderColor = theme.secondary;
                  e.target.style.boxShadow = '0 0 0 4px rgba(46, 125, 50, 0.1)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#E0E0E0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: theme.text, 
                fontSize: '13px', 
                fontWeight: 600,
                letterSpacing: '0.3px'
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
                  padding: '14px 16px',
                  border: '2px solid #E0E0E0',
                  borderRadius: '12px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  background: theme.inputBg,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  color: '#333'
                }}
                onFocus={e => {
                  e.target.style.borderColor = theme.secondary;
                  e.target.style.boxShadow = '0 0 0 4px rgba(46, 125, 50, 0.1)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#E0E0E0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              style={{
                display: 'block',
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                marginBottom: '24px',
                boxShadow: '0 4px 16px rgba(27, 94, 32, 0.25)',
                letterSpacing: '0.5px'
              }}
              onMouseOver={e => {
                e.target.style.background = 'linear-gradient(135deg, #2E7D32 0%, #388E3C 100%)';
                e.target.style.boxShadow = '0 6px 24px rgba(46, 125, 50, 0.35)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={e => {
                e.target.style.background = 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)';
                e.target.style.boxShadow = '0 4px 16px rgba(27, 94, 32, 0.25)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Sign In
            </button>

            {/* Sign Up Link */}
            <p style={{
              textAlign: 'center',
              color: '#666',
              fontSize: '14px',
              margin: 0
            }}>
              Don't have an account?{' '}
              <span
                onClick={onGoToSignUp}
                style={{
                  color: theme.primary,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'none',
                  borderBottom: '1px solid transparent',
                  transition: 'all 0.3s'
                }}
                onMouseOver={e => e.target.style.borderBottomColor = theme.primary}
                onMouseOut={e => e.target.style.borderBottomColor = 'transparent'}
              >
                Sign Up
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}