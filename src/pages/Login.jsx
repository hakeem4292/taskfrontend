import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://taskserver-o6od.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '100px auto', 
      padding: '20px',
      border: '1px solid #ccc' 
    }}>
      <h2>Login</h2>
      
      {error && (
        <div style={{ background: '#fee', color: '#c00', padding: '10px', marginBottom: '15px' }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        
        <button type="submit" style={{ 
          width: '100%', 
          padding: '10px', 
          background: '#007bff', 
          color: 'white',
          border: 'none' 
        }}>
          Login
        </button>
      </form>
      
      <div style={{ marginTop: '20px', fontSize: '14px' }}>
        <p>Demo accounts:</p>
        <p>•Admin:adminhakeem@gmail.com, / pass:hakeem@123</p>
        <p>• Product Manager: james@123 / james@123</p>
        <p>• Viewer: ajmal@123/ ajmal@123</p>
      </div>
    </div>
  );
};

export default Login;