import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RequireAuth from '../hooks/RequireAuth';
import Dashboard from '../pages/admin/Dashboard';
import UserManagement from '../pages/admin/UserManagement';
import ProductManagement from '../pages/admin/ProductManagement';
import Login from '../pages/admin/Login';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/admin/users" element={<RequireAuth><UserManagement /></RequireAuth>} />
      <Route path="/admin/login" element={<RequireAuth><Login /></RequireAuth>} />
      <Route path="/admin/products" element={<RequireAuth><ProductManagement /></RequireAuth>} />
    </Routes>
  );
};

export default AdminRoutes;