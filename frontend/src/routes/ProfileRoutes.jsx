import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';

export default function ProfileRoutes() {
  return (
    <Routes>
      <Route index element={<Profile />} />
      <Route path="settings" element={<Settings />} />
      <Route path=":userId" element={<Profile />} />
      <Route path="*" element={<Navigate to="/profile" replace />} />
    </Routes>
  );
}