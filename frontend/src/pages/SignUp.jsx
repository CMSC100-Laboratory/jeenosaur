import { useState } from 'react';
import { signUp } from '../api';
import dayImage from '../assets/day.png';
import sunsetImage from '../assets/sunset.png'; // ✅ Imported sunset image
import nightImage from '../assets/night.png';

export default function SignUp({ onGoToLogin }) {
  const [form, setForm] = useState({ 
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '' 
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Time Logic
  const hour = new Date().getHours();
  const isDaytime = hour >= 6 && hour < 16;
  const isSunset = hour >= 16 && hour < 18; // 4 PM - 6 PM
  const isNighttime = hour >= 18 || hour < 6;

  let backgroundImage;
  let greeting;
  let slogan;

  if (isNighttime) {
    backgroundImage = nightImage;
    greeting = "Starlight Harvests";
    slogan = "Resting for tomorrow's fresh picks";
  } else if (isSunset) {
    backgroundImage = sunsetImage; // ✅ Uses sunset image
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
    panelBg: '#F1F8E9', // ✅ Solid light green background
    inputBg: '#FFFFFF',
    text: '#1B5E20'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const userData = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password
    };

    try {
      const res = await signUp(userData);
      if (res.success) {
        setSuccess('Account created! Redirecting...');
        setTimeout(onGoToLogin, 1500);
      } else {
        setError(res.message);
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
        {/* Refined Gradient Overlay */}
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
            <span style={{ fontSize: '1.1rem' }}>🌾</span>
            <span>Farm to Table</span>
          </div>

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

          <p style={{ 
            fontSize: '1.15rem', 
            color: 'rgba(255, 255, 255, 0.9)',
            lineHeight: 1.7,
            maxWidth: '480px',
            fontWeight: 400
          }}>
            {slogan}
          </p>

          <div style={{
            width: '60px',
            height: '3px',
            background: 'linear-gradient(90deg, #81C784, transparent)',
            marginTop: '32px',
            borderRadius: '2px'
          }}></div>
        </div>
      </div>

      {/* RIGHT: Sign Up Panel */}
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
            🌾
          </div>

          {/* Title */}
          <h2 style={{
            textAlign: 'center',
            margin: '0 0 8px',
            fontSize: '28px',
            fontWeight: 700,
            color: theme.primary,
            letterSpacing: '-0.5px'
          }}>
            CREATE ACCOUNT
          </h2>

          <p style={{
            textAlign: 'center',
            margin: '0 0 32px',
            color: '#666',
            fontSize: '14px'
          }}>
            Join the AniWay marketplace today!
          </p>

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
          
          {success && (
            <div style={{
              background: '#E8F5E9',
              color: '#2E7D32',
              padding: '12px 16px',
              borderRadius: '10px',
              marginBottom: '20px',
              fontSize: '13px',
              textAlign: 'center',
              border: '1px solid #81C784',
              fontWeight: 500
            }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* First Name Field */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                color: theme.text, 
                fontSize: '13px', 
                fontWeight: 600
              }}>
                First Name
              </label>
              <input
                type="text"
                placeholder="Juan"
                value={form.firstName}
                onChange={e => setForm({...form, firstName: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #E0E0E0',
                  borderRadius: '12px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  background: theme.inputBg,
                  transition: 'all 0.3s'
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

            {/* Email Field */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                color: theme.text, 
                fontSize: '13px', 
                fontWeight: 600
              }}>
                Email
              </label>
              <input
                type="email"
                placeholder="juan@example.com"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #E0E0E0',
                  borderRadius: '12px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  background: theme.inputBg,
                  transition: 'all 0.3s'
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
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                color: theme.text, 
                fontSize: '13px', 
                fontWeight: 600
              }}>
                Password
              </label>
              <input
                type="password"
                placeholder="Min 6 characters"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #E0E0E0',
                  borderRadius: '12px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  background: theme.inputBg,
                  transition: 'all 0.3s'
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

            {/* Confirm Password Field */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                color: theme.text, 
                fontSize: '13px', 
                fontWeight: 600
              }}>
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Repeat password"
                value={form.confirmPassword}
                onChange={e => setForm({...form, confirmPassword: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #E0E0E0',
                  borderRadius: '12px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  background: theme.inputBg,
                  transition: 'all 0.3s'
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

            {/* Sign Up Button */}
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
                transition: 'all 0.3s',
                marginBottom: '24px',
                boxShadow: '0 4px 16px rgba(27, 94, 32, 0.25)'
              }}
              onMouseOver={e => {
                e.target.style.background = 'linear-gradient(135deg, #2E7D32 0%, #388E3C 100%)';
                e.target.style.boxShadow = '0 6px 24px rgba(46, 125, 50, 0.35)';
              }}
              onMouseOut={e => {
                e.target.style.background = 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)';
                e.target.style.boxShadow = '0 4px 16px rgba(27, 94, 32, 0.25)';
              }}
            >
              Create Account
            </button>

            {/* Login Link */}
            <p style={{
              textAlign: 'center',
              color: '#666',
              fontSize: '14px',
              margin: 0
            }}>
              Already have an account?{' '}
              <span
                onClick={onGoToLogin}
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
                Sign In
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}