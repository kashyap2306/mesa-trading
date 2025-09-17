import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  EyeIcon,
  ShareIcon,
  BookmarkIcon,
  PlayIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  LinkIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import {
  BookmarkIcon as BookmarkSolidIcon,
  PlayIcon as PlaySolidIcon,
  CheckIcon
} from '@heroicons/react/24/solid';
import Button, { IconButton, CopyButton } from './Buttons';
import { formatDate, formatTime, formatRelativeTime } from '../utils/dateFormatter';

const WebinarCard = ({
  webinar,
  onEdit,
  onDelete,
  onRegister,
  onBookmark,
  showActions = true,
  compact = false,
  onClick
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(webinar.isBookmarked || false);
  const [isRegistered, setIsRegistered] = useState(webinar.isRegistered || false);
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    // Don't trigger card click if clicking on buttons or menu
    if (e.target.closest('button') || e.target.closest('[role="menu"]')) {
      return;
    }
    
    if (onClick) {
      onClick(webinar);
    } else {
      navigate(`/webinars/${webinar.id}`);
    }
  };

  const handleAction = async (action, ...args) => {
    setIsLoading(true);
    setShowMenu(false);
    
    try {
      await action(...args);
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmark = async (e) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    
    if (onBookmark) {
      try {
        await onBookmark(webinar, !isBookmarked);
      } catch (error) {
        // Revert on error
        setIsBookmarked(isBookmarked);
        console.error('Bookmark failed:', error);
      }
    }
  };

  const handleRegister = async (e) => {
    e.stopPropagation();
    
    if (onRegister) {
      try {
        setIsLoading(true);
        await onRegister(webinar);
        setIsRegistered(true);
      } catch (error) {
        console.error('Registration failed:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'live':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'premium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400';
      case 'vip':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'free':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const isUpcoming = () => {
    return new Date(webinar.date) > new Date();
  };

  const isLive = () => {
    const now = new Date();
    const webinarDate = new Date(webinar.date);
    const endTime = new Date(webinarDate.getTime() + (webinar.duration || 60) * 60000);
    return now >= webinarDate && now <= endTime;
  };

  if (compact) {
    return (
      <div 
        onClick={handleCardClick}
        className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer group"
      >
        {/* Thumbnail */}
        <div className="relative w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          {webinar.thumbnail ? (
            <img 
              src={webinar.thumbnail} 
              alt={webinar.title}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <PlayIcon className="w-8 h-8 text-white" />
          )}
          {isLive() && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {webinar.title}
            </h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(webinar.status)}`}>
              {isLive() ? 'Live' : webinar.status || 'Upcoming'}
            </span>
          </div>
          
          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <CalendarIcon className="w-3 h-3" />
              <span>{formatDate(webinar.date)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ClockIcon className="w-3 h-3" />
              <span>{formatTime(webinar.date)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <UsersIcon className="w-3 h-3" />
              <span>{webinar.registeredCount || 0}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <IconButton
            icon={isBookmarked ? BookmarkSolidIcon : BookmarkIcon}
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            className={isBookmarked ? 'text-amber-500' : ''}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
          />
          
          {isUpcoming() && !isRegistered && (
            <Button
              variant="primary"
              size="xs"
              onClick={handleRegister}
              disabled={isLoading}
            >
              Register
            </Button>
          )}
          
          {isLive() && (
            <Button
              variant="primary"
              size="xs"
              onClick={(e) => {
                e.stopPropagation();
                window.open(webinar.link, '_blank');
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Join Live
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-indigo-500 to-purple-600">
        {webinar.thumbnail ? (
          <img 
            src={webinar.thumbnail} 
            alt={webinar.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <PlaySolidIcon className="w-16 h-16 text-white opacity-80" />
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(webinar.status)}`}>
            {isLive() ? (
              <>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1"></div>
                Live
              </>
            ) : (
              webinar.status || 'Upcoming'
            )}
          </span>
        </div>
        
        {/* Type Badge */}
        {webinar.type && (
          <div className="absolute top-3 right-3">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(webinar.type)}`}>
              {webinar.type}
            </span>
          </div>
        )}
        
        {/* Live Indicator */}
        {isLive() && (
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>LIVE NOW</span>
            </div>
          </div>
        )}
        
        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <IconButton
            icon={isBookmarked ? BookmarkSolidIcon : BookmarkIcon}
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            className={`bg-white/20 backdrop-blur-sm hover:bg-white/30 ${isBookmarked ? 'text-amber-400' : 'text-white'}`}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
          />
          
          <IconButton
            icon={ShareIcon}
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigator.share({
                title: webinar.title,
                text: webinar.description,
                url: window.location.origin + `/webinars/${webinar.id}`
              }).catch(() => {
                // Fallback to clipboard
                navigator.clipboard.writeText(window.location.origin + `/webinars/${webinar.id}`);
              });
            }}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
            title="Share"
          />
          
          {showActions && (
            <div className="relative">
              <IconButton
                icon={EllipsisVerticalIcon}
                variant="ghost"
                size="sm"
                onClick={() => setShowMenu(!showMenu)}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
                disabled={isLoading}
              />
              
              {/* Dropdown Menu */}
              {showMenu && (
                <div className="absolute right-0 top-8 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                  <div className="py-1" role="menu">
                    <button
                      onClick={() => handleAction(() => navigate(`/webinars/${webinar.id}`))}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <EyeIcon className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                    
                    {onEdit && (
                      <button
                        onClick={() => handleAction(onEdit, webinar)}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <PencilIcon className="w-4 h-4" />
                        <span>Edit Webinar</span>
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(webinar.link);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <LinkIcon className="w-4 h-4" />
                      <span>Copy Link</span>
                    </button>
                    
                    <hr className="my-1 border-gray-200 dark:border-gray-600" />
                    
                    {onDelete && (
                      <button
                        onClick={() => handleAction(onDelete, webinar)}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                        <span>Delete Webinar</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 
            onClick={handleCardClick}
            className="text-lg font-semibold text-gray-900 dark:text-white mb-2 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2"
          >
            {webinar.title}
          </h3>
          
          {webinar.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {webinar.description}
            </p>
          )}
        </div>

        {/* Meta Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
            <CalendarIcon className="w-4 h-4 flex-shrink-0" />
            <span>{formatDate(webinar.date)}</span>
            <ClockIcon className="w-4 h-4 flex-shrink-0" />
            <span>{formatTime(webinar.date)}</span>
          </div>
          
          {webinar.createdBy && (
            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
              <UserIcon className="w-4 h-4 flex-shrink-0" />
              <span>By {webinar.createdBy}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
            <UsersIcon className="w-4 h-4 flex-shrink-0" />
            <span>{webinar.registeredCount || 0} registered</span>
            {webinar.maxParticipants && (
              <span>/ {webinar.maxParticipants} max</span>
            )}
          </div>
        </div>

        {/* Tags */}
        {webinar.tags && webinar.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {webinar.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
            {webinar.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                +{webinar.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isLive() ? (
              <Button
                variant="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(webinar.link, '_blank');
                }}
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={isLoading}
              >
                <PlaySolidIcon className="w-4 h-4 mr-2" />
                Join Live
              </Button>
            ) : isUpcoming() ? (
              isRegistered ? (
                <Button
                  variant="outline"
                  onClick={handleCardClick}
                  disabled={isLoading}
                >
                  <CheckIcon className="w-4 h-4 mr-2" />
                  Registered
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleRegister}
                  disabled={isLoading}
                >
                  Register Now
                </Button>
              )
            ) : (
              <Button
                variant="outline"
                onClick={handleCardClick}
                disabled={isLoading}
              >
                View Recording
              </Button>
            )}
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {formatRelativeTime(webinar.date)}
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}
    </div>
  );
};

export default WebinarCard;