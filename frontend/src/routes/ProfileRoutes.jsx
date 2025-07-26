import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Profile from '@pages/Profile'

const ProfileRoutes = () => {
  return (
    <Routes>
      {/* Own profile */}
      <Route index element={<Profile />} />
      
      {/* Profile sections */}
      <Route path="edit" element={<Profile section="edit" />} />
      <Route path="settings" element={<Profile section="settings" />} />
      <Route path="privacy" element={<Profile section="privacy" />} />
      <Route path="security" element={<Profile section="security" />} />
      <Route path="notifications" element={<Profile section="notifications" />} />
      <Route path="preferences" element={<Profile section="preferences" />} />
      <Route path="activity" element={<Profile section="activity" />} />
      <Route path="blocked" element={<Profile section="blocked" />} />
      <Route path="export" element={<Profile section="export" />} />
      <Route path="delete" element={<Profile section="delete" />} />
      
      {/* Other user's profile */}
      <Route path="user/:userId" element={<Profile />} />
      <Route path="user/:userId/:section" element={<Profile />} />
      
      {/* Catch all - redirect to main profile */}
      <Route path="*" element={<Navigate to="/profile" replace />} />
    </Routes>
  )
}

export default ProfileRoutes