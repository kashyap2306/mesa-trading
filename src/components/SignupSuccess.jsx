import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

const SignupSuccess = () => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 100);

    // Start countdown for auto-redirect
    const countdownTimer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          navigate('/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownTimer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/30 to-indigo-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-indigo-400/25 to-blue-400/25 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 text-center shadow-2xl">
          {/* Animated Check Mark */}
          <div className="mb-8 flex justify-center">
            <div className={`relative transition-all duration-1000 transform ${
              showAnimation ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}>
              <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <CheckCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
              </div>
              {/* Ripple Effect */}
              <div className="absolute inset-0 w-24 h-24 bg-green-400/30 rounded-full animate-ping"></div>
              <div className="absolute inset-0 w-24 h-24 bg-green-400/20 rounded-full animate-ping" style={{animationDelay: '200ms'}}></div>
            </div>
          </div>

          {/* Success Message */}
          <div className={`space-y-4 transition-all duration-1000 delay-300 transform ${
            showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <h1 className="text-3xl font-bold text-white mb-2">
              Signup Successfully Completed!
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              Welcome to Mesa Trading! Your account has been created successfully.
            </p>
          </div>

          {/* Action Buttons */}
          <div className={`mt-8 space-y-4 transition-all duration-1000 delay-500 transform ${
            showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <Link 
              to="/login" 
              className="group relative w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 flex items-center justify-center"
            >
              <span className="relative z-10 flex items-center">
                Login Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>

            {/* Auto-redirect Notice */}
            <div className="text-sm text-gray-400">
              Automatically redirecting to login in {countdown} seconds...
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60 animate-pulse delay-1000"></div>
        </div>
      </div>
    </div>
  );
};

export default SignupSuccess;