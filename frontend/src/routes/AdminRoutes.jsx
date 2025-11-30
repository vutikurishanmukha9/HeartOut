import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminPanel from '../pages/AdminPanel';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route index element={<AdminPanel />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}