import { useState, useEffect } from 'react';
import { signUp } from '../api';
import dayImage from '../assets/day.png';
import noonImage from '../assets/noon.png';
import sunsetImage from '../assets/sunset.png';
import nightImage from '../assets/night.png';

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
      overlay: 'linear-gradient(135deg, rgba(27, 94, 32, 0.7) 0%, rgba(76, 175, 80, 0.5) 100%)',
      accent: '#81C784',
      panel: 'linear-gradient(135deg, #F1F8E9 0%, #FFFFFF 100%)',
      btn: 'linear-gradient(135deg, #2E7D32 0%, #43A047 100%)',
      btnHover: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
      shadow: 'rgba(46, 125, 50, 0.2)',
      greeting: 'Sunrise Harvests',
      sub: 'Fresh from the fields to your table'
    },
    noon: {
      bg: `url(${noonImage})`,
      overlay: 'linear-gradient(135deg, rgba(27, 94, 32, 0.7) 0%, rgba(76, 175, 80, 0.45) 50%, rgba(165, 214, 167, 0.25) 100%)',
      accent: '#66BB6A',
      panel: 'linear-gradient(135deg, #E8F5E9 0%, #FFFFFF 100%)',
      btn: 'linear-gradient(135deg, #2E7D32 0%, #43A047 100%)',
      btnHover: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
      shadow: 'rgba(46, 125, 50, 0.25)',
      greeting: 'Peak Harvest',
      sub: 'Market is open, fresh picks await'
    },
    sunset: {
      bg: `url(${sunsetImage})`,
      overlay: 'linear-gradient(135deg, rgba(230, 81, 0, 0.7) 0%, rgba(255, 167, 38, 0.6) 100%)',
      accent: '#FFB74D',
      panel: 'linear-gradient(135deg, #FFF8E1 0%, #FFFFFF 100%)',
      btn: 'linear-gradient(135deg, #E65100 0%, #EF6C00 100%)',
      btnHover: 'linear-gradient(135deg, #BF360C 0%, #E65100 100%)',
      shadow: 'rgba(230, 81, 0, 0.2)',
      greeting: 'Golden Hour',
      sub: 'Daily market closing soon'
    },
    night: {
      bg: `url(${nightImage})`,
      overlay: 'linear-gradient(135deg, rgba(13, 71, 161, 0.85) 0%, rgba(27, 94, 32, 0.75) 100%)',
      accent: '#64B5F6',
      panel: 'linear-gradient(135deg, #E3F2FD 0%, #F1F8E9 100%)',
      btn: 'linear-gradient(135deg, #1565C0 0%, #2E7D32 100%)',
      btnHover: 'linear-gradient(135deg, #0D47A1 0%, #1B5E20 100%)',
      shadow: 'rgba(13, 71, 161, 0.3)',
      greeting: 'Starlight Harvests',
      sub: 'Resting for tomorrow\'s fresh picks'
    }
  };

  const theme = themes[timeOfDay];
  const isGreenTime = timeOfDay === 'morning' || timeOfDay === 'noon';
  const focusColor = timeOfDay === 'night' ? '#1565C0' : timeOfDay === 'sunset' ? '#E65100' : isGreenTime ? '#43A047' : '#43A047';

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
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', fontFamily: "'Inter', sans-serif", overflow: 'hidden', transition: 'all 0.8s cubic-bezier(0.4,0,0.2,1)' }}>
      
      {/* LEFT: Dynamic Image & Branding */}
      <div style={{ flex: '1.2', backgroundImage: theme.bg, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px', transition: 'all 0.8s cubic-bezier(0.4,0,0.2,1)', animation: isLoaded ? 'fadeIn 1s ease-out' : 'none' }}>
        <div style={{ position: 'absolute', inset: 0, background: theme.overlay, transition: 'all 0.8s cubic-bezier(0.4,0,0.2,1)', zIndex: 1 }}></div>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.05) 0%, transparent 50%)', zIndex: 1, pointerEvents: 'none' }}></div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '10px 20px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.3)', marginBottom: '30px', animation: isLoaded ? 'slideUp 0.8s ease-out 0.2s both' : 'none' }}>
            <span style={{ fontSize: '1.2rem' }}>🌾</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: '#fff' }}>Farm to Table</span>
          </div>
          <h1 style={{ fontSize: '5rem', fontWeight: 900, margin: '0 0 20px', lineHeight: 1, color: '#fff', textShadow: '0 4px 20px rgba(0,0,0,0.2)', letterSpacing: '-2px', animation: isLoaded ? 'slideUp 0.8s ease-out 0.3s both' : 'none' }}>AniWay</h1>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 600, margin: '0 0 16px', color: '#FFFFFF', textShadow: '0 2px 10px rgba(0,0,0,0.15)', animation: isLoaded ? 'slideUp 0.8s ease-out 0.4s both' : 'none' }}>{theme.greeting}</h2>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.95)', lineHeight: 1.7, marginBottom: '40px', fontWeight: 400, animation: isLoaded ? 'slideUp 0.8s ease-out 0.5s both' : 'none' }}>{theme.sub}</p>
          <div style={{ width: '80px', height: '4px', background: `linear-gradient(90deg, ${theme.accent}, transparent)`, borderRadius: '2px', animation: isLoaded ? 'expandWidth 0.8s ease-out 0.6s both' : 'none' }}></div>
        </div>
      </div>

      {/* RIGHT: Signup Form */}
      <div style={{ flex: '0.8', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA', padding: '40px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-50%', right: '-20%', width: '400px', height: '400px', background: `radial-gradient(circle, ${theme.shadow} 0%, transparent 70%)`, opacity: 0.1, pointerEvents: 'none' }}></div>
        
        <div style={{ width: '100%', maxWidth: '420px', background: theme.panel, padding: '40px 36px', borderRadius: '24px', boxShadow: `0 20px 60px ${theme.shadow}, 0 4px 12px rgba(0,0,0,0.05)`, border: '1px solid rgba(255,255,255,0.8)', position: 'relative', zIndex: 1, animation: isLoaded ? 'fadeIn 1s ease-out 0.3s both' : 'none', transition: 'all 0.8s cubic-bezier(0.4,0,0.2,1)' }}>
          <div style={{ width: '70px', height: '70px', background: theme.btn, margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '18px', fontSize: '32px', boxShadow: `0 8px 24px ${theme.shadow}` }}>🌾</div>
          <h2 style={{ textAlign: 'center', margin: '0 0 8px', fontSize: '28px', fontWeight: 700, color: isGreenTime ? '#2E7D32' : timeOfDay === 'sunset' ? '#E65100' : '#1565C0', letterSpacing: '-0.5px' }}>Create Account</h2>
          <p style={{ textAlign: 'center', margin: '0 0 32px', color: '#666', fontSize: '14px' }}>Join the AniWay marketplace</p>

          {error && <div style={{ background: '#FFEBEE', color: '#C62828', padding: '12px 16px', borderRadius: '10px', marginBottom: '24px', fontSize: '13px', textAlign: 'center', border: '1px solid #EF9A9A', animation: 'shake 0.5s ease-in-out' }}>{error}</div>}
          {success && <div style={{ background: '#E8F5E9', color: '#2E7D32', padding: '12px 16px', borderRadius: '10px', marginBottom: '24px', fontSize: '13px', textAlign: 'center', border: '1px solid #81C784' }}>{success}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#424242', fontSize: '13px', fontWeight: 600 }}>First Name</label>
                <input type="text" placeholder="Juan" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} required style={{ width: '100%', padding: '14px 16px', border: '2px solid #E0E0E0', borderRadius: '12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#FFFFFF', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', color: '#333' }} onFocus={e => { e.target.style.borderColor = focusColor; e.target.style.boxShadow = `0 0 0 4px ${theme.shadow}`; }} onBlur={e => { e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'; }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#424242', fontSize: '13px', fontWeight: 600 }}>Last Name</label>
                <input type="text" placeholder="Dela Cruz" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} required style={{ width: '100%', padding: '14px 16px', border: '2px solid #E0E0E0', borderRadius: '12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#FFFFFF', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', color: '#333' }} onFocus={e => { e.target.style.borderColor = focusColor; e.target.style.boxShadow = `0 0 0 4px ${theme.shadow}`; }} onBlur={e => { e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'; }} />
              </div>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#424242', fontSize: '13px', fontWeight: 600 }}>Email</label>
              <input type="email" placeholder="juan@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required style={{ width: '100%', padding: '14px 16px', border: '2px solid #E0E0E0', borderRadius: '12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#FFFFFF', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', color: '#333' }} onFocus={e => { e.target.style.borderColor = focusColor; e.target.style.boxShadow = `0 0 0 4px ${theme.shadow}`; }} onBlur={e => { e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'; }} />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#424242', fontSize: '13px', fontWeight: 600 }}>Password</label>
              <input type="password" placeholder="Min 6 characters" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required style={{ width: '100%', padding: '14px 16px', border: '2px solid #E0E0E0', borderRadius: '12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#FFFFFF', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', color: '#333' }} onFocus={e => { e.target.style.borderColor = focusColor; e.target.style.boxShadow = `0 0 0 4px ${theme.shadow}`; }} onBlur={e => { e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'; }} />
            </div>
            
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#424242', fontSize: '13px', fontWeight: 600 }}>Confirm Password</label>
              <input type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} required style={{ width: '100%', padding: '14px 16px', border: '2px solid #E0E0E0', borderRadius: '12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#FFFFFF', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', color: '#333' }} onFocus={e => { e.target.style.borderColor = focusColor; e.target.style.boxShadow = `0 0 0 4px ${theme.shadow}`; }} onBlur={e => { e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'; }} />
            </div>

            <button type="submit" style={{ display: 'block', width: '100%', padding: '16px', background: theme.btn, color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', marginBottom: '24px', boxShadow: `0 4px 16px ${theme.shadow}`, letterSpacing: '0.5px' }} onMouseOver={e => { e.target.style.background = theme.btnHover; e.target.style.boxShadow = `0 6px 24px ${theme.shadow}`; e.target.style.transform = 'translateY(-2px)'; }} onMouseOut={e => { e.target.style.background = theme.btn; e.target.style.boxShadow = `0 4px 16px ${theme.shadow}`; e.target.style.transform = 'translateY(0)'; }}>Create Account</button>
            
            <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', margin: 0 }}>Already have an account?{' '}<span onClick={onGoToLogin} style={{ color: isGreenTime ? '#2E7D32' : timeOfDay === 'sunset' ? '#E65100' : '#1565C0', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'all 0.3s' }} onMouseOver={e => e.target.style.borderBottomColor = isGreenTime ? '#2E7D32' : timeOfDay === 'sunset' ? '#E65100' : '#1565C0'} onMouseOut={e => e.target.style.borderBottomColor = 'transparent'}>Sign In</span></p>
          </form>
        </div>
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } } @keyframes expandWidth { from { width: 0; } to { width: 80px; } } @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }`}</style>
    </div>
  );
}