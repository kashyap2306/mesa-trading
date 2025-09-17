import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronDown, Edit, Lock, Crown, LogOut, CheckCircle, Clock, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const UserProfileDropdown = ({ onPremiumClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [premiumRequest, setPremiumRequest] = useState(null);
  const dropdownRef = useRef(null);
  const { currentUser, logout } = useAuth();
  const { getThemeClasses } = useDarkMode();
  const theme = getThemeClasses();

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

  const userData = {
    name: currentUser?.displayName || 'John Doe',
    email: currentUser?.email || 'user@example.com'
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handlePremiumClick = () => {
    setIsOpen(false);
    onPremiumClick();
  };

  const getPremiumStatus = () => {
    if (premiumRequest) {
      switch (premiumRequest.status) {
        case 'active':
          return {
            text: 'Premium Active',
            icon: <Crown className="w-4 h-4 text-yellow-400" />,
            color: 'text-yellow-400',
            bgColor: 'bg-yellow-400/10',
            borderColor: 'border-yellow-400/30'
          };
        case 'approved':
          return {
            text: 'Premium Approved',
            icon: <CheckCircle className="w-4 h-4 text-green-400" />,
            color: 'text-green-400',
            bgColor: 'bg-green-400/10',
            borderColor: 'border-green-400/30'
          };
        case 'pending':
          return {
            text: 'Premium Pending',
            icon: <Clock className="w-4 h-4 text-orange-400" />,
            color: 'text-orange-400',
            bgColor: 'bg-orange-400/10',
            borderColor: 'border-orange-400/30'
          };
        case 'rejected':
          return {
            text: 'Request Rejected',
            icon: <X className="w-4 h-4 text-red-400" />,
            color: 'text-red-400',
            bgColor: 'bg-red-400/10',
            borderColor: 'border-red-400/30'
          };
      }
    }
    
    return {
      text: 'Free Plan',
      icon: <User className="w-4 h-4 text-gray-400" />,
      color: 'text-gray-400',
      bgColor: 'bg-gray-400/10',
      borderColor: 'border-gray-400/30'
    };
  };

  const premiumStatus = getPremiumStatus();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Preview Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-3 px-4 py-3 ${theme.card} rounded-xl border transition-all duration-300 hover:border-cyan-400/50 group`}
      >
        {/* Avatar */}
        <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-white" />
        </div>
        
        {/* User Info - 3 lines */}
        <div className="hidden sm:block text-left flex-1 min-w-0">
          <div className={`text-sm font-semibold ${theme.text.primary} truncate`}>
            {userData.name}
          </div>
          <div className={`text-xs ${theme.text.muted} truncate`}>
            {userData.email}
          </div>
          <div className={`text-xs ${premiumStatus.color} flex items-center space-x-1`}>
            {premiumStatus.icon}
            <span>{premiumStatus.text}</span>
          </div>
        </div>
        
        {/* Chevron */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={`${theme.text.secondary} group-hover:${theme.text.accent}`}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute right-0 top-full mt-2 w-80 ${theme.card} rounded-2xl border shadow-2xl z-50 overflow-hidden`}
          >
            {/* Header */}
            <div className={`p-4 border-b ${theme.border} bg-gradient-to-r from-cyan-500/5 to-blue-500/5`}>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-semibold ${theme.text.primary} truncate`}>
                    {userData.name}
                  </div>
                  <div className={`text-sm ${theme.text.muted} truncate`}>
                    {userData.email}
                  </div>
                </div>
              </div>
              
              {/* Premium Status Badge */}
              <div className={`mt-3 inline-flex items-center space-x-2 px-3 py-2 ${premiumStatus.bgColor} ${premiumStatus.borderColor} border rounded-xl`}>
                {premiumStatus.icon}
                <span className={`text-sm font-medium ${premiumStatus.color}`}>
                  {premiumStatus.text}
                </span>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              {/* Edit Name */}
              <motion.button
                whileHover={{ x: 4 }}
                className={`w-full flex items-center space-x-3 px-4 py-3 ${theme.text.secondary} hover:${theme.text.accent} hover:bg-cyan-500/10 rounded-xl transition-all duration-200 group`}
              >
                <Edit className="w-5 h-5 group-hover:text-cyan-400" />
                <span className="font-medium">Edit Name</span>
              </motion.button>

              {/* Change Password */}
              <motion.button
                whileHover={{ x: 4 }}
                className={`w-full flex items-center space-x-3 px-4 py-3 ${theme.text.secondary} hover:${theme.text.accent} hover:bg-cyan-500/10 rounded-xl transition-all duration-200 group`}
              >
                <Lock className="w-5 h-5 group-hover:text-cyan-400" />
                <span className="font-medium">Change Password</span>
              </motion.button>

              {/* Premium Request Status / Buy Premium */}
              {premiumRequest?.status === 'active' ? (
                // Premium Active - Show Telegram Link and Dashboard
                <>
                  <motion.a
                    href="/dashboard"
                    whileHover={{ x: 4 }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 rounded-xl transition-all duration-200 group`}
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">Go to Dashboard</span>
                  </motion.a>
                  {premiumRequest?.telegramLink && (
                    <motion.a
                      href={premiumRequest.telegramLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ x: 4 }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 rounded-xl transition-all duration-200 group`}
                    >
                      <Crown className="w-5 h-5" />
                      <span className="font-medium">Join Premium Telegram</span>
                    </motion.a>
                  )}
                </>
              ) : premiumRequest?.status === 'pending' ? (
                // Pending Request
                <div className={`w-full flex items-center space-x-3 px-4 py-3 text-orange-400 rounded-xl bg-orange-400/10`}>
                  <Clock className="w-5 h-5" />
                  <div>
                    <div className="font-medium">Premium Request Pending</div>
                    <div className="text-xs text-orange-300">We'll review within 24 hours</div>
                  </div>
                </div>
              ) : premiumRequest?.status === 'approved' ? (
                // Approved - Waiting for activation
                <div className={`w-full flex items-center space-x-3 px-4 py-3 text-green-400 rounded-xl bg-green-400/10`}>
                  <CheckCircle className="w-5 h-5" />
                  <div>
                    <div className="font-medium">Premium Approved!</div>
                    <div className="text-xs text-green-300">Waiting for admin to activate</div>
                  </div>
                </div>
              ) : premiumRequest?.status === 'rejected' ? (
                // Rejected - Allow new request
                <motion.button
                  onClick={handlePremiumClick}
                  whileHover={{ x: 4 }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-all duration-200 group`}
                >
                  <X className="w-5 h-5" />
                  <div>
                    <div className="font-medium">Request Rejected</div>
                    <div className="text-xs text-red-300">Click to submit new request</div>
                  </div>
                </motion.button>
              ) : (
                // No request yet - Buy Premium
                <motion.button
                  onClick={handlePremiumClick}
                  whileHover={{ x: 4 }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 rounded-xl transition-all duration-200 group`}
                >
                  <Crown className="w-5 h-5" />
                  <span className="font-medium">Buy Premium</span>
                </motion.button>
              )}

              {/* Divider */}
              <div className={`my-2 border-t ${theme.border}`} />

              {/* Logout */}
              <motion.button
                onClick={handleLogout}
                whileHover={{ x: 4 }}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-all duration-200 group`}
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfileDropdown;