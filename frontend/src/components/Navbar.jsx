import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import {
  Home,
  PlusCircle,
  Bell,
  Search,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  Shield,
  Heart,
  HeartHandshake,
  FileText,
  Sparkles
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, hasPermission } = useContext(AuthContext);
  const { theme, setTheme, THEMES, isDark } = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const profileMenuRef = useRef(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  const navItems = [
    { name: 'Feed', href: '/feed', icon: Home, active: location.pathname.startsWith('/feed') && location.pathname !== '/feed/create' && location.pathname !== '/feed/drafts' },
    { name: 'Create', href: '/feed/create', icon: PlusCircle, active: location.pathname === '/feed/create' },
    { name: 'Drafts', href: '/feed/drafts', icon: FileText, active: location.pathname === '/feed/drafts' }
  ];

  if (hasPermission('admin_access') || user?.role === 'admin') {
    navItems.push({
      name: 'Admin',
      href: '/admin',
      icon: Shield,
      active: location.pathname.startsWith('/admin')
    });
  }

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/feed/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-white/30 dark:border-gray-700/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/feed" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 rounded-xl shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 group-hover:scale-110 transition-all duration-300">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-gray-900 animate-pulse" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Heart<span className="text-gradient">Out</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${item.active
                      ? 'text-white bg-gradient-to-r from-primary-500 to-secondary-500 shadow-lg shadow-primary-500/30'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-800/80'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                    {item.name === 'Create' && !item.active && (
                      <Sparkles className="w-3 h-3 text-secondary-500" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="w-full relative">
                <div className={`relative transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    placeholder="Search stories..."
                    className={`w-full pl-11 pr-4 py-2.5 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 rounded-xl text-sm focus:outline-none transition-all duration-300 ${isSearchFocused
                      ? 'border-primary-500 shadow-lg shadow-primary-500/20'
                      : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                      }`}
                  />
                </div>
              </form>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-2">
              {/* Support */}
              <Link
                to="/support"
                className="relative p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all duration-300 group"
                title="Need Support?"
              >
                <HeartHandshake className="w-5 h-5 group-hover:text-rose-500 transition-colors" />
              </Link>

              {/* Notifications */}
              <button className="relative p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-300 group">
                <Bell className="w-5 h-5 group-hover:text-primary-500 transition-colors" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(isDark ? THEMES.LIGHT : THEMES.DARK)}
                className="p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-300 group"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 group-hover:text-amber-500 transition-colors" />
                ) : (
                  <Moon className="w-5 h-5 group-hover:text-indigo-500 transition-colors" />
                )}
              </button>

              {/* Profile Menu */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 p-1 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-300"
                >
                  <div className="relative">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 via-secondary-500 to-accent-500 p-0.5">
                      <div className="w-full h-full rounded-[10px] bg-white dark:bg-gray-800 flex items-center justify-center">
                        <span className="text-sm font-bold text-gradient">
                          {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 glass-card rounded-2xl shadow-xl py-2 animate-scale-in origin-top-right">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {user?.display_name || user?.username}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.email}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>

                      <Link
                        to="/profile/settings"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                    </div>

                    <hr className="my-1 border-gray-100 dark:border-gray-700/50" />

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-300"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass border-t border-white/20 dark:border-gray-700/30 animate-slide-down">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${item.active
                      ? 'text-white bg-gradient-to-r from-primary-500 to-secondary-500 shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-800/80'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;