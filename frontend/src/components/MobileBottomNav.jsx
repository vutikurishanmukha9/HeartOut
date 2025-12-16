import React, { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, PlusSquare, User, HeartHandshake, FileText } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

/**
 * Mobile Bottom Navigation Bar
 * Premium mobile-first navigation with:
 * - Safe area handling for notched devices
 * - Haptic-feel animations
 * - Active state indicators
 * - Floating action button for story creation
 */

export default function MobileBottomNav() {
    const { isAuthenticated, user } = useContext(AuthContext);
    const location = useLocation();

    // Don't show on auth pages
    if (location.pathname.startsWith('/auth')) {
        return null;
    }

    // Only show for authenticated users on mobile
    if (!isAuthenticated) {
        return null;
    }

    const navItems = [
        { path: '/feed', icon: Home, label: 'Home' },
        { path: '/feed/drafts', icon: FileText, label: 'Drafts' },
        { path: '/feed/create', icon: PlusSquare, label: 'Create', isCreate: true },
        { path: '/support', icon: HeartHandshake, label: 'Support' },
        { path: '/profile', icon: User, label: 'Profile' },
    ];

    return (
        <>
            {/* Spacer to prevent content from being hidden behind nav */}
            <div className="h-20 md:hidden" />

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
                {/* Glassmorphism background */}
                <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50" />

                {/* Safe area padding for notched devices */}
                <div className="relative flex items-center justify-around px-2 h-16 pb-safe">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path ||
                            (item.path === '/feed' && location.pathname === '/feed');

                        if (item.isCreate) {
                            // Special floating action button for create
                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className="relative -mt-6 group"
                                >
                                    {/* Glow effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-orange-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />

                                    {/* Button */}
                                    <div className="relative w-14 h-14 bg-gradient-to-r from-rose-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg transform transition-transform group-active:scale-95">
                                        <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                                    </div>
                                </NavLink>
                            );
                        }

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `
                                    relative flex flex-col items-center justify-center min-w-[60px] py-2 px-3
                                    transition-all duration-200 group
                                    ${isActive ? 'text-rose-500' : 'text-gray-500 dark:text-gray-400'}
                                `}
                            >
                                {/* Active indicator dot */}
                                <span className={`
                                    absolute -top-1 w-1 h-1 rounded-full bg-rose-500
                                    transition-all duration-300
                                    ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
                                `} />

                                {/* Icon with bounce on tap */}
                                <Icon
                                    className={`
                                        w-6 h-6 transition-transform duration-200
                                        group-active:scale-90
                                        ${isActive ? 'scale-110' : ''}
                                    `}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />

                                {/* Label */}
                                <span className={`
                                    text-[10px] mt-1 font-medium
                                    transition-all duration-200
                                    ${isActive ? 'opacity-100' : 'opacity-70'}
                                `}>
                                    {item.label}
                                </span>
                            </NavLink>
                        );
                    })}
                </div>
            </nav>

            {/* CSS for safe area */}
            <style>{`
                .pb-safe {
                    padding-bottom: env(safe-area-inset-bottom, 0px);
                }
                
                @supports (padding-bottom: env(safe-area-inset-bottom)) {
                    .pb-safe {
                        padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
                    }
                }
            `}</style>
        </>
    );
}
