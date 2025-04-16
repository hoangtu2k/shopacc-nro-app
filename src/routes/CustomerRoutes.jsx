import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/customer/Home';
import ProductList from '../pages/customer/ProductList';
import ProductDetail from '../pages/customer/ProductDetail';
import Cart from '../pages/customer/Cart';
import Checkout from '../pages/customer/Checkout';

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
    </Routes>
  );
};

export default CustomerRoutes;