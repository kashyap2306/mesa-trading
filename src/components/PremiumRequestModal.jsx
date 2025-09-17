import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Building2, Crown, CheckCircle, ArrowRight, ArrowLeft, Star, Zap, TrendingUp } from 'lucide-react';
import { createPremiumRequest } from '../services/premiumRequestService';
import { useAuth } from '../contexts/AuthContext';
import { useDarkMode } from '../contexts/DarkModeContext';

const PremiumRequestModal = ({ isOpen, onClose, onSubmit, isLoading = false }) => {
  const { currentUser } = useAuth();
  const { getThemeClasses } = useDarkMode();
  const theme = getThemeClasses();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fundAmount: '',
    exchange: '',
    customExchange: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const exchanges = [
    { name: 'Binance', logo: '🟡', popular: true },
    { name: 'Bybit', logo: '🟠', popular: true },
    { name: 'Coinbase', logo: '🔵', popular: true },
    { name: 'OKX', logo: '⚫', popular: false },
    { name: 'KuCoin', logo: '🟢', popular: false },
    { name: 'Kraken', logo: '🟣', popular: false },
    { name: 'Gate.io', logo: '🔷', popular: false },
    { name: 'Bitget', logo: '🟤', popular: false },
    { name: 'Huobi', logo: '🔴', popular: false },
    { name: 'Gemini', logo: '💎', popular: false },
    { name: 'Other', logo: '➕', popular: false }
  ];

  const steps = [
    { id: 1, title: 'Fund Amount', icon: DollarSign, description: 'Enter your investment amount' },
    { id: 2, title: 'Exchange', icon: Building2, description: 'Select your trading platform' },
    { id: 3, title: 'Confirm', icon: CheckCircle, description: 'Review and submit request' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.fundAmount) {
        newErrors.fundAmount = 'Fund amount is required';
      } else if (parseFloat(formData.fundAmount) <= 0) {
        newErrors.fundAmount = 'Fund amount must be greater than 0';
      } else if (parseFloat(formData.fundAmount) < 100) {
        newErrors.fundAmount = 'Minimum fund amount is $100';
      } else if (parseFloat(formData.fundAmount) > 1000000) {
        newErrors.fundAmount = 'Maximum fund amount is $1,000,000';
      }
    }
    
    if (step === 2) {
      if (!formData.exchange) {
        newErrors.exchange = 'Exchange selection is required';
      }
      if (formData.exchange === 'Other' && !formData.customExchange.trim()) {
        newErrors.customExchange = 'Please specify your exchange';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setErrors({});
  };

  const resetModal = () => {
    setCurrentStep(1);
    setFormData({
      fundAmount: '',
      exchange: '',
      customExchange: ''
    });
    setErrors({});
    setIsSubmitting(false);
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) {
      return;
    }

    if (!currentUser) {
      setErrors({ general: 'You must be logged in to submit a premium request.' });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const requestData = {
        fundAmount: parseFloat(formData.fundAmount),
        exchange: formData.exchange === 'Other' ? formData.customExchange : formData.exchange,
        userEmail: currentUser.email,
        userName: currentUser.displayName || currentUser.email
      };

      await createPremiumRequest(requestData, currentUser.uid);
      
      if (onSubmit) {
        await onSubmit(requestData);
      }
      
      setCurrentStep(4); // Success step
    } catch (error) {
      console.error('Error submitting premium request:', error);
      setErrors({ general: error.message || 'Failed to submit premium request. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
        onClick={handleClose}
      >
        {/* Glassmorphism Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(6, 182, 212, 0.2)',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(6, 182, 212, 0.1)'
          }}
        >
          {/* Header */}
          <div className="p-6 border-b border-cyan-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: currentStep * 90 }}
                  className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl shadow-lg shadow-cyan-500/25"
                >
                  <Crown className="h-6 w-6 text-white" />
                </motion.div>
                <div>
                  <h2 className={`text-xl font-bold ${theme.text.primary}`}>Premium Access</h2>
                  <p className={`text-sm ${theme.text.secondary}`}>
                    {currentStep <= 3 ? `Step ${currentStep} of 3` : 'Request Submitted'}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className={`p-2 ${theme.text.secondary} hover:${theme.text.primary} hover:bg-red-500/10 rounded-lg transition-all duration-200`}
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>
            
            {/* Progress Steps */}
            {currentStep <= 3 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <motion.div
                        animate={{
                          backgroundColor: currentStep >= step.id ? '#06b6d4' : '#374151',
                          scale: currentStep === step.id ? 1.1 : 1,
                          boxShadow: currentStep === step.id ? '0 0 20px rgba(6, 182, 212, 0.5)' : 'none'
                        }}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold relative"
                      >
                        <step.icon className="w-5 h-5" />
                        {currentStep > step.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute inset-0 bg-green-500 rounded-full flex items-center justify-center"
                          >
                            <CheckCircle className="w-5 h-5 text-white" />
                          </motion.div>
                        )}
                      </motion.div>
                      {index < steps.length - 1 && (
                        <motion.div
                          animate={{
                            backgroundColor: currentStep > step.id ? '#06b6d4' : '#374151'
                          }}
                          className="w-16 h-1 mx-2 rounded-full"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <h3 className={`font-semibold ${theme.text.primary}`}>
                    {steps[currentStep - 1]?.title}
                  </h3>
                  <p className={`text-sm ${theme.text.secondary}`}>
                    {steps[currentStep - 1]?.description}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* Step 1: Fund Amount */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center space-x-2 text-yellow-400">
                      <Star className="w-5 h-5" />
                      <span className="font-semibold">90% Accuracy Trading Signals</span>
                      <Star className="w-5 h-5" />
                    </div>
                    <p className={`text-sm ${theme.text.secondary}`}>
                      Join our premium community and get access to high-accuracy trading signals
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium ${theme.text.primary} mb-2`}>
                        Investment Amount (USD)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          name="fundAmount"
                          value={formData.fundAmount}
                          onChange={handleInputChange}
                          placeholder="Enter amount (min. $100)"
                          className={`w-full pl-10 pr-4 py-3 ${theme.input} rounded-xl border transition-all duration-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 ${errors.fundAmount ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {errors.fundAmount && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-sm mt-1"
                        >
                          {errors.fundAmount}
                        </motion.p>
                      )}
                    </div>

                    {/* Quick Amount Buttons */}
                    <div className="grid grid-cols-4 gap-2">
                      {[100, 500, 1000, 5000].map((amount) => (
                        <motion.button
                          key={amount}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setFormData(prev => ({ ...prev, fundAmount: amount.toString() }))}
                          className={`py-2 px-3 text-sm rounded-lg border transition-all duration-200 ${
                            formData.fundAmount === amount.toString()
                              ? 'bg-cyan-500 text-white border-cyan-500'
                              : `${theme.card} ${theme.text.secondary} border-gray-600 hover:border-cyan-400`
                          }`}
                        >
                          {formatCurrency(amount)}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Exchange Selection */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h3 className={`text-lg font-semibold ${theme.text.primary} mb-2`}>
                      Select Your Trading Exchange
                    </h3>
                    <p className={`text-sm ${theme.text.secondary}`}>
                      Choose the platform where you'll be trading
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Popular Exchanges */}
                    <div>
                      <h4 className={`text-sm font-medium ${theme.text.primary} mb-3 flex items-center`}>
                        <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                        Popular Exchanges
                      </h4>
                      <div className="grid grid-cols-3 gap-3">
                        {exchanges.filter(ex => ex.popular).map((exchange) => (
                          <motion.button
                            key={exchange.name}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFormData(prev => ({ ...prev, exchange: exchange.name }))}
                            className={`p-3 rounded-xl border transition-all duration-200 ${
                              formData.exchange === exchange.name
                                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400'
                                : `${theme.card} border-gray-600 ${theme.text.secondary} hover:border-cyan-400`
                            }`}
                          >
                            <div className="text-2xl mb-1">{exchange.logo}</div>
                            <div className="text-sm font-medium">{exchange.name}</div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Other Exchanges */}
                    <div>
                      <h4 className={`text-sm font-medium ${theme.text.primary} mb-3`}>
                        Other Exchanges
                      </h4>
                      <div className="grid grid-cols-4 gap-2">
                        {exchanges.filter(ex => !ex.popular).map((exchange) => (
                          <motion.button
                            key={exchange.name}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFormData(prev => ({ ...prev, exchange: exchange.name }))}
                            className={`p-2 rounded-lg border transition-all duration-200 text-xs ${
                              formData.exchange === exchange.name
                                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400'
                                : `${theme.card} border-gray-600 ${theme.text.secondary} hover:border-cyan-400`
                            }`}
                          >
                            <div className="text-lg mb-1">{exchange.logo}</div>
                            <div className="font-medium">{exchange.name}</div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Exchange Input */}
                    {formData.exchange === 'Other' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <input
                          type="text"
                          name="customExchange"
                          value={formData.customExchange}
                          onChange={handleInputChange}
                          placeholder="Enter your exchange name"
                          className={`w-full px-4 py-3 ${theme.input} rounded-xl border transition-all duration-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 ${errors.customExchange ? 'border-red-500' : ''}`}
                        />
                        {errors.customExchange && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-sm mt-1"
                          >
                            {errors.customExchange}
                          </motion.p>
                        )}
                      </motion.div>
                    )}

                    {errors.exchange && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm"
                      >
                        {errors.exchange}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Confirmation */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h3 className={`text-lg font-semibold ${theme.text.primary} mb-2`}>
                      Confirm Your Premium Request
                    </h3>
                    <p className={`text-sm ${theme.text.secondary}`}>
                      Please review your details before submitting
                    </p>
                  </div>

                  {/* Summary Card */}
                  <div className={`${theme.card} border border-cyan-500/20 rounded-xl p-4 space-y-4`}>
                    <div className="flex items-center justify-between">
                      <span className={`${theme.text.secondary}`}>Investment Amount:</span>
                      <span className={`font-semibold ${theme.text.primary} text-lg`}>
                        {formatCurrency(parseFloat(formData.fundAmount) || 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`${theme.text.secondary}`}>Trading Exchange:</span>
                      <span className={`font-semibold ${theme.text.primary}`}>
                        {formData.exchange === 'Other' ? formData.customExchange : formData.exchange}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`${theme.text.secondary}`}>Account:</span>
                      <span className={`font-semibold ${theme.text.primary}`}>
                        {currentUser?.email}
                      </span>
                    </div>
                  </div>

                  {/* Benefits Reminder */}
                  <div className={`bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <Crown className="w-5 h-5 text-yellow-400" />
                      <span className={`font-semibold ${theme.text.primary}`}>Premium Benefits</span>
                    </div>
                    <ul className={`text-sm ${theme.text.secondary} space-y-1`}>
                      <li>• 90% accuracy trading signals</li>
                      <li>• Real-time market analysis</li>
                      <li>• Exclusive Telegram community</li>
                      <li>• 24/7 premium support</li>
                    </ul>
                  </div>

                  {errors.general && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-500/10 border border-red-500/20 rounded-xl p-3"
                    >
                      <p className="text-red-400 text-sm">{errors.general}</p>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Step 4: Success */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto"
                  >
                    <CheckCircle className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  <div>
                    <h3 className={`text-xl font-bold ${theme.text.primary} mb-2`}>
                      Request Submitted Successfully!
                    </h3>
                    <p className={`${theme.text.secondary}`}>
                      We'll review your premium request within 24 hours and notify you via email.
                    </p>
                  </div>

                  <div className={`${theme.card} border border-cyan-500/20 rounded-xl p-4`}>
                    <p className={`text-sm ${theme.text.secondary} mb-2`}>What happens next?</p>
                    <ul className={`text-sm ${theme.text.secondary} space-y-1 text-left`}>
                      <li>• Our team will review your request</li>
                      <li>• You'll receive an email confirmation</li>
                      <li>• Once approved, you'll get Telegram access</li>
                      <li>• Start receiving premium signals immediately</li>
                    </ul>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClose}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-200"
                  >
                    Close
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Navigation */}
          {currentStep <= 3 && (
            <div className="p-6 border-t border-cyan-500/20">
              <div className="flex items-center justify-between">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    currentStep === 1
                      ? 'opacity-50 cursor-not-allowed'
                      : `${theme.text.secondary} hover:${theme.text.primary} hover:bg-gray-500/10`
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </motion.button>

                {currentStep < 3 ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-200"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Request</span>
                        <CheckCircle className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PremiumRequestModal;