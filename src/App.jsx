import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Users from './pages/Users';

function App() {
  const token = localStorage.getItem('token');
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={
          token ? <Dashboard /> : <Navigate to="/login" />
        } />
        
        <Route path="/products" element={
          token ? <Products /> : <Navigate to="/login" />
        } />
        
        <Route path="/categories" element={
          token ? <Categories /> : <Navigate to="/login" />
        } />
        
        <Route path="/users" element={
          token ? <Users /> : <Navigate to="/login" />
        } />
        
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;