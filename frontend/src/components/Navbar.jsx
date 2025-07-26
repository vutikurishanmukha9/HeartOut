import React, { useState, useContext, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthContext } from '@context/AuthContext'
import { ThemeContext } from '@context/ThemeContext'
import {
  Home,
  PlusCircle,
  MessageCircle,
  Bell,
  Search,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  Monitor,
  Shield,
  Heart,
  Phone,
  FileText,
  ChevronDown,
  Zap
} from 'lucide-react'
import EmergencyBadge from './EmergencyBadge'
import SupportButton from './SupportButton'
import toast from 'react-hot-toast'

const Navbar = () => {
  const { user, logout, hasPermission } = useContext(AuthContext)
  const { theme, setTheme, THEMES, isDark } = useContext(ThemeContext)
  const location = useLocation()
  const navigate = useNavigate()
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const profileMenuRef = useRef(null)
  const themeMenuRef = useRef(null)
  const searchRef = useRef(null)

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false)
      }
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target)) {
        setIsThemeMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Navigation items
  const navItems = [
    {
      name: 'Feed',
      href: '/feed',
      icon: Home,
      active: location.pathname.startsWith('/feed')
    },
    {
      name: 'Create',
      href: '/feed/create',
      icon: PlusCircle,
      active: location.pathname === '/feed/create'
    },
    {
      name: 'Drafts',
      href: '/feed/drafts',
      icon: FileText,
      active: location.pathname === '/feed/drafts'
    },
    {
      name: 'Support',
      href: '/support',
      icon: Heart,
      active: location.pathname.startsWith('/support')
    }
  ]

  // Add admin link if user has permission
  if (hasPermission('admin_access') || user?.role === 'admin') {
    navItems.push({
      name: 'Admin',
      href: '/admin',
      icon: Shield,
      active: location.pathname.startsWith('/admin'),
      restricted: true
    })
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
      navigate('/auth/login')
    } catch (error) {
      toast.error('Logout failed')
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/feed/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setIsSearchFocused(false)
    }
  }

  const themeOptions = [
    { key: THEMES.LIGHT, label: 'Light', icon: Sun },
    { key: THEMES.DARK, label: 'Dark', icon: Moon },
    { key: THEMES.AUTO, label: 'System', icon: Monitor }
  ]

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              to="/feed"
              className="flex items-center space-x-2 group"
            >
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg group-hover:scale-105 transition-transform duration-200">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white font-heading">
                Heart<span className="text-primary-600">Out</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      relative flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${
                        item.active
                          ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                      ${item.restricted ? 'border border-red-200 dark:border-red-800' : ''}
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                    {item.active && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-primary-100 dark:bg-primary-900/30 rounded-lg -z-10"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="w-full relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    placeholder="Search posts, users..."
                    className={`
                      w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full text-sm
                      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                      transition-all duration-200
                      ${isSearchFocused ? 'bg-white dark:bg-gray-700 shadow-lg' : ''}
                    `}
                  />
                </div>
              </form>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* Emergency Support */}
              <EmergencyBadge />

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Video Call */}
              <SupportButton />

              {/* Theme Selector */}
              <div className="relative" ref={themeMenuRef}>
                <button
                  onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                >
                  {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>

                <AnimatePresence>
                  {isThemeMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1"
                    >
                      {themeOptions.map((option) => {
                        const Icon = option.icon
                        return (
                          <button
                            key={option.key}
                            onClick={() => {
                              setTheme(option.key)
                              setIsThemeMenuOpen(false)
                            }}
                            className={`
                              w-full flex items-center space-x-3 px-4 py-2 text-sm transition-colors duration-200
                              ${
                                theme === option.key
                                  ? 'text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/20'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                              }
                            `}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{option.label}</span>
                            {theme === option.key && (
                              <Zap className="w-3 h-3 ml-auto" />
                            )}
                          </button>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile Menu */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-sm font-medium">
                        {user?.username?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>

                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1"
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user?.displayName || user?.username}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user?.email}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>

                      <Link
                        to="/profile/settings"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>

                      <hr className="my-1 border-gray-200 dark:border-gray-700" />

                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false)
                          handleLogout()
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="px-4 py-2 space-y-1">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </form>

                {/* Mobile Navigation Items */}
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`
                        flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                        ${
                          item.active
                            ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  )
}

export default Navbar