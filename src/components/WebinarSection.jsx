import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Play, ExternalLink } from 'lucide-react';
import { getUpcomingWebinars, getLiveWebinars, formatWebinarDate, formatWebinarTime, isWebinarLive } from '../services/webinarService';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useAuth } from '../contexts/AuthContext';
import { useRequireAuth } from '../utils/authUtils';

const WebinarSection = ({ onOpenPremiumModal }) => {
  const [webinars, setWebinars] = useState([]);
  const [liveWebinars, setLiveWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser, userProfile } = useAuth();
  const requireAuth = useRequireAuth();
  const { getThemeClasses } = useDarkMode();
  const theme = getThemeClasses();

  useEffect(() => {
    const fetchWebinars = async () => {
      try {
        setLoading(true);
        const [upcoming, live] = await Promise.all([
          getUpcomingWebinars(3),
          getLiveWebinars()
        ]);
        setWebinars(upcoming);
        setLiveWebinars(live);
        setError(null);
      } catch (err) {
        console.error('Error fetching webinars:', err);
        setError('Failed to load webinars');
      } finally {
        setLoading(false);
      }
    };

    fetchWebinars();
    
    // Refresh every 30 seconds to check for live status
    const interval = setInterval(fetchWebinars, 30000);
    return () => clearInterval(interval);
  }, []);

  const WebinarCard = ({ webinar, isLive = false }) => {
    const cardClasses = isLive 
      ? `${theme.card} border-2 ${theme.neon.border} ${theme.neon.glow} animate-pulse`
      : `${theme.card} border ${theme.neon.border} hover:${theme.neon.glow} transition-all duration-300`;

    return (
      <div className={cardClasses}>
        <div className="p-4">
          {isLive && (
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-400 text-sm font-semibold uppercase tracking-wide">Live Now</span>
            </div>
          )}
          
          <h3 className={`font-semibold text-lg mb-2 ${theme.text.primary}`}>
            {webinar.title || 'Crypto Trading Masterclass'}
          </h3>
          
          <p className={`text-sm mb-4 ${theme.text.secondary} line-clamp-2`}>
            {webinar.description || 'Learn advanced trading strategies and market analysis techniques from industry experts.'}
          </p>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className={`w-4 h-4 ${theme.text.accent}`} />
              <span className={`text-sm ${theme.text.secondary}`}>
                {formatWebinarDate(webinar.date)}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className={`w-4 h-4 ${theme.text.accent}`} />
              <span className={`text-sm ${theme.text.secondary}`}>
                {formatWebinarTime(webinar.date)}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className={`w-4 h-4 ${theme.text.accent}`} />
              <span className={`text-sm ${theme.text.secondary}`}>
                {Math.floor(Math.random() * 500) + 100} registered
              </span>
            </div>
          </div>
          
          <button 
            className={`w-full ${theme.button.primary} ${theme.neon.glow} flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105`}
            onClick={() => {
              requireAuth(() => {
                // Check if user has premium access for premium webinars
                if (webinar.isPremium && !userProfile?.vipAccess) {
                  alert('This webinar requires premium access. Please upgrade to premium to join.');
                  return;
                }
                if (webinar.link) {
                  window.open(webinar.link, '_blank');
                } else {
                  alert('Webinar link will be available closer to the start time.');
                }
              });
            }}
          >
            {isLive ? (
              <>
                <Play className="w-4 h-4" />
                {webinar.isPremium && !userProfile?.vipAccess ? 'Premium Only' : 'Join Live'}
              </>
            ) : (
              <>
                <ExternalLink className="w-4 h-4" />
                {webinar.isPremium && !userProfile?.vipAccess ? 'Premium Only' : 'Register Now'}
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`${theme.card} p-8`}>
        <div className="animate-pulse space-y-4">
          <div className={`h-6 ${theme.background} rounded`}></div>
          <div className={`h-4 ${theme.background} rounded w-3/4`}></div>
          <div className={`h-4 ${theme.background} rounded w-1/2`}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${theme.card} p-8 text-center`}>
        <p className={`${theme.text.secondary} mb-4`}>{error}</p>
        <button 
          className={`${theme.button.primary} ${theme.neon.glow}`}
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${theme.button.secondary} ${theme.neon.glow}`}>
            90% Accuracy Rate
          </div>
        </div>
        <h2 className={`text-2xl md:text-3xl font-bold ${theme.text.primary}`}>
          Live Trading Webinars
        </h2>
        <p className={`${theme.text.secondary} max-w-md mx-auto`}>
          Join our expert-led sessions and master crypto trading with proven strategies
        </p>
      </div>

      {/* Live Webinars */}
      {liveWebinars.length > 0 && (
        <div className="space-y-4">
          <h3 className={`text-lg font-semibold ${theme.text.primary} flex items-center gap-2`}>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            Live Now
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {liveWebinars.map((webinar) => (
              <WebinarCard key={webinar.id} webinar={webinar} isLive={true} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Webinars */}
      {webinars.length > 0 && (
        <div className="space-y-4">
          <h3 className={`text-lg font-semibold ${theme.text.primary}`}>
            Upcoming Sessions
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {webinars.map((webinar) => (
              <WebinarCard key={webinar.id} webinar={webinar} />
            ))}
          </div>
        </div>
      )}

      {/* No webinars fallback */}
      {webinars.length === 0 && liveWebinars.length === 0 && (
        <div className={`${theme.card} p-8 text-center`}>
          <Calendar className={`w-12 h-12 ${theme.text.accent} mx-auto mb-4`} />
          <h3 className={`text-lg font-semibold ${theme.text.primary} mb-2`}>
            No Upcoming Webinars
          </h3>
          <p className={`${theme.text.secondary} mb-4`}>
            Stay tuned for our next trading masterclass sessions
          </p>
          <button className={`${theme.button.primary} ${theme.neon.glow}`}>
            Get Notified
          </button>
        </div>
      )}

      {/* Call to Action */}
      <div className={`${theme.card} p-6 text-center border-2 ${theme.neon.border}`}>
        <h3 className={`text-lg font-semibold ${theme.text.primary} mb-2`}>
          Want Premium Access?
        </h3>
        <p className={`${theme.text.secondary} mb-4`}>
          Get exclusive access to VIP webinars, 1-on-1 sessions, and our private Telegram group
        </p>
        <button 
          className={`${theme.button.primary} ${theme.neon.glow} px-6 py-2`}
          onClick={() => requireAuth(() => onOpenPremiumModal && onOpenPremiumModal())}
        >
          Upgrade to Premium
        </button>
      </div>
    </div>
  );
};

export default WebinarSection;