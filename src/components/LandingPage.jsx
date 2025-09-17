import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, BarChart3, DollarSign, Users, Shield, Zap, ArrowRight, Play, Star, 
  Globe, Clock, Award, Sparkles, Target, Brain, Rocket, CheckCircle, ArrowUpRight, 
  TrendingDown, Activity, Eye, Lock, Headphones, Bitcoin, Coins, LineChart,
  MapPin, Phone, Mail, ExternalLink, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useRequireAuth } from '../utils/authUtils';
import LandingNavbar from './LandingNavbar';
import PremiumRequestModal from './PremiumRequestModal';
import WebinarSection from './WebinarSection';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [cryptoPrices, setCryptoPrices] = useState({
    bitcoin: { price: 43250, change: 2.4 },
    ethereum: { price: 2680, change: 1.8 }
  });
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const reviewsRef = useRef(null);
  const { currentUser } = useAuth();
  const { getThemeClasses } = useDarkMode();
  const requireAuth = useRequireAuth();
  const theme = getThemeClasses();

  // Live crypto price simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCryptoPrices(prev => ({
        bitcoin: {
          price: prev.bitcoin.price + (Math.random() - 0.5) * 100,
          change: prev.bitcoin.change + (Math.random() - 0.5) * 0.5
        },
        ethereum: {
          price: prev.ethereum.price + (Math.random() - 0.5) * 50,
          change: prev.ethereum.change + (Math.random() - 0.5) * 0.3
        }
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Auto-swiping reviews carousel
  const reviews = [
    {
      id: 1,
      name: "Alex Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
      rating: 5,
      text: "Mesa Trading's AI signals helped me achieve 340% returns in 6 months. The accuracy is incredible!",
      verified: true
    },
    {
      id: 2,
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
      rating: 5,
      text: "Best crypto trading platform I've used. The webinars are pure gold - 90% accuracy as promised!",
      verified: true
    },
    {
      id: 3,
      name: "Michael Rodriguez",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
      rating: 5,
      text: "From $5K to $50K in 8 months. Mesa Trading's premium signals are worth every penny!",
      verified: true
    },
    {
      id: 4,
      name: "Emma Wilson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
      rating: 5,
      text: "The 24/7 support and real-time alerts saved me from major losses. Highly recommended!",
      verified: true
    },
    {
      id: 5,
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face",
      rating: 5,
      text: "Professional-grade tools with institutional insights. My portfolio grew 280% this year!",
      verified: true
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReviewIndex(prev => (prev + 1) % reviews.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [reviews.length]);

  const handleReviewNavigation = (direction) => {
    if (direction === 'next') {
      setCurrentReviewIndex(prev => (prev + 1) % reviews.length);
    } else {
      setCurrentReviewIndex(prev => (prev - 1 + reviews.length) % reviews.length);
    }
  };

  const handlePremiumRequest = async (requestData) => {
    // Handle premium request submission
    console.log('Premium request:', requestData);
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`min-h-screen ${theme.background} relative overflow-hidden`}>
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(6,182,212,0.1),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.1),transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Navigation */}
      <LandingNavbar 
        cryptoPrices={cryptoPrices}
        onOpenPremiumModal={() => setIsPremiumModalOpen(true)}
      />


      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8 text-center lg:text-left"
            >
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-300 rounded-full text-sm font-semibold border border-cyan-400/30 backdrop-blur-sm"
              >
                <Sparkles className="w-4 h-4 mr-2 text-cyan-400 animate-pulse" />
                Next-Gen Crypto Intelligence
                <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </motion.div>
              
              <div className="space-y-6">
                <motion.h1 
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight"
                >
                  <span className={`${theme.text.primary} block`}>Trade Crypto</span>
                  <span className={`${theme.neon.text} block`}>Like a Pro</span>
                </motion.h1>
                
                <motion.p 
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className={`text-lg sm:text-xl ${theme.text.secondary} max-w-2xl leading-relaxed`}
                >
                  Join thousands of successful traders using our AI-powered platform. 
                  Get real-time signals, expert analysis, and 90% accuracy webinars.
                </motion.p>
              </div>

              <motion.div 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(6, 182, 212, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => requireAuth(() => setIsPremiumModalOpen(true))}
                  className={`${theme.button.primary} px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center group`}
                >
                  Start Trading Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`${theme.button.secondary} px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center`}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="grid grid-cols-3 gap-6 pt-8"
              >
                <div className="text-center">
                  <div className={`text-2xl sm:text-3xl font-bold ${theme.neon.text}`}>50K+</div>
                  <div className={`text-sm ${theme.text.muted}`}>Active Traders</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl sm:text-3xl font-bold ${theme.neon.text}`}>90%</div>
                  <div className={`text-sm ${theme.text.muted}`}>Accuracy Rate</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl sm:text-3xl font-bold ${theme.neon.text}`}>24/7</div>
                  <div className={`text-sm ${theme.text.muted}`}>Support</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Trading Interface Preview */}
            <motion.div 
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className={`${theme.card} p-6 rounded-3xl relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-3xl" />
                
                {/* Mock Trading Interface */}
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-xl font-bold ${theme.text.primary}`}>Live Trading</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className={`text-sm ${theme.text.success}`}>Live</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                      <div className="flex items-center space-x-3">
                        <Bitcoin className="w-6 h-6 text-orange-400" />
                        <div>
                          <div className={`font-semibold ${theme.text.primary}`}>BTC/USDT</div>
                          <div className={`text-sm ${theme.text.success}`}>+12.5% (24h)</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${theme.text.primary}`}>$43,250</div>
                        <div className={`text-sm ${theme.text.success}`}>+$4,750</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-white">E</span>
                        </div>
                        <div>
                          <div className={`font-semibold ${theme.text.primary}`}>ETH/USDT</div>
                          <div className={`text-sm ${theme.text.success}`}>+8.3% (24h)</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${theme.text.primary}`}>$2,680</div>
                        <div className={`text-sm ${theme.text.success}`}>+$205</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-500/20`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm ${theme.text.secondary}`}>Portfolio Value</span>
                      <span className={`text-sm ${theme.text.success}`}>+340% (6M)</span>
                    </div>
                    <div className={`text-2xl font-bold ${theme.neon.text}`}>$127,450</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-300 rounded-full text-sm font-semibold border border-cyan-400/30 backdrop-blur-sm mb-6">
              <Zap className="w-4 h-4 mr-2" />
              Advanced Features
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className={`${theme.text.primary} block`}>Professional Tools</span>
              <span className={`${theme.neon.text} block`}>For Crypto Trading</span>
            </h2>
            <p className={`text-lg ${theme.text.secondary} max-w-3xl mx-auto leading-relaxed`}>
              Advanced cryptocurrency trading platform with AI-powered analytics, real-time market data, and institutional-grade security
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Security Feature */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`group ${theme.card} p-8 rounded-3xl relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-2xl font-bold ${theme.text.primary} mb-4`}>Bank-Grade Security</h3>
                <p className={`${theme.text.secondary} leading-relaxed mb-6`}>
                  Military-grade encryption, cold storage, and multi-signature wallets protect your assets 24/7.
                </p>
                <ul className="space-y-2">
                  <li className={`flex items-center text-sm ${theme.text.muted}`}>
                    <CheckCircle className="w-4 h-4 text-green-400 mr-3" />
                    256-bit SSL Encryption
                  </li>
                  <li className={`flex items-center text-sm ${theme.text.muted}`}>
                    <CheckCircle className="w-4 h-4 text-green-400 mr-3" />
                    Cold Storage Protection
                  </li>
                  <li className={`flex items-center text-sm ${theme.text.muted}`}>
                    <CheckCircle className="w-4 h-4 text-green-400 mr-3" />
                    Multi-Signature Wallets
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* 24/7 Support Feature */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`group ${theme.card} p-8 rounded-3xl relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Headphones className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-2xl font-bold ${theme.text.primary} mb-4`}>24/7 Expert Support</h3>
                <p className={`${theme.text.secondary} leading-relaxed mb-6`}>
                  Round-the-clock support from crypto experts and dedicated account managers.
                </p>
                <ul className="space-y-2">
                  <li className={`flex items-center text-sm ${theme.text.muted}`}>
                    <CheckCircle className="w-4 h-4 text-blue-400 mr-3" />
                    Live Chat Support
                  </li>
                  <li className={`flex items-center text-sm ${theme.text.muted}`}>
                    <CheckCircle className="w-4 h-4 text-blue-400 mr-3" />
                    Dedicated Account Manager
                  </li>
                  <li className={`flex items-center text-sm ${theme.text.muted}`}>
                    <CheckCircle className="w-4 h-4 text-blue-400 mr-3" />
                    Priority Response
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Fast Execution Feature */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`group ${theme.card} p-8 rounded-3xl relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-2xl font-bold ${theme.text.primary} mb-4`}>Lightning Fast Execution</h3>
                <p className={`${theme.text.secondary} leading-relaxed mb-6`}>
                  Ultra-low latency trading with institutional-grade infrastructure and direct exchange connections.
                </p>
                <ul className="space-y-2">
                  <li className={`flex items-center text-sm ${theme.text.muted}`}>
                    <CheckCircle className="w-4 h-4 text-purple-400 mr-3" />
                    &lt;1ms Execution Speed
                  </li>
                  <li className={`flex items-center text-sm ${theme.text.muted}`}>
                    <CheckCircle className="w-4 h-4 text-purple-400 mr-3" />
                    Direct Exchange Access
                  </li>
                  <li className={`flex items-center text-sm ${theme.text.muted}`}>
                    <CheckCircle className="w-4 h-4 text-purple-400 mr-3" />
                    Smart Order Routing
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Webinar Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 text-yellow-300 rounded-full text-sm font-semibold border border-yellow-400/30 backdrop-blur-sm mb-6">
              <Target className="w-4 h-4 mr-2" />
              90% Accuracy Guaranteed
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className={`${theme.text.primary} block`}>90% Accuracy</span>
              <span className={`${theme.neon.text} block`}>Webinars</span>
            </h2>
            <p className={`text-lg ${theme.text.secondary} max-w-3xl mx-auto leading-relaxed`}>
              Join our exclusive webinars with proven 90% accuracy rate. Learn from top crypto analysts and get real-time trading signals.
            </p>
          </motion.div>
          
          <WebinarSection onOpenPremiumModal={() => setIsPremiumModalOpen(true)} />
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 text-yellow-300 rounded-full text-sm font-semibold border border-yellow-400/30 backdrop-blur-sm mb-6">
              <Star className="w-4 h-4 mr-2" />
              Trusted by Traders
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className={`${theme.text.primary} block`}>What Our Traders</span>
              <span className={`${theme.neon.text} block`}>Are Saying</span>
            </h2>
          </motion.div>
          
          {/* Auto-swiping Carousel */}
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-3xl">
              <motion.div 
                ref={reviewsRef}
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentReviewIndex * 100}%)` }}
              >
                {reviews.map((review, index) => (
                  <div key={review.id} className="w-full flex-shrink-0 px-4">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`${theme.card} p-8 rounded-3xl text-center relative overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5" />
                      
                      <div className="relative z-10">
                        <img 
                          src={review.avatar} 
                          alt={review.name}
                          className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-yellow-400/30"
                        />
                        
                        <div className="flex justify-center mb-4">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        
                        <p className={`text-lg ${theme.text.secondary} mb-6 leading-relaxed italic`}>
                          "{review.text}"
                        </p>
                        
                        <div className="flex items-center justify-center space-x-2">
                          <h4 className={`font-semibold ${theme.text.primary}`}>{review.name}</h4>
                          {review.verified && (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </motion.div>
            </div>
            
            {/* Navigation Buttons */}
            <button
              onClick={() => handleReviewNavigation('prev')}
              className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme.button.secondary} p-3 rounded-full hover:scale-110 transition-all duration-300`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => handleReviewNavigation('next')}
              className={`absolute right-4 top-1/2 -translate-y-1/2 ${theme.button.secondary} p-3 rounded-full hover:scale-110 transition-all duration-300`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            
            {/* Dots Indicator */}
            <div className="flex justify-center mt-8 space-x-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentReviewIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentReviewIndex 
                      ? 'bg-yellow-400 scale-125' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by Traders Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className={`${theme.text.primary} block`}>Trusted by</span>
              <span className={`${theme.neon.text} block`}>Leading Exchanges</span>
            </h2>
            <p className={`text-lg ${theme.text.secondary} max-w-3xl mx-auto leading-relaxed`}>
              Integrated with top cryptocurrency exchanges worldwide
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
            {['Binance', 'Coinbase', 'Kraken', 'Bybit', 'OKX', 'KuCoin'].map((exchange, index) => (
              <motion.div
                key={exchange}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1 }}
                className={`${theme.card} p-6 rounded-2xl text-center group cursor-pointer`}
              >
                <div className={`text-2xl font-bold ${theme.text.primary} group-hover:${theme.text.accent} transition-colors`}>
                  {exchange}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Address Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Contact Info */}
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                  <span className={`${theme.text.primary} block`}>Visit Our</span>
                  <span className={`${theme.neon.text} block`}>Global Office</span>
                </h2>
                <p className={`text-lg ${theme.text.secondary} leading-relaxed`}>
                  Connect with our team at our headquarters or reach out through our global support channels.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${theme.text.primary} mb-1`}>Headquarters</h3>
                    <p className={`${theme.text.secondary}`}>
                      123 Crypto Street, Financial District<br />
                      New York, NY 10004, USA
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${theme.text.primary} mb-1`}>Phone</h3>
                    <p className={`${theme.text.secondary}`}>+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${theme.text.primary} mb-1`}>Email</h3>
                    <p className={`${theme.text.secondary}`}>support@mesatrading.com</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Map Embed */}
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className={`${theme.card} p-2 rounded-3xl overflow-hidden`}
            >
              <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <MapPin className={`w-12 h-12 ${theme.text.accent} mx-auto mb-4`} />
                  <p className={`${theme.text.secondary}`}>Interactive Map</p>
                  <p className={`text-sm ${theme.text.muted}`}>Click to view location</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 border-t border-cyan-500/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mr-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <span className={`text-3xl font-bold ${theme.neon.text}`}>Mesa Trading</span>
            </div>
            
            <p className={`text-xl ${theme.text.secondary} mb-12 max-w-3xl mx-auto leading-relaxed`}>
              Your trusted partner in cryptocurrency trading. Join thousands of successful crypto traders.
            </p>
            
            <div className={`${theme.card} p-8 mb-12 rounded-3xl`}>
              <h3 className={`text-2xl font-bold mb-4 ${theme.neon.text}`}>
                Ready to Start Crypto Trading?
              </h3>
              <p className={`${theme.text.secondary} mb-6`}>
                Join our community today and get access to premium crypto signals
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => requireAuth(() => setIsPremiumModalOpen(true))}
                  className={`${theme.button.primary} px-8 py-4 rounded-2xl font-semibold`}
                >
                  Start Trading Free
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => requireAuth(() => window.location.href = '/profile')}
                  className={`${theme.button.secondary} px-8 py-4 rounded-2xl font-semibold`}
                >
                  View Platform
                </motion.button>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              <Link to="/privacy" className={`${theme.text.muted} hover:${theme.text.accent} transition-colors font-medium`}>
                Privacy Policy
              </Link>
              <Link to="/terms" className={`${theme.text.muted} hover:${theme.text.accent} transition-colors font-medium`}>
                Terms of Service
              </Link>
              <Link to="/support" className={`${theme.text.muted} hover:${theme.text.accent} transition-colors font-medium`}>
                Support
              </Link>
              <Link to="/contact" className={`${theme.text.muted} hover:${theme.text.accent} transition-colors font-medium`}>
                Contact Us
              </Link>
            </div>
            
            <div className="pt-8 border-t border-cyan-500/10">
              <div className={`${theme.text.muted} text-sm`}>
                © 2024 Mesa Trading. All rights reserved. | Designed with ❤️ for crypto traders
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Premium Request Modal */}
      <PremiumRequestModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        onSubmit={handlePremiumRequest}
      />
    </div>
  );
};

export default LandingPage;