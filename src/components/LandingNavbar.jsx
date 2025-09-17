import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { 
  Menu, 
  X, 
  Sun, 
  Moon,
  User,
  Settings,
  Key,
  CreditCard,
  LogOut,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useRequireAuth } from '../utils/authUtils';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const LandingNavbar = ({ onOpenPremiumModal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [premiumRequest, setPremiumRequest] = useState(null);
  const { currentUser, logout } = useAuth();
  const { isDarkMode, toggleDarkMode, getThemeClasses } = useDarkMode();
  const requireAuth = useRequireAuth();
  const profileRef = useRef(null);
  const themeClasses = getThemeClasses();

  // Fetch premium request status
  useEffect(() => {
    const fetchPremiumRequest = async () => {
      if (currentUser) {
        try {
          const requestDoc = await getDoc(doc(db, 'premiumRequests', currentUser.uid));
          if (requestDoc.exists()) {
            setPremiumRequest(requestDoc.data());
          }
        } catch (error) {
          console.error('Error fetching premium request:', error);
        }
      }
    };

    fetchPremiumRequest();
  }, [currentUser]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileOpen(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const getPremiumStatus = () => {
    if (premiumRequest) {
      switch (premiumRequest.status) {
        case 'active':
          return { status: 'active', text: 'Premium Active', color: 'text-green-400' };
        case 'approved':
          return { status: 'approved', text: 'Premium Approved', color: 'text-green-400' };
        case 'pending':
          return { status: 'pending', text: 'Request Pending', color: 'text-yellow-400' };
        case 'rejected':
          return { status: 'rejected', text: 'Request Rejected', color: 'text-red-400' };
        default:
          return { status: 'none', text: 'No Premium', color: 'text-gray-400' };
      }
    }
    return { status: 'none', text: 'No Premium', color: 'text-gray-400' };
  };

  const premiumStatus = getPremiumStatus();

  const navItems = [
    { name: 'Home', href: '#hero' },
    { name: 'Features', href: '#features' },
    { name: 'Webinars', href: '#webinars' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 ${themeClasses.cardBackground}/95 backdrop-blur-lg ${themeClasses.border} border-b shadow-lg`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className={`text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent`}>
              Mesa Trading
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.button
                key={item.name}
                onClick={() => scrollToSection(item.href.slice(1))}
                className={`${themeClasses.text} hover:text-cyan-400 transition-colors duration-300 font-medium`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.name}
              </motion.button>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <motion.button
              onClick={toggleDarkMode}
              className={`p-2 rounded-xl ${themeClasses.cardBackground} ${themeClasses.border} hover:scale-110 transition-all duration-300`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </motion.button>

            {/* User Profile or Auth Buttons */}
            {currentUser ? (
              <div className="relative" ref={profileRef}>
                <motion.button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`flex items-center space-x-3 p-2 rounded-xl ${themeClasses.cardBackground} ${themeClasses.border} hover:scale-105 transition-all duration-300`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {currentUser.displayName?.charAt(0)?.toUpperCase() || currentUser.email?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className={`text-sm font-medium ${themeClasses.text}`}>
                      {currentUser.displayName || 'User'}
                    </div>
                    <div className={`text-xs ${premiumStatus.color}`}>
                      {premiumStatus.text}
                    </div>
                  </div>
                </motion.button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute right-0 mt-2 w-80 ${themeClasses.cardBackground} rounded-2xl shadow-2xl ${themeClasses.border} overflow-hidden`}
                    >
                      {/* Profile Header */}
                      <div className={`p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 ${themeClasses.border} border-b`}>
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            {currentUser.displayName?.charAt(0)?.toUpperCase() || currentUser.email?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className={`font-semibold ${themeClasses.text}`}>
                              {currentUser.displayName || 'User'}
                            </div>
                            <div className={`text-sm ${themeClasses.textSecondary}`}>
                              {currentUser.email}
                            </div>
                            <div className={`text-xs ${premiumStatus.color} flex items-center space-x-1 mt-1`}>
                              {premiumStatus.status === 'active' || premiumStatus.status === 'approved' ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : premiumStatus.status === 'pending' ? (
                                <Clock className="h-3 w-3" />
                              ) : null}
                              <span>{premiumStatus.text}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        <motion.button
                          className={`w-full flex items-center space-x-3 p-3 rounded-xl ${themeClasses.text} hover:bg-cyan-500/10 transition-all duration-300`}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <User className="h-5 w-5 text-cyan-400" />
                          <span>Edit Profile</span>
                        </motion.button>

                        <motion.button
                          className={`w-full flex items-center space-x-3 p-3 rounded-xl ${themeClasses.text} hover:bg-cyan-500/10 transition-all duration-300`}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Key className="h-5 w-5 text-cyan-400" />
                          <span>Change Password</span>
                        </motion.button>

                        {/* Premium Section */}
                        {premiumStatus.status === 'none' && (
                          <motion.button
                            onClick={() => {
                              requireAuth(() => {
                                onOpenPremiumModal();
                                setIsProfileOpen(false);
                              });
                            }}
                            className={`w-full flex items-center space-x-3 p-3 rounded-xl ${themeClasses.text} hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-500/10 transition-all duration-300`}
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <CreditCard className="h-5 w-5 text-yellow-400" />
                            <span>Buy Premium</span>
                          </motion.button>
                        )}

                        {premiumStatus.status === 'pending' && (
                          <div className={`p-3 rounded-xl bg-yellow-500/10 ${themeClasses.border} border-yellow-500/20`}>
                            <div className="flex items-center space-x-2 text-yellow-400">
                              <Clock className="h-4 w-4" />
                              <span className="text-sm font-medium">Premium Request Pending</span>
                            </div>
                            <p className={`text-xs ${themeClasses.textSecondary} mt-1`}>
                              Your request is being reviewed by our team.
                            </p>
                          </div>
                        )}

                        {premiumStatus.status === 'active' && (
                          <>
                            <motion.a
                              href="/dashboard"
                              className={`w-full flex items-center space-x-3 p-3 rounded-xl ${themeClasses.text} hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-500/10 transition-all duration-300`}
                              whileHover={{ scale: 1.02, x: 4 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <User className="h-5 w-5 text-cyan-400" />
                              <span>Dashboard</span>
                            </motion.a>
                            <div className={`p-3 rounded-xl bg-green-500/10 ${themeClasses.border} border-green-500/20`}>
                              <div className="flex items-center space-x-2 text-green-400">
                                <CheckCircle className="h-4 w-4" />
                                <span className="text-sm font-medium">Premium Active</span>
                              </div>
                              <p className={`text-xs ${themeClasses.textSecondary} mt-1`}>
                                Access exclusive features and Telegram group.
                              </p>
                              {premiumRequest?.telegramLink && (
                                <motion.a
                                  href={premiumRequest.telegramLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block mt-2 px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  Join Telegram
                                </motion.a>
                              )}
                            </div>
                          </>
                        )}

                        {(premiumStatus.status === 'approved') && (
                          <div className={`p-3 rounded-xl bg-green-500/10 ${themeClasses.border} border-green-500/20`}>
                            <div className="flex items-center space-x-2 text-green-400">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-sm font-medium">Premium Approved</span>
                            </div>
                            <p className={`text-xs ${themeClasses.textSecondary} mt-1`}>
                              Waiting for admin to activate your account.
                            </p>
                          </div>
                        )}

                        {premiumStatus.status === 'rejected' && (
                          <div className={`p-3 rounded-xl bg-red-500/10 ${themeClasses.border} border-red-500/20`}>
                            <div className="flex items-center space-x-2 text-red-400">
                              <XMarkIcon className="h-4 w-4" />
                              <span className="text-sm font-medium">Request Rejected</span>
                            </div>
                            <p className={`text-xs ${themeClasses.textSecondary} mt-1`}>
                              Please contact support for more information.
                            </p>
                          </div>
                        )}

                        <hr className={`my-2 ${themeClasses.border}`} />

                        <motion.button
                          onClick={handleLogout}
                          className={`w-full flex items-center space-x-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-300`}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <LogOut className="h-5 w-5" />
                          <span>Logout</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <motion.a
                  href="/login"
                  className={`px-4 py-2 ${themeClasses.text} hover:text-cyan-400 transition-colors duration-300 font-medium`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login
                </motion.a>
                <motion.a
                  href="/signup"
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Up
                </motion.a>
              </div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 rounded-xl ${themeClasses.cardBackground} ${themeClasses.border}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMenuOpen ? (
                <XMarkIcon className={`h-6 w-6 ${themeClasses.text}`} />
              ) : (
                <Bars3Icon className={`h-6 w-6 ${themeClasses.text}`} />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`md:hidden ${themeClasses.border} border-t mt-2 pt-4 pb-4`}
            >
              <div className="space-y-2">
                {navItems.map((item) => (
                  <motion.button
                    key={item.name}
                    onClick={() => scrollToSection(item.href.slice(1))}
                    className={`block w-full text-left px-4 py-3 ${themeClasses.text} hover:bg-cyan-500/10 rounded-xl transition-all duration-300`}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.name}
                  </motion.button>
                ))}
                {!currentUser && (
                  <div className="pt-4 space-y-2">
                    <motion.a
                      href="/login"
                      className={`block w-full text-center px-4 py-3 ${themeClasses.text} hover:bg-cyan-500/10 rounded-xl transition-all duration-300`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Login
                    </motion.a>
                    <motion.a
                      href="/signup"
                      className="block w-full text-center px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Sign Up
                    </motion.a>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default LandingNavbar;