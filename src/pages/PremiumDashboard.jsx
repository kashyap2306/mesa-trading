import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarIcon,
  ClockIcon,
  UserCircleIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  BellIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
  ArrowTopRightOnSquareIcon,
  PlayIcon,
  LockClosedIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  VideoCameraIcon,
  BookOpenIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import { collection, getDocs, doc, getDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import Layout from '../components/Layout';

const PremiumDashboard = () => {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { getThemeClasses } = useDarkMode();
  const theme = getThemeClasses();

  useEffect(() => {
    const fetchWebinars = async () => {
      try {
        const webinarsRef = collection(db, 'webinars');
        const q = query(
          webinarsRef,
          where('date', '>=', new Date()),
          orderBy('date', 'asc')
        );
        const querySnapshot = await getDocs(q);
        const webinarData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setWebinars(webinarData);
      } catch (error) {
        console.error('Error fetching webinars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWebinars();
  }, []);

  const formatDate = (date) => {
    if (!date) return 'TBD';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    if (!date) return 'TBD';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const premiumResources = [
    {
      title: 'Trading Signals',
      description: 'Real-time crypto trading signals',
      icon: ArrowTrendingUpIcon,
      color: 'from-green-500 to-emerald-600',
      count: '24/7'
    },
    {
      title: 'Market Analysis',
      description: 'In-depth market research reports',
      icon: ChartBarIcon,
      color: 'from-blue-500 to-cyan-600',
      count: 'Daily'
    },
    {
      title: 'Premium Documents',
      description: 'Exclusive trading strategies',
      icon: DocumentTextIcon,
      color: 'from-purple-500 to-indigo-600',
      count: '50+'
    },
    {
      title: 'Priority Support',
      description: 'Direct access to trading experts',
      icon: BellIcon,
      color: 'from-orange-500 to-red-600',
      count: 'VIP'
    }
  ];

  if (loading) {
    return (
      <div className={`min-h-screen ${theme.background} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className={theme.text.muted}>Loading your premium dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.background}`}>
      {/* Header */}
      <div className={`${theme.nav} border-b ${theme.border} sticky top-0 z-40 backdrop-blur-xl`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">MT</span>
              </div>
              <div>
                <h1 className={`text-xl font-bold ${theme.text.primary}`}>Mesa Trading</h1>
                <p className={`text-sm ${theme.text.muted}`}>Premium Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full border border-yellow-500/30">
                <TrophyIcon className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium text-yellow-500">Premium Member</span>
              </div>
              <div className="flex items-center space-x-2">
                <UserCircleIcon className={`h-8 w-8 ${theme.text.muted}`} />
                <div className="text-right">
                  <p className={`text-sm font-medium ${theme.text.primary}`}>
                    {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Premium User'}
                  </p>
                  <p className={`text-xs ${theme.text.muted}`}>Premium Access</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${theme.card} rounded-2xl p-6 mb-8 border ${theme.border} bg-gradient-to-br from-cyan-500/5 to-blue-600/5`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className={`text-2xl font-bold ${theme.text.primary} mb-2`}>
                Welcome to Premium Trading
              </h2>
              <p className={`${theme.text.muted} max-w-2xl`}>
                Access exclusive webinars, real-time trading signals, and premium resources to elevate your crypto trading journey.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <StarIcon className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Premium Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {premiumResources.map((resource, index) => {
            const IconComponent = resource.icon;
            return (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${theme.card} rounded-xl p-6 border ${theme.border} hover:shadow-lg transition-all duration-300 cursor-pointer group`}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${resource.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <h3 className={`text-lg font-semibold ${theme.text.primary} mb-2`}>{resource.title}</h3>
                <p className={`text-sm ${theme.text.muted} mb-3`}>{resource.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 bg-gradient-to-r ${resource.color} text-white rounded-full`}>
                    {resource.count}
                  </span>
                  <span className={`text-xs ${theme.text.muted}`}>Available Now</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Upcoming Webinars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`${theme.card} rounded-2xl p-6 border ${theme.border}`}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <PlayIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className={`text-xl font-bold ${theme.text.primary}`}>Upcoming Premium Webinars</h3>
                <p className={`text-sm ${theme.text.muted}`}>Exclusive access to live trading sessions</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-500/30">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-500">Live Access</span>
            </div>
          </div>

          {webinars.length > 0 ? (
            <div className="space-y-4">
              {webinars.slice(0, 3).map((webinar, index) => (
                <motion.div
                  key={webinar.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={`${theme.card} border ${theme.border} rounded-xl p-4 hover:shadow-md transition-all duration-300`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className={`text-lg font-semibold ${theme.text.primary} mb-2`}>{webinar.title}</h4>
                      <p className={`text-sm ${theme.text.muted} mb-3 line-clamp-2`}>{webinar.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className={`h-4 w-4 ${theme.text.muted}`} />
                          <span className={theme.text.muted}>{formatDate(webinar.date)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ClockIcon className={`h-4 w-4 ${theme.text.muted}`} />
                          <span className={theme.text.muted}>{formatTime(webinar.date)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                        onClick={() => webinar.link && window.open(webinar.link, '_blank')}
                      >
                        Join Live
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className={`w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <CalendarIcon className="h-8 w-8 text-white" />
              </div>
              <h4 className={`text-lg font-semibold ${theme.text.primary} mb-2`}>No Upcoming Webinars</h4>
              <p className={`${theme.text.muted}`}>New premium webinars will be announced soon. Stay tuned!</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PremiumDashboard;