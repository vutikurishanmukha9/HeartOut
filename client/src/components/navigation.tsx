import { useState } from "react";
import { Heart, Search, Bell, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link, useLocation } from "wouter";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Discover", active: location === "/" },
    { href: "/editor", label: "Write", active: location.startsWith("/editor") },
    { href: "/community", label: "Community", active: location === "/community" },
    { href: "/dashboard", label: "Dashboard", active: location === "/dashboard" },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800 fixed top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <Heart className="text-accent w-8 h-8" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">HearOut</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={`text-gray-600 dark:text-gray-300 hover:text-primary transition-colors ${
                    item.active ? "text-primary font-medium" : ""
                  }`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <Bell className="w-5 h-5" />
            </Button>
            <Link href="/dashboard">
              <Avatar className="w-8 h-8 cursor-pointer">
                <AvatarFallback className="bg-primary text-white text-sm font-medium">
                  JD
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
          <div className="px-4 py-3 space-y-3">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-gray-600 dark:text-gray-300 hover:text-primary transition-colors ${
                    item.active ? "text-primary font-medium bg-primary/10" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
              <Button variant="ghost" size="sm">
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5 mr-2" />
                Notifications
              </Button>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(false)}>
                  <User className="w-5 h-5 mr-2" />
                  Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
