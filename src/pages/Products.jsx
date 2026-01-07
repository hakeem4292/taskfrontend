import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    sku: '',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('https://taskserver-o6od.onrender.com/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.log('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('https://taskserver-o6od.onrender.com/api/categories', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.log('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const url = editingId 
        ? `https://taskserver-o6od.onrender.com/api/products/${editingId}`
        : 'https://taskserver-o6od.onrender.com/api/products';
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setShowForm(false);
        setFormData({ name: '', description: '', price: '', category: '', stock: '', sku: '' });
        setEditingId(null);
        fetchProducts();
      } else {
        const error = await response.json();
        alert(error.error || 'Error saving product');
      }
    } catch (error) {
      alert('Network error');
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category?._id || product.category,
      stock: product.stock,
      sku: product.sku,
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`https://taskserver-o6od.onrender.com/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        fetchProducts();
      } else {
        alert('Error deleting product');
      }
    } catch (error) {
      alert('Network error');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>Products</h2>
        <div>
          <Link to="/dashboard" style={{ 
            padding: '8px 15px', 
            background: '#6c757d', 
            color: 'white',
            textDecoration: 'none',
            marginRight: '10px' 
          }}>
            ← Back
          </Link>
          <button onClick={() => setShowForm(true)} style={{ 
            padding: '8px 15px', 
            background: '#28a745', 
            color: 'white',
            border: 'none' 
          }}>
            Add Product
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div style={{ 
          padding: '20px', 
          border: '1px solid #ccc', 
          marginBottom: '20px',
          background: '#f8f9fa' 
        }}>
          <h3>{editingId ? 'Edit Product' : 'Add Product'}</h3>
          
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Product Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            />
            
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
              style={{ width: '100%', padding: '8px', height: '80px', marginBottom: '10px' }}
            />
            
            <input
              type="text"
              placeholder="SKU"
              value={formData.sku}
              onChange={(e) => setFormData({...formData, sku: e.target.value})}
              required
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            />
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
                style={{ flex: 1, padding: '8px' }}
              />
              
              <input
                type="number"
                placeholder="Stock"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                required
                style={{ flex: 1, padding: '8px' }}
              />
            </div>
            
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              required
              style={{ width: '100%', padding: '8px', marginBottom: '15px' }}
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            
            <div>
              <button type="button" onClick={() => {
                setShowForm(false);
                setFormData({ name: '', description: '', price: '', category: '', stock: '', sku: '' });
                setEditingId(null);
              }} style={{ 
                padding: '8px 15px', 
                background: '#6c757d', 
                color: 'white',
                border: 'none',
                marginRight: '10px' 
              }}>
                Cancel
              </button>
              
              <button type="submit" style={{ 
                padding: '8px 15px', 
                background: '#007bff', 
                color: 'white',
                border: 'none' 
              }}>
                {editingId ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f2f2f2' }}>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Name</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>SKU</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Price</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Stock</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Category</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id}>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{product.name}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{product.sku}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>${product.price}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{product.stock}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                {product.category?.name || 'N/A'}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                <button onClick={() => handleEdit(product)} style={{ 
                  padding: '5px 10px', 
                  background: '#ffc107', 
                  color: 'black',
                  border: 'none',
                  marginRight: '5px' 
                }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(product._id)} style={{ 
                  padding: '5px 10px', 
                  background: '#dc3545', 
                  color: 'white',
                  border: 'none' 
                }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;