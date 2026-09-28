import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  Shield,
  Heart,
  Sparkles,
  Flame,
  PenLine,
  BookMarked,
  X
} from 'lucide-react';
import { useWebSocket } from '../hooks/useWebSocket.jsx';
import haptic from '../utils/haptics';

const Navbar = () => {
  const { user, logout, hasPermission } = useContext(AuthContext);
  const { theme, setTheme, THEMES, isDark } = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const ws = useWebSocket();

  const profileMenuRef = useRef(null);
  const notificationRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    if (isProfileMenuOpen || isNotificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen, isNotificationOpen]);

  // Global keyboard shortcut: Cmd+K / Ctrl+K or '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll detection for subtle tactile shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    {
      name: 'Feed',
      href: '/feed',
      icon: Flame,
      active: location.pathname.startsWith('/feed') && location.pathname !== '/feed/create' && location.pathname !== '/feed/drafts'
    },
    {
      name: 'Create',
      href: '/feed/create',
      icon: PenLine,
      active: location.pathname === '/feed/create'
    },
    {
      name: 'Drafts',
      href: '/feed/drafts',
      icon: BookMarked,
      active: location.pathname === '/feed/drafts'
    }
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
    haptic.heavy();
    await logout();
    navigate('/auth/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/feed/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileSearchOpen(false);
      searchInputRef.current?.blur();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full bg-[#FFFDF9]/95 dark:bg-[#141210]/95 backdrop-blur-md border-b transition-all duration-200 ${
          isScrolled
            ? 'border-[#E8DDD0] dark:border-[#26211C] shadow-[0_4px_20px_rgba(40,20,10,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)]'
            : 'border-[#E8DDD0]/80 dark:border-[#26211C]/80'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-3">

            {/* Left Masthead: Brand Emblem & Editorial Navigation */}
            <div className="flex items-center gap-6 sm:gap-8">
              {/* Brand Logo */}
              <Link
                to="/feed"
                className="flex items-center gap-2.5 group shrink-0 focus:outline-none"
                aria-label="HeartOut Sanctuary Feed"
              >
                <img
                  src="/logo.png"
                  alt="HeartOut Logo"
                  className="w-7 h-7 sm:w-8 sm:h-8 object-contain drop-shadow-xs transition-opacity duration-200 select-none group-hover:opacity-90"
                />
                <img
                  src="/text-logo.png"
                  alt="HeartOut"
                  className="h-5 sm:h-5.5 w-auto max-w-[105px] sm:max-w-[125px] object-contain drop-shadow-2xs select-none transition-opacity duration-200 group-hover:opacity-90"
                />
                <span className="hidden xl:inline-block pl-3 border-l border-[#E8DDD0] dark:border-[#26211C] text-[10px] font-mono uppercase tracking-widest text-stone-400 dark:text-stone-500 select-none">
                  Sanctuary
                </span>
              </Link>

              {/* Editorial Desktop Navigation */}
              <div className="hidden md:flex items-center gap-1.5" role="navigation" aria-label="Main Navigation">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-all duration-150 ${
                        item.active
                          ? 'bg-[#F2ECE3] dark:bg-[#231E1A] text-[#8C3A16] dark:text-[#E8A87C] font-semibold border border-[#E0D3C3] dark:border-[#352D26] shadow-[inset_0_1px_1px_rgba(0,0,0,0.03)]'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100/60 dark:hover:bg-stone-800/40 font-medium'
                      }`}
                    >
                      <Icon
                        strokeWidth={item.active ? 1.75 : 1.5}
                        className={`w-3.5 h-3.5 transition-colors ${
                          item.active
                            ? 'text-[#C85828] dark:text-amber-400'
                            : 'text-stone-400 dark:text-stone-500 group-hover:text-stone-700 dark:group-hover:text-stone-300'
                        }`}
                      />
                      <span>{item.name}</span>
                      {item.active && (
                        <span className="w-1 h-1 rounded-full bg-[#C85828] dark:bg-amber-400 ml-0.5" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Center: Tactile Literary Command & Search Capsule */}
            <div className="hidden md:flex flex-1 max-w-sm lg:max-w-md mx-2 justify-center">
              <form onSubmit={handleSearch} className="w-full relative">
                <div
                  className={`relative flex items-center w-full px-3 py-1.5 rounded-xl border transition-all duration-200 ${
                    isSearchFocused
                      ? 'bg-[#FFFDF9] dark:bg-[#151311] border-[#C85828] dark:border-amber-500/80 shadow-[0_2px_12px_rgba(200,88,40,0.08)] ring-1 ring-[#C85828]/20 dark:ring-amber-500/20'
                      : 'bg-[#F6EFE6]/80 dark:bg-[#1C1815]/90 border-[#E3D6C6] dark:border-[#2D2621] hover:border-amber-300/80 dark:hover:border-stone-700'
                  }`}
                >
                  <Search className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500 shrink-0 mr-2.5" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    placeholder="Search stories, reflections, themes..."
                    className="w-full bg-transparent text-xs text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none"
                  />
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="p-0.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors ml-1.5"
                      aria-label="Clear search input"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  ) : (
                    <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono text-stone-400 dark:text-stone-500 bg-white/70 dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800 rounded select-none shrink-0 ml-1.5">
                      ⌘K
                    </kbd>
                  )}
                </div>
              </form>
            </div>

            {/* Right Action Dock */}
            <div className="flex items-center gap-1.5 sm:gap-2">

              {/* Mobile Search Trigger */}
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="md:hidden p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100/70 dark:hover:bg-stone-800/50 transition-colors"
                aria-label="Search stories"
              >
                <Search className="w-4 h-4 text-stone-500 dark:text-stone-400" />
              </button>

              {/* Safe Haven / Support */}
              <Link
                to="/support"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/70 dark:hover:bg-rose-950/20 border border-transparent hover:border-rose-200/50 dark:hover:border-rose-900/40 transition-all duration-150 group"
                title="Safe Haven Helpline & Emotional Support"
              >
                <Heart strokeWidth={1.75} className="w-3.5 h-3.5 text-rose-500/80 group-hover:text-rose-600 transition-colors" />
                <span className="hidden sm:inline">Support</span>
              </Link>

              {/* Hairline Separator */}
              <div className="h-4 w-px bg-[#E3D6C6] dark:bg-[#2D2621] mx-0.5" />

              {/* Sanctuary Notifications */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => {
                    haptic.selection();
                    setIsNotificationOpen(!isNotificationOpen);
                  }}
                  className="relative p-2 rounded-lg text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100/70 dark:hover:bg-stone-800/50 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell strokeWidth={1.5} className="w-4 h-4" />
                  {ws?.notifications?.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#C85828] dark:bg-amber-400 rounded-full" />
                  )}
                </button>

                {/* Notifications Dropdown Card */}
                {isNotificationOpen && (
                  <div className="absolute right-0 top-full mt-2.5 w-72 sm:w-80 bg-[#FFFDF9] dark:bg-[#181614] rounded-2xl shadow-[0_16px_40px_rgba(40,20,10,0.10)] dark:shadow-[0_20px_48px_rgba(0,0,0,0.6)] border border-[#EADDCF] dark:border-[#2C2723] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="p-3.5 border-b border-[#EADDCF]/80 dark:border-[#2C2723] bg-stone-50/50 dark:bg-stone-900/30">
                      <h3 className="font-semibold text-xs uppercase tracking-wider text-stone-700 dark:text-stone-300 font-mono">
                        Sanctuary Chimes
                      </h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {ws?.notifications?.length > 0 ? (
                        ws.notifications.slice(0, 10).map((notif) => (
                          <Link
                            key={notif.id}
                            to={`/feed/${notif.story_id}`}
                            onClick={() => {
                              setIsNotificationOpen(false);
                              ws.dismissNotification(notif.id);
                            }}
                            className="flex items-start gap-3 p-3 hover:bg-stone-50/80 dark:hover:bg-stone-900/40 transition-colors border-b border-[#EADDCF]/40 dark:border-[#2C2723]/40 last:border-0"
                          >
                            <div className={`p-1.5 rounded-lg shrink-0 ${notif.type === 'comment' ? 'bg-amber-100/70 dark:bg-amber-950/40 text-[#C85828] dark:text-amber-400' : 'bg-rose-100/70 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'}`}>
                              {notif.type === 'comment' ? (
                                <Sparkles className="w-3.5 h-3.5" />
                              ) : (
                                <Heart className="w-3.5 h-3.5" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                              <p className="text-xs text-stone-800 dark:text-stone-200">{notif.message}</p>
                              <p className="text-[11px] text-stone-400 dark:text-stone-500 truncate mt-0.5 font-serif">{notif.story_title}</p>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="p-6 text-center text-stone-400 dark:text-stone-500">
                          <Bell className="w-6 h-6 mx-auto mb-2 opacity-40 stroke-[1.5]" />
                          <p className="text-xs">Quiet reflections. No new chimes.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Atmosphere Switcher (Theme Toggle) */}
              <button
                onClick={() => {
                  haptic.medium();
                  setTheme(isDark ? THEMES.LIGHT : THEMES.DARK);
                }}
                className="p-2 rounded-lg text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100/70 dark:hover:bg-stone-800/50 transition-colors"
                aria-label="Toggle theme atmosphere"
                title={isDark ? 'Switch to daylight atmosphere' : 'Switch to evening atmosphere'}
              >
                {isDark ? (
                  <Sun strokeWidth={1.5} className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon strokeWidth={1.5} className="w-4 h-4 text-stone-600" />
                )}
              </button>

              {/* Author Sanctuary Disc & Dropdown Trigger */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => {
                    haptic.selection();
                    setIsProfileMenuOpen(!isProfileMenuOpen);
                  }}
                  className="flex items-center gap-1.5 p-0.5 rounded-full hover:ring-2 hover:ring-[#E0D3C3] dark:hover:ring-[#352D26] transition-all focus:outline-none"
                  aria-expanded={isProfileMenuOpen}
                  aria-haspopup="true"
                  aria-label="Author Profile & Sanctuary Settings"
                >
                  <div className="w-8 h-8 rounded-full bg-[#EFE6D8] dark:bg-[#25201C] text-[#8C3A16] dark:text-[#E8A87C] border border-[#DFCFC0] dark:border-[#38312B] flex items-center justify-center font-stories font-semibold text-xs tracking-normal shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] select-none transition-transform duration-150 active:scale-95">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </button>

                {/* Redesigned Ceramic Sanctuary Profile Dropdown */}
                {isProfileMenuOpen && (
                  <>
                    {/* Backdrop overlay for mobile */}
                    <div
                      className="fixed inset-0 z-40 md:hidden"
                      onClick={() => setIsProfileMenuOpen(false)}
                    />

                    <div className="absolute right-0 mt-2.5 w-64 z-50 rounded-2xl bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] shadow-[0_16px_40px_rgba(40,20,10,0.10)] dark:shadow-[0_20px_48px_rgba(0,0,0,0.6)] overflow-hidden origin-top-right transition-all duration-150 select-none animate-in fade-in zoom-in-95">
                      {/* User Identity Header */}
                      <div className="px-4 py-3.5 flex items-center gap-3 bg-stone-50/50 dark:bg-stone-900/30">
                        <div className="w-10 h-10 rounded-full bg-[#EFE6D8] dark:bg-[#25201C] text-[#8C3A16] dark:text-[#E8A87C] border border-[#DFCFC0] dark:border-[#38312B] flex items-center justify-center font-stories text-base font-semibold shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] flex-shrink-0">
                          {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>

                        <div className="min-w-0 flex-1 text-left">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">
                              {user?.display_name || user?.username}
                            </p>
                            {user?.role === 'admin' && (
                              <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-mono rounded bg-amber-100/80 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50">
                                Admin
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-400 dark:text-stone-500 truncate mt-0.5 font-mono">
                            {user?.email || `@${user?.username}`}
                          </p>
                        </div>
                      </div>

                      {/* Tactile hairline divider */}
                      <div className="border-b border-[#EADDCF]/80 dark:border-[#2C2723]" />

                      {/* Navigation Rows */}
                      <div className="p-1.5 space-y-0.5">
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-stone-50 hover:bg-stone-100/70 dark:hover:bg-stone-800/50 transition-colors group"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <User strokeWidth={1.5} className="w-4 h-4 text-stone-400 dark:text-stone-500 group-hover:text-[#C85828] dark:group-hover:text-amber-400 transition-colors shrink-0" />
                          <span>Profile</span>
                        </Link>

                        <Link
                          to="/feed/saved"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-stone-50 hover:bg-stone-100/70 dark:hover:bg-stone-800/50 transition-colors group"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <BookMarked strokeWidth={1.5} className="w-4 h-4 text-stone-400 dark:text-stone-500 group-hover:text-[#C85828] dark:group-hover:text-amber-400 transition-colors shrink-0" />
                          <span>Saved Stories</span>
                        </Link>

                        <Link
                          to="/profile/settings"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-stone-50 hover:bg-stone-100/70 dark:hover:bg-stone-800/50 transition-colors group"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <Settings strokeWidth={1.5} className="w-4 h-4 text-stone-400 dark:text-stone-500 group-hover:text-[#C85828] dark:group-hover:text-amber-400 transition-colors shrink-0" />
                          <span>Settings</span>
                        </Link>

                        {(hasPermission('admin_access') || user?.role === 'admin') && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-stone-50 hover:bg-stone-100/70 dark:hover:bg-stone-800/50 transition-colors group"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            <Shield strokeWidth={1.5} className="w-4 h-4 text-stone-400 dark:text-stone-500 group-hover:text-[#C85828] dark:group-hover:text-amber-400 transition-colors shrink-0" />
                            <span>Admin Panel</span>
                          </Link>
                        )}
                      </div>

                      {/* Dignified Sign Out Row */}
                      <div className="border-t border-[#EADDCF]/80 dark:border-[#2C2723] p-1.5 mt-0.5">
                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/60 dark:hover:bg-rose-950/20 transition-colors group text-left"
                        >
                          <LogOut strokeWidth={1.5} className="w-4 h-4 text-stone-400 dark:text-stone-500 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors shrink-0" />
                          <span>Sign out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Mobile Search Overlay Bar */}
        {isMobileSearchOpen && (
          <div className="md:hidden border-t border-[#E8DDD0] dark:border-[#26211C] bg-[#FFFDF9] dark:bg-[#141210] px-4 py-2.5 animate-in slide-in-from-top-2 duration-150">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                placeholder="Search reflections, authors, themes..."
                className="w-full pl-9 pr-9 py-2 bg-[#F6EFE6]/80 dark:bg-[#1C1815]/90 border border-[#E3D6C6] dark:border-[#2D2621] rounded-xl text-xs text-stone-800 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:border-[#C85828]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 p-0.5 text-stone-400 hover:text-stone-600"
                  aria-label="Clear mobile search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;