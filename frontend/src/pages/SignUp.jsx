import { useState } from 'react';
import { signUp } from '../api';

export default function SignUp({ onGoToLogin }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signUp(form);
    if (res.success) {
      setSuccess('Account created! Redirecting...');
      setTimeout(onGoToLogin, 1500);
    } else {
      setError(res.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '50px auto' }}>
      <h2>Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <input placeholder="First Name" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} required style={{ display: 'block', width: '100%', padding: 8, marginBottom: 10 }} />
      <input placeholder="Last Name" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} required style={{ display: 'block', width: '100%', padding: 8, marginBottom: 10 }} />
      <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required style={{ display: 'block', width: '100%', padding: 8, marginBottom: 10 }} />
      <input type="password" placeholder="Password (min 6)" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required style={{ display: 'block', width: '100%', padding: 8, marginBottom: 10 }} />
      <button type="submit" style={{ width: '100%', padding: 10 }}>Sign Up</button>
      <p style={{ marginTop: 10 }}>Have an account? <button type="button" onClick={onGoToLogin} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}>Login</button></p>
    </form>
  );
}