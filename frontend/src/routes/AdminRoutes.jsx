import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthContext } from '@context/AuthContext'
import AdminPanel from '@pages/AdminPanel'
import { Shield, AlertTriangle } from 'lucide-react'

// Admin layout wrapper
const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Admin header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg">
                <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Admin Panel
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  HeartOut Administration
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-yellow-600 dark:text-yellow-400">
              <AlertTriangle className="w-4 h-4" />
              <span>Restricted Access</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Admin content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}

// Access denied component
const AccessDenied = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center space-y-4">
      <div className="mx-auto h-16 w-16 text-red-500">
        <Shield className="w-full h-full" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Access Denied
      </h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md">
        You don't have permission to access the admin panel. Please contact an administrator if you believe this is an error.
      </p>
      <button
        onClick={() => window.history.back()}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        Go Back
      </button>
    </div>
  </div>
)

const AdminRoutes = () => {
  const { user, hasPermission } = useContext(AuthContext)

  // Check if user has admin access
  if (!user || (user.role !== 'admin' && !hasPermission('admin_access'))) {
    return <AccessDenied />
  }

  return (
    <AdminLayout>
      <Routes>
        {/* Main admin panel */}
        <Route index element={<AdminPanel />} />
        
        {/* Dashboard */}
        <Route path="dashboard" element={<AdminPanel section="dashboard" />} />
        
        {/* User management */}
        <Route path="users" element={<AdminPanel section="users" />} />
        <Route path="users/:userId" element={<AdminPanel section="user-detail" />} />
        
        {/* Content management */}
        <Route path="posts" element={<AdminPanel section="posts" />} />
        <Route path="posts/:postId" element={<AdminPanel section="post-detail" />} />
        
        {/* Reports and moderation */}
        <Route path="reports" element={<AdminPanel section="reports" />} />
        <Route path="reports/:reportId" element={<AdminPanel section="report-detail" />} />
        <Route path="moderation" element={<AdminPanel section="moderation" />} />
        
        {/* Analytics */}
        <Route path="analytics" element={<AdminPanel section="analytics" />} />
        <Route path="analytics/:type" element={<AdminPanel section="analytics-detail" />} />
        
        {/* System settings */}
        <Route path="settings" element={<AdminPanel section="settings" />} />
        <Route path="settings/:category" element={<AdminPanel section="settings-detail" />} />
        
        {/* Logs and monitoring */}
        <Route path="logs" element={<AdminPanel section="logs" />} />
        <Route path="monitoring" element={<AdminPanel section="monitoring" />} />
        
        {/* Support management */}
        <Route path="support" element={<AdminPanel section="support" />} />
        <Route path="support/emergency" element={<AdminPanel section="emergency-support" />} />
        
        {/* Backup and maintenance */}
        <Route path="maintenance" element={<AdminPanel section="maintenance" />} />
        
        {/* Catch all - redirect to main admin panel */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  )
}

export default AdminRoutes