import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import VIPBadge from './VIPBadge';
import Button, { IconButton, CopyButton } from './Buttons';
import { formatDate, formatRelativeTime } from '../utils/dateFormatter';

const UserCard = ({ 
  user, 
  onEdit, 
  onDelete, 
  onToggleVIP, 
  showActions = true,
  compact = false,
  onClick 
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    // Don't trigger card click if clicking on buttons or menu
    if (e.target.closest('button') || e.target.closest('[role="menu"]')) {
      return;
    }
    
    if (onClick) {
      onClick(user);
    } else {
      navigate(`/users/${user.id}`);
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };
  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'moderator':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'vip':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400';
      case 'user':
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  const getAvatarColor = (name) => {
    const colors = [
      'from-red-400 to-red-600',
      'from-blue-400 to-blue-600',
      'from-green-400 to-green-600',
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600',
      'from-indigo-400 to-indigo-600',
      'from-yellow-400 to-yellow-600',
      'from-teal-400 to-teal-600'
    ];
    
    const index = name?.charCodeAt(0) % colors.length || 0;
    return colors[index];
  };

  if (compact) {
    return (
      <div 
        onClick={handleCardClick}
        className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer group"
      >
        {/* Avatar */}
        <div className={`w-10 h-10 bg-gradient-to-br ${getAvatarColor(user.name)} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
          {getInitials(user.name)}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user.name}
            </p>
            {user.vipAccess && <VIPBadge size="xs" />}
            {user.verified && (
              <CheckBadgeIcon className="w-4 h-4 text-blue-500" title="Verified" />
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {user.email}
          </p>
        </div>

        {/* Status */}
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
          {user.status || 'Active'}
        </span>

        {/* Actions */}
        {showActions && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <IconButton
              icon={EyeIcon}
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/users/${user.id}`);
              }}
              title="View Details"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Header */}
      <div className="relative p-6 pb-4">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 opacity-50"></div>
        
        <div className="relative flex items-start justify-between">
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            <div 
              onClick={handleCardClick}
              className={`w-16 h-16 bg-gradient-to-br ${getAvatarColor(user.name)} rounded-xl flex items-center justify-center text-white font-bold text-lg cursor-pointer hover:scale-105 transition-transform`}
            >
              {getInitials(user.name)}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 
                  onClick={handleCardClick}
                  className="text-lg font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {user.name}
                </h3>
                {user.vipAccess && <VIPBadge />}
                {user.verified && (
                  <CheckBadgeIcon className="w-5 h-5 text-blue-500" title="Verified Account" />
                )}
              </div>
              
              <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                  {user.role || 'User'}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                  {user.status || 'Active'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions Menu */}
          {showActions && (
            <div className="relative">
              <IconButton
                icon={EllipsisVerticalIcon}
                variant="ghost"
                size="sm"
                onClick={() => setShowMenu(!showMenu)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={isLoading}
              />

              {/* Dropdown Menu */}
              {showMenu && (
                <div className="absolute right-0 top-8 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                  <div className="py-1" role="menu">
                    <button
                      onClick={() => handleAction(() => navigate(`/users/${user.id}`))}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <EyeIcon className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                    
                    {onEdit && (
                      <button
                        onClick={() => handleAction(onEdit, user)}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <PencilIcon className="w-4 h-4" />
                        <span>Edit User</span>
                      </button>
                    )}
                    
                    {onToggleVIP && (
                      <button
                        onClick={() => handleAction(onToggleVIP, user)}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <CheckBadgeIcon className="w-4 h-4" />
                        <span>{user.vipAccess ? 'Remove VIP' : 'Make VIP'}</span>
                      </button>
                    )}
                    
                    <hr className="my-1 border-gray-200 dark:border-gray-600" />
                    
                    {onDelete && (
                      <button
                        onClick={() => handleAction(onDelete, user)}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                        <span>Delete User</span>
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
      <div className="px-6 pb-6">
        {/* Contact Info */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
            <EnvelopeIcon className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{user.email}</span>
            <CopyButton 
              text={user.email} 
              size="xs" 
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>
          
          {user.mobile && (
            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
              <PhoneIcon className="w-4 h-4 flex-shrink-0" />
              <span>{user.mobile}</span>
              <CopyButton 
                text={user.mobile} 
                size="xs" 
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          )}
          
          <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
            <CalendarIcon className="w-4 h-4 flex-shrink-0" />
            <span>Joined {formatRelativeTime(user.createdAt)}</span>
          </div>
        </div>

        {/* VIP Invite Link */}
        {user.vipAccess && user.inviteLink && (
          <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <LinkIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-medium text-amber-800 dark:text-amber-300">
                  VIP Invite Link
                </span>
              </div>
              <CopyButton 
                text={user.inviteLink} 
                size="xs" 
                variant="outline"
                className="text-amber-600 border-amber-300 hover:bg-amber-100 dark:text-amber-400 dark:border-amber-600 dark:hover:bg-amber-900/30"
              />
            </div>
          </div>
        )}

        {/* Stats */}
        {user.stats && (
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {user.stats.webinarsAttended || 0}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Webinars
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {user.stats.loginCount || 0}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Logins
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {user.stats.referrals || 0}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Referrals
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleCardClick}
            className="flex-1"
          >
            View Profile
          </Button>
          
          {user.vipAccess && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                // Handle VIP dashboard navigation
                navigate(`/users/${user.id}/vip`);
              }}
            >
              VIP Dashboard
            </Button>
          )}
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

export default UserCard;