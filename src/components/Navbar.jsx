import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
  ChevronDownIcon,
  XMarkIcon,
  UserIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { BellIcon as BellSolidIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import VIPBadge from './VIPBadge';

const Navbar = ({ onToggleSidebar }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleDarkMode, getThemeClasses } = useDarkMode();
  const theme = getThemeClasses();
  
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);
  const searchRef = useRef(null);

  // Mock notifications data
  useEffect(() => {
    setNotifications([
      {
        id: 1,
        title: 'New VIP User Registered',
        message: 'John Doe has joined as a VIP member',
        time: '5 minutes ago',
        type: 'user',
        read: false
      },
      {
        id: 2,
        title: 'Webinar Starting Soon',
        message: 'Advanced Trading Strategies starts in 30 minutes',
        time: '25 minutes ago',
        type: 'webinar',
        read: false
      },
      {
        id: 3,
        title: 'System Update',
        message: 'Platform maintenance completed successfully',
        time: '2 hours ago',
        type: 'system',
        read: true
      },
      {
        id: 4,
        title: 'New VIP Link Created',
        message: 'Premium access link has been generated',
        time: '4 hours ago',
        type: 'vip',
        read: true
      },
      {
        id: 5,
        title: 'User Report Generated',
        message: 'Monthly user analytics report is ready',
        time: '1 day ago',
        type: 'report',
        read: true
      }
    ]);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/':
      case '/dashboard':
        return 'Dashboard';
      case '/profile':
        return 'Profile';
      case '/admin':
        return 'Admin Panel';
      case '/webinars':
        return 'Webinars';
      case '/settings':
        return 'Settings';
      default:
        return 'Mesa Trading';
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      setNotifications(prev => 
        prev.map(n => 
          n.id === notification.id ? { ...n, read: true } : n
        )
      );
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'user':
        return <UserIcon className="w-4 h-4" />;
      case 'webinar':
        return <StarIcon className="w-4 h-4" />;
      case 'vip':
        return <CreditCardIcon className="w-4 h-4" />;
      case 'system':
        return <Cog6ToothIcon className="w-4 h-4" />;
      default:
        return <BellIcon className="w-4 h-4" />;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 left-0 right-0 z-50 ${theme.nav} backdrop-blur-xl border-b ${theme.border}`}
    >
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleSidebar}
              className={`lg:hidden p-2 rounded-xl ${theme.button.ghost} transition-all duration-200`}
            >
              <Bars3Icon className="h-6 w-6" />
            </motion.button>

            {/* Page title */}
            <div className="hidden sm:block">
              <h1 className={`text-xl font-bold ${theme.text.primary}`}>
                {getPageTitle()}
              </h1>
            </div>
          </div>

          {/* Center - Search */}
          <div className="flex-1 max-w-lg mx-4 hidden md:block" ref={searchRef}>
            <div className="relative">
              <motion.form 
                onSubmit={handleSearch}
                className="relative"
                initial={false}
                animate={{ scale: showSearch ? 1.02 : 1 }}
              >
                <MagnifyingGlassIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${theme.text.muted}`} />
                <input
                  type="text"
                  placeholder="Search users, webinars, reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearch(true)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl ${theme.input} border ${theme.border} focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200`}
                />
              </motion.form>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* Mobile search button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSearch(!showSearch)}
              className={`md:hidden p-2 rounded-xl ${theme.button.ghost} transition-all duration-200`}
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </motion.button>

            {/* Dark mode toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className={`p-2 rounded-xl ${theme.button.ghost} transition-all duration-200`}
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5 text-yellow-400" />
              ) : (
                <MoonIcon className="h-5 w-5 text-slate-600" />
              )}
            </motion.button>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 rounded-xl ${theme.button.ghost} transition-all duration-200`}
              >
                {unreadCount > 0 ? (
                  <BellSolidIcon className="h-5 w-5 text-cyan-400" />
                ) : (
                  <BellIcon className="h-5 w-5" />
                )}
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Notifications dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute right-0 mt-2 w-80 ${theme.card} rounded-2xl shadow-2xl border ${theme.border} overflow-hidden`}
                  >
                    <div className={`p-4 border-b ${theme.border}`}>
                      <div className="flex items-center justify-between">
                        <h3 className={`font-semibold ${theme.text.primary}`}>Notifications</h3>
                        {unreadCount > 0 && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={markAllAsRead}
                            className={`text-sm ${theme.text.accent} hover:${theme.text.primary} transition-colors`}
                          >
                            Mark all read
                          </motion.button>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <p className={`text-sm ${theme.text.muted} mt-1`}>
                          {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <motion.div
                            key={notification.id}
                            whileHover={{ backgroundColor: darkMode ? 'rgba(6, 182, 212, 0.05)' : 'rgba(6, 182, 212, 0.02)' }}
                            onClick={() => handleNotificationClick(notification)}
                            className={`p-4 border-b ${theme.border} last:border-b-0 cursor-pointer transition-colors ${
                              !notification.read ? 'bg-cyan-500/5' : ''
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded-lg ${
                                notification.type === 'user' ? 'bg-blue-500/10 text-blue-400' :
                                notification.type === 'webinar' ? 'bg-purple-500/10 text-purple-400' :
                                notification.type === 'vip' ? 'bg-yellow-500/10 text-yellow-400' :
                                notification.type === 'system' ? 'bg-green-500/10 text-green-400' :
                                'bg-gray-500/10 text-gray-400'
                              }`}>
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className={`font-medium ${theme.text.primary} truncate`}>
                                    {notification.title}
                                  </p>
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full flex-shrink-0 ml-2" />
                                  )}
                                </div>
                                <p className={`text-sm ${theme.text.secondary} mt-1 line-clamp-2`}>
                                  {notification.message}
                                </p>
                                <p className={`text-xs ${theme.text.muted} mt-2`}>
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="p-8 text-center">
                          <BellIcon className={`h-12 w-12 ${theme.text.muted} mx-auto mb-4`} />
                          <p className={`${theme.text.muted}`}>No notifications yet</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User menu */}
            <div className="relative" ref={userMenuRef}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center space-x-3 p-2 rounded-xl ${theme.button.ghost} transition-all duration-200`}
              >
                <div className="flex items-center space-x-2">
                  {currentUser?.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-cyan-500/20"
                    />
                  ) : (
                    <div className="h-8 w-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <div className="hidden sm:block text-left">
                    <p className={`text-sm font-medium ${theme.text.primary} truncate max-w-32`}>
                      {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}
                    </p>
                    <div className="flex items-center space-x-1">
                      {currentUser?.isVIP && <VIPBadge size="sm" />}
                      <p className={`text-xs ${theme.text.muted}`}>
                        {currentUser?.isVIP ? 'VIP Member' : 'Free User'}
                      </p>
                    </div>
                  </div>
                </div>
                <ChevronDownIcon className={`h-4 w-4 ${theme.text.muted} transition-transform duration-200 ${
                  showUserMenu ? 'rotate-180' : ''
                }`} />
              </motion.button>

              {/* User dropdown */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute right-0 mt-2 w-64 ${theme.card} rounded-2xl shadow-2xl border ${theme.border} overflow-hidden`}
                  >
                    {/* Profile preview */}
                    <div className={`p-4 border-b ${theme.border} bg-gradient-to-r from-cyan-500/10 to-blue-500/10`}>
                      <div className="flex items-center space-x-3">
                        {currentUser?.photoURL ? (
                          <img
                            src={currentUser.photoURL}
                            alt="Profile"
                            className="h-12 w-12 rounded-full object-cover ring-2 ring-cyan-500/30"
                          />
                        ) : (
                          <div className="h-12 w-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-white" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold ${theme.text.primary} truncate`}>
                            {currentUser?.displayName || 'User'}
                          </p>
                          <p className={`text-sm ${theme.text.muted} truncate`}>
                            {currentUser?.email}
                          </p>
                          {currentUser?.isVIP && (
                            <div className="mt-1">
                              <VIPBadge size="sm" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="py-2">
                      <motion.button
                        whileHover={{ backgroundColor: darkMode ? 'rgba(6, 182, 212, 0.1)' : 'rgba(6, 182, 212, 0.05)' }}
                        onClick={() => {
                          navigate('/profile');
                          setShowUserMenu(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left ${theme.text.secondary} hover:${theme.text.primary} transition-colors`}
                      >
                        <UserCircleIcon className="h-5 w-5" />
                        <span>View Profile</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ backgroundColor: darkMode ? 'rgba(6, 182, 212, 0.1)' : 'rgba(6, 182, 212, 0.05)' }}
                        onClick={() => {
                          navigate('/settings');
                          setShowUserMenu(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left ${theme.text.secondary} hover:${theme.text.primary} transition-colors`}
                      >
                        <Cog6ToothIcon className="h-5 w-5" />
                        <span>Settings</span>
                      </motion.button>

                      {!currentUser?.isVIP && (
                        <motion.button
                          whileHover={{ backgroundColor: darkMode ? 'rgba(251, 191, 36, 0.1)' : 'rgba(251, 191, 36, 0.05)' }}
                          onClick={() => {
                            // Handle premium upgrade
                            setShowUserMenu(false);
                          }}
                          className={`w-full flex items-center space-x-3 px-4 py-3 text-left text-yellow-400 hover:text-yellow-300 transition-colors`}
                        >
                          <StarIcon className="h-5 w-5" />
                          <span>Upgrade to VIP</span>
                        </motion.button>
                      )}

                      <div className={`my-2 border-t ${theme.border}`} />

                      <motion.button
                        whileHover={{ backgroundColor: darkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)' }}
                        onClick={() => {
                          handleLogout();
                          setShowUserMenu(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left text-red-400 hover:text-red-300 transition-colors`}
                      >
                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        <span>Sign Out</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile search */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`md:hidden border-t ${theme.border} p-4`}
            >
              <form onSubmit={handleSearch} className="relative">
                <MagnifyingGlassIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${theme.text.muted}`} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl ${theme.input} border ${theme.border} focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200`}
                  autoFocus
                />
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;