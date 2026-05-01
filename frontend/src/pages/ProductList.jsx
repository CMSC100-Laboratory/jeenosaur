import { useState, useEffect } from 'react';
import { getAllProducts, addToCart } from '../api';

export default function ProductList({ user, onLogout, onCartUpdate }) {
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('productName');
  const [order, setOrder] = useState('asc');
  const [addingToCart, setAddingToCart] = useState(null); // Track which product is being added

  useEffect(() => {
    getAllProducts(sortBy, order).then(setProducts).catch(console.error);
  }, [sortBy, order]);

  const handleAddToCart = async (productId, availableQty) => {
    if (addingToCart === productId) return; // Prevent double-click
    
    setAddingToCart(productId);
    try {
      const res = await addToCart({ productId, quantity: 1 });
      if (res.success) {
        // Notify parent to update cart badge count
        onCartUpdate?.();
        // Optional: Show temporary success feedback
        alert('✓ Added to cart');
      } else {
        alert('Failed: ' + (res.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setAddingToCart(null);
    }
  };

  const getStockStatus = (qty) => {
    if (qty <= 0) return { text: 'Out of Stock', color: '#dc3545', disabled: true };
    if (qty <= 5) return { text: `Low Stock (${qty})`, color: '#fd7e14', disabled: false };
    return { text: `In Stock (${qty})`, color: '#28a745', disabled: false };
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 900, margin: '0 auto', padding: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0 }}>🌾 Farm to Table Products</h2>
        <div>
          {user?.userType === 'Admin' && (
            <button onClick={() => window.location.href = '#admin'} style={{ marginRight: 10, padding: '8px 16px' }}>
              ⚙️ Admin Panel
            </button>
          )}
          <button onClick={onLogout} style={{ padding: '8px 16px' }}>Logout</button>
        </div>
      </div>

      {/* Sorting Controls - Wireframe Style */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ color: '#666', fontSize: 14 }}>Sort by:</span>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #ddd' }}>
          <option value="productName">Name</option>
          <option value="price">Price</option>
          <option value="productQuantity">Quantity</option>
          <option value="productType">Type</option>
        </select>
        <select value={order} onChange={e => setOrder(e.target.value)} style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #ddd' }}>
          <option value="asc">↑ Ascending</option>
          <option value="desc">↓ Descending</option>
        </select>
      </div>

      {/* Product Grid - Wireframe Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {products.map(p => {
          const stock = getStockStatus(p.productQuantity);
          return (
            <div key={p._id} style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 16, background: '#fff', display: 'flex', flexDirection: 'column' }}>
              {/* Product Image Placeholder */}
              <div style={{ 
                width: '100%', height: 120, background: '#f5f5f5', borderRadius: 4, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontSize: 32, marginBottom: 12, color: '#999' 
              }}>
                {p.productType === 1 ? '🌾' : '🐔'}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <strong style={{ fontSize: 16 }}>{p.productName}</strong>
                  <span style={{ 
                    fontSize: 12, padding: '2px 8px', borderRadius: 10, 
                    background: '#f0f0f0', color: '#666' 
                  }}>
                    {p.productType === 1 ? 'Crop' : 'Poultry'}
                  </span>
                </div>
                <p style={{ margin: '8px 0', color: '#666', fontSize: 14, lineHeight: 1.4 }}>
                  {p.productDescription}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <div>
                    <span style={{ fontSize: 18, fontWeight: 600, color: '#2e7d32' }}>₱{p.price.toFixed(2)}</span>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: stock.color }}>
                      {stock.text}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleAddToCart(p._id, p.productQuantity)}
                    disabled={stock.disabled || addingToCart === p._id}
                    style={{
                      padding: '8px 16px',
                      background: stock.disabled ? '#e0e0e0' : '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      cursor: stock.disabled ? 'not-allowed' : 'pointer',
                      fontSize: 14,
                      fontWeight: 500,
                      opacity: addingToCart === p._id ? 0.7 : 1
                    }}
                  >
                    {addingToCart === p._id ? 'Adding...' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {products.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>
          <p>No products available</p>
          {user?.userType === 'Admin' && (
            <p style={{ fontSize: 13 }}>→ Add products from Admin Dashboard</p>
          )}
        </div>
      )}

      {/* Wireframe Annotation */}
      <div style={{ marginTop: 24, padding: 12, background: '#e3f2fd', border: '1px dashed #2196F3', borderRadius: 4, fontSize: 13, color: '#0d47a1' }}>
        💡 <strong>Persistence Note:</strong> "Add to Cart" saves to MongoDB via /add-to-cart. Cart persists across sessions for logged-in users.
      </div>
    </div>
  );
}