import { useState } from 'react';
import { login } from '../api';

export default function Login({ onLogin, onGoToSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login({ email, password });
    if (res.success && res.user) {
      onLogin(res.user);
    } else {
      setError(res.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '50px auto' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ display: 'block', width: '100%', padding: 8, marginBottom: 10 }} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ display: 'block', width: '100%', padding: 8, marginBottom: 10 }} />
      <button type="submit" style={{ width: '100%', padding: 10 }}>Login</button>
      <p style={{ marginTop: 10 }}>No account? <button type="button" onClick={onGoToSignUp} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}>Sign Up</button></p>
    </form>
  );
}