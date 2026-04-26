import { useState, useEffect } from 'react';
import { getAllProducts } from '../api';

export default function ProductList({ user, onLogout }) {
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('productName');
  const [order, setOrder] = useState('asc');

  useEffect(() => {
    getAllProducts(sortBy, order).then(setProducts).catch(console.error);
  }, [sortBy, order]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Farm to Table Products</h2>
        <div>
          {user?.userType === 'Admin' && <button onClick={() => window.location.reload()}>Admin Panel</button>}
          <button onClick={onLogout} style={{ marginLeft: 10 }}>Logout</button>
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        Sort: 
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="productName">Name</option>
          <option value="price">Price</option>
          <option value="productQuantity">Quantity</option>
        </select>
        <select value={order} onChange={e => setOrder(e.target.value)} style={{ marginLeft: 10 }}>
          <option value="asc">↑ Asc</option>
          <option value="desc">↓ Desc</option>
        </select>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {products.map(p => (
          <li key={p._id} style={{ border: '1px solid #ddd', padding: 15, marginBottom: 10, borderRadius: 6 }}>
            <strong>{p.productName}</strong> - ₱{p.price} 
            <span style={{ color: '#666', marginLeft: 10 }}>({p.productType === 1 ? 'Crop' : 'Poultry'})</span>
            <p style={{ margin: '5px 0' }}>{p.productDescription}</p>
            <p style={{ margin: 0, color: '#888' }}>Stock: {p.productQuantity}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}