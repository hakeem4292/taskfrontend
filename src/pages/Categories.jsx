import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

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
      const response = await fetch('https://taskserver-o6od.onrender.com/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, description }),
      });
      
      if (response.ok) {
        setName('');
        setDescription('');
        fetchCategories();
      } else {
        const error = await response.json();
        alert(error.error || 'Error saving category');
      }
    } catch (error) {
      alert('Network error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`https://taskserver-o6od.onrender.com/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        fetchCategories();
      } else {
        alert('Error deleting category');
      }
    } catch (error) {
      alert('Network error');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/dashboard" style={{ 
          padding: '8px 15px', 
          background: '#6c757d', 
          color: 'white',
          textDecoration: 'none' 
        }}>
          ← Back
        </Link>
        <h2 style={{ marginTop: '20px' }}>Categories</h2>
      </div>

      {/* Add Form */}
      <div style={{ padding: '20px', border: '1px solid #ccc', marginBottom: '20px' }}>
        <h3>Add Category</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', padding: '8px', height: '60px', marginBottom: '10px' }}
          />
          <button type="submit" style={{ 
            padding: '8px 15px', 
            background: '#007bff', 
            color: 'white',
            border: 'none' 
          }}>
            Add Category
          </button>
        </form>
      </div>

      {/* Categories List */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f2f2f2' }}>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Name</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Description</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr key={category._id}>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{category.name}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{category.description}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                <button onClick={() => handleDelete(category._id)} style={{ 
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

export default Categories;