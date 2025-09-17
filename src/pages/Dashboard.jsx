import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Users, 
  TrendingUp, 
  BarChart3, 
  DollarSign, 
  Shield, 
  Zap,
  Star,
  Crown,
  ExternalLink,
  Play,
  Lock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useRequireAuth } from '../utils/authUtils';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Layout from '../components/Layout';
import PremiumRequestModal from '../components/PremiumRequestModal';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { getThemeClasses } = useDarkMode();
  const { requireAuth } = useRequireAuth();
  const themeClasses = getThemeClasses();
  
  const [webinars, setWebinars] = useState([]);
  const [upcomingWebinar, setUpcomingWebinar] = useState(null);
  const [premiumRequest, setPremiumRequest] = useState(null);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch webinars and premium status
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch webinars
        const webinarsSnapshot = await getDocs(collection(db, 'webinars'));
        const webinarsData = webinarsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Sort by date and get upcoming webinars
        const sortedWebinars = webinarsData
          .filter(webinar => new Date(webinar.date) > new Date())
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        
        setWebinars(sortedWebinars);
        setUpcomingWebinar(sortedWebinars[0] || null);
        
        // Fetch premium request status
        if (currentUser) {
          const premiumDoc = await getDoc(doc(db, 'premiumRequests', currentUser.uid));
          if (premiumDoc.exists()) {
            setPremiumRequest(premiumDoc.data());
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const getPremiumStatus = () => {
    if (!premiumRequest) {
      return { status: 'none', text: 'Free Plan', color: 'text-gray-400' };
    }
    
    switch (premiumRequest.status) {
      case 'pending':
        return { status: 'pending', text: 'Premium Pending', color: 'text-yellow-400' };
      case 'approved':
      case 'active':
        return { status: 'active', text: 'Premium Active', color: 'text-green-400' };
      case 'rejected':
        return { status: 'rejected', text: 'Premium Rejected', color: 'text-red-400' };
      default:
        return { status: 'none', text: 'Free Plan', color: 'text-gray-400' };
    }
  };

  const premiumStatus = getPremiumStatus();
  const isPremium = premiumStatus.status === 'active' || premiumStatus.status === 'approved';

  const formatWebinarDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatWebinarTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const stats = [
    {
      title: 'Portfolio Value',
      value: '$12,450',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      change: '+8.2%',
      changeType: 'positive'
    },
    {
      title: 'Active Trades',
      value: '7',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500',
      change: '+2',
      changeType: 'positive'
    },
    {
      title: 'Win Rate',
      value: '73%',
      icon: BarChart3,
      color: 'from-purple-500 to-pink-500',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Webinars Attended',
      value: '12',
      icon: Users,
      color: 'from-orange-500 to-red-500',
      change: '+3',
      changeType: 'positive'
    }
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={`min-h-screen ${themeClasses.background} p-4 sm:p-6`}>
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h1 className={`text-2xl sm:text-3xl font-bold ${themeClasses.text} mb-2 leading-tight`}>
                Welcome back, {currentUser?.displayName || 'Trader'}!
              </h1>
              <p className={`${themeClasses.textSecondary} text-sm sm:text-base`}>
                Here's your trading dashboard overview
              </p>
            </div>
            <div className={`px-4 py-2 rounded-xl ${themeClasses.cardBackground} ${themeClasses.border} w-fit`}>
              <div className="flex items-center space-x-2">
                <Crown className={`h-4 w-4 ${premiumStatus.color}`} />
                <span className={`text-sm font-medium ${premiumStatus.color}`}>
                  {premiumStatus.text}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Upcoming Webinar Section - At the very top */}
        {upcomingWebinar && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <div className={`${themeClasses.cardBackground} ${themeClasses.border} rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/30 overflow-hidden`}>
              {/* Crypto-style background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-2xl"></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                      <span className="text-cyan-400 text-xs sm:text-sm font-bold uppercase tracking-wider">
                        🚀 Live Webinar
                      </span>
                    </div>
                    <div className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full border border-cyan-500/30">
                      <span className="text-cyan-400 text-xs font-semibold">
                        {Math.floor(Math.random() * 500) + 100} joined
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className={`text-xl sm:text-2xl lg:text-3xl font-bold ${themeClasses.text} mb-2 leading-tight`}>
                      {upcomingWebinar.title}
                    </h2>
                    
                    <p className={`${themeClasses.textSecondary} text-sm sm:text-base mb-4 line-clamp-2`}>
                      {upcomingWebinar.description}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <div className="flex items-center space-x-2 bg-gray-800/30 px-3 py-1.5 rounded-xl">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-400" />
                      <span className={`text-xs sm:text-sm ${themeClasses.textSecondary}`}>
                        {formatWebinarDate(upcomingWebinar.date)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 bg-gray-800/30 px-3 py-1.5 rounded-xl">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-400" />
                      <span className={`text-xs sm:text-sm ${themeClasses.textSecondary}`}>
                        {formatWebinarTime(upcomingWebinar.date)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    {isPremium ? (
                      <motion.a
                        href={upcomingWebinar.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl sm:rounded-2xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-cyan-500/25 text-sm sm:text-base"
                      >
                        <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                        Join Live Webinar
                        <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-2" />
                      </motion.a>
                    ) : (
                      <motion.button
                        onClick={() => {
                          requireAuth(() => setIsPremiumModalOpen(true));
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white rounded-xl sm:rounded-2xl font-bold hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg shadow-yellow-500/25 text-sm sm:text-base relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-red-400/20 animate-pulse"></div>
                        <Crown className="h-4 w-4 sm:h-5 sm:w-5 mr-2 relative z-10" />
                        <span className="relative z-10">🔥 Upgrade to Premium</span>
                        <Lock className="h-3 w-3 sm:h-4 sm:w-4 ml-2 relative z-10" />
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`${themeClasses.cardBackground} ${themeClasses.border} rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:bg-white/5 transition-all duration-300`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${stat.color} rounded-xl sm:rounded-2xl flex items-center justify-center`}>
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <span className={`text-xs sm:text-sm font-semibold px-2 py-1 rounded-full ${
                    stat.changeType === 'positive' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className={`text-lg sm:text-2xl font-bold ${themeClasses.text} mb-1`}>
                  {stat.value}
                </h3>
                <p className={`${themeClasses.textSecondary} text-xs sm:text-sm`}>
                  {stat.title}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${themeClasses.cardBackground} ${themeClasses.border} rounded-2xl sm:rounded-3xl p-4 sm:p-6`}
          >
            <h3 className={`text-lg sm:text-xl font-bold ${themeClasses.text} mb-4 sm:mb-6 flex items-center`}>
              <TrendingUp className="h-5 w-5 mr-2 text-cyan-400" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className={`p-4 ${themeClasses.cardBackground} rounded-xl`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${themeClasses.text} font-medium`}>Trade Executed</p>
                      <p className={`${themeClasses.textSecondary} text-sm`}>BTC/USD - Long Position</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-semibold">+$245.50</p>
                      <p className={`${themeClasses.textSecondary} text-sm`}>2 hours ago</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${themeClasses.cardBackground} ${themeClasses.border} rounded-3xl p-6`}
          >
            <h3 className={`text-xl font-bold ${themeClasses.text} mb-6 flex items-center`}>
              <Zap className="h-5 w-5 mr-2 text-yellow-400" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl text-left hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-300"
              >
                <TrendingUp className="h-8 w-8 text-green-400 mb-3" />
                <h4 className={`${themeClasses.text} font-semibold mb-1`}>New Trade</h4>
                <p className={`${themeClasses.textSecondary} text-sm`}>Start trading</p>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl text-left hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-300"
              >
                <BarChart3 className="h-8 w-8 text-blue-400 mb-3" />
                <h4 className={`${themeClasses.text} font-semibold mb-1`}>Analytics</h4>
                <p className={`${themeClasses.textSecondary} text-sm`}>View reports</p>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl text-left hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300"
              >
                <Users className="h-8 w-8 text-purple-400 mb-3" />
                <h4 className={`${themeClasses.text} font-semibold mb-1`}>Webinars</h4>
                <p className={`${themeClasses.textSecondary} text-sm`}>Join sessions</p>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl text-left hover:from-orange-500/30 hover:to-red-500/30 transition-all duration-300"
              >
                <Shield className="h-8 w-8 text-orange-400 mb-3" />
                <h4 className={`${themeClasses.text} font-semibold mb-1`}>Security</h4>
                <p className={`${themeClasses.textSecondary} text-sm`}>Account settings</p>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Premium Request Modal */}
      <PremiumRequestModal 
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
      />
    </Layout>
  );
};

export default Dashboard;