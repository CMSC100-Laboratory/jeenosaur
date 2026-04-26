import { useState, useEffect } from 'react';
import { addProduct, getAllUsers, deleteUser, getAllProducts, updateProduct, deleteProduct } from '../api';

export default function AdminDashboard({ user, onLogout }) {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ id: '', productName: '', productDescription: '', productType: 1, productQuantity: 1, price: 0 });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    getAllUsers().then(res => setUsers(res.users || [])).catch(() => setUsers([]));
    getAllProducts().then(setProducts).catch(() => setProducts([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) await updateProduct(form);
      else { const { id, ...data } = form; await addProduct(data); }
      setForm({ id: '', productName: '', productDescription: '', productType: 1, productQuantity: 1, price: 0 });
      setIsEditing(false);
      getAllProducts().then(setProducts);
    } catch (err) { alert('Failed: ' + (err.message || 'Unknown')); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await deleteUser(id);
    setUsers(users.filter(u => u._id !== id));
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await deleteProduct(id);
    setProducts(products.filter(p => p._id !== id));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2>Admin Dashboard</h2>
        <button onClick={onLogout}>Logout</button>
      </div>

      <h3>{isEditing ? 'Edit Product' : 'Add Product'}</h3>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10, maxWidth: 400, marginBottom: 30 }}>
        <input placeholder="Name" value={form.productName} onChange={e => setForm({...form, productName: e.target.value})} required />
        <input placeholder="Description" value={form.productDescription} onChange={e => setForm({...form, productDescription: e.target.value})} required />
        <select value={form.productType} onChange={e => setForm({...form, productType: Number(e.target.value)})}>
          <option value={1}>Crop</option>
          <option value={2}>Poultry</option>
        </select>
        <input type="number" placeholder="Quantity" value={form.productQuantity} onChange={e => setForm({...form, productQuantity: e.target.value})} required />
        <input type="number" placeholder="Price" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
        <button type="submit">{isEditing ? 'Update' : 'Add'} Product</button>
        {isEditing && <button type="button" onClick={() => { setIsEditing(false); setForm({ id: '', productName: '', productDescription: '', productType: 1, productQuantity: 1, price: 0 }); }}>Cancel</button>}
      </form>

      <h3>Products</h3>
      <ul style={{ listStyle: 'none', padding: 0, marginBottom: 30 }}>
        {products.map(p => (
          <li key={p._id} style={{ border: '1px solid #ddd', padding: 10, marginBottom: 5, display: 'flex', justifyContent: 'space-between' }}>
            <span>{p.productName} (₱{p.price})</span>
            <div>
              <button onClick={() => { setForm({ id: p._id, productName: p.productName, productDescription: p.productDescription, productType: p.productType, productQuantity: p.productQuantity, price: p.price }); setIsEditing(true); }} style={{ marginRight: 5 }}>Edit</button>
              <button onClick={() => handleDeleteProduct(p._id)} style={{ color: 'red' }}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      <h3>Users</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {users.map(u => (
          <li key={u._id} style={{ marginBottom: 5, display: 'flex', justifyContent: 'space-between' }}>
            <span>{u.firstName} {u.lastName} ({u.userType}) - {u.email}</span>
            {u.userType !== 'Admin' && <button onClick={() => handleDeleteUser(u._id)} style={{ color: 'red' }}>Delete</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}