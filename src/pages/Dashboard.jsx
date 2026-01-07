// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ products: 0, categories: 0, users: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      // If no user data, redirect to login
      navigate('/login');
    }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      const [productsRes, categoriesRes, usersRes] = await Promise.all([
        fetch('https://taskserver-o6od.onrender.com/api/products', { headers }),
        fetch('https://taskserver-o6od.onrender.com/api/categories', { headers }),
        fetch('https://taskserver-o6od.onrender.com/api/users', { headers }),
      ]);

      // Check if responses are OK
      if (!productsRes.ok || !categoriesRes.ok || !usersRes.ok) {
        // If any request fails with 401, redirect to login
        if (productsRes.status === 401 || categoriesRes.status === 401 || usersRes.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }
      }

      const products = await productsRes.json();
      const categories = await categoriesRes.json();
      const users = await usersRes.json();
      
      setStats({
        products: products.products?.length || 0,
        categories: categories.categories?.length || 0,
        users: users.users?.length || 0,
      });
    } catch (error) {
      console.log('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>Dashboard</h2>
        <div>
          <span style={{ marginRight: '15px' }}>Welcome, {user.name} ({user.role})</span>
          <button onClick={handleLogout} style={{ 
            padding: '8px 15px', 
            background: '#dc3545', 
            color: 'white',
            border: 'none' 
          }}>
            Logout
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <Link to="/products" style={{ 
          padding: '10px 20px', 
          background: '#28a745', 
          color: 'white',
          textDecoration: 'none' 
        }}>
          Products
        </Link>
        <Link to="/categories" style={{ 
          padding: '10px 20px', 
          background: '#17a2b8', 
          color: 'white',
          textDecoration: 'none' 
        }}>
          Categories
        </Link>
        <Link to="/users" style={{ 
          padding: '10px 20px', 
          background: '#6c757d', 
          color: 'white',
          textDecoration: 'none' 
        }}>
          Users
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ 
          flex: 1, 
          padding: '20px', 
          border: '1px solid #007bff',
          background: '#e3f2fd' 
        }}>
          <h3>Products</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.products}</p>
        </div>
        
        <div style={{ 
          flex: 1, 
          padding: '20px', 
          border: '1px solid #28a745',
          background: '#e8f5e9' 
        }}>
          <h3>Categories</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.categories}</p>
        </div>
        
        <div style={{ 
          flex: 1, 
          padding: '20px', 
          border: '1px solid #ffc107',
          background: '#fff3cd' 
        }}>
          <h3>Users</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.users}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;