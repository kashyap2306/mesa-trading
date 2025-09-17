/**
 * Date formatting utilities
 */

/**
 * Format a date to a readable string
 * @param {Date|string} date - The date to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  
  return dateObj.toLocaleDateString('en-US', defaultOptions);
};

/**
 * Format a time to a readable string
 * @param {Date|string} date - The date/time to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted time string
 */
export const formatTime = (date, options = {}) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid Time';
  
  const defaultOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    ...options
  };
  
  return dateObj.toLocaleTimeString('en-US', defaultOptions);
};

/**
 * Format a date and time together
 * @param {Date|string} date - The date/time to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date, options = {}) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid DateTime';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    ...options
  };
  
  return dateObj.toLocaleString('en-US', defaultOptions);
};

/**
 * Format a date relative to now (e.g., "2 hours ago", "in 3 days")
 * @param {Date|string} date - The date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);
  
  if (Math.abs(diffInSeconds) < 60) {
    return diffInSeconds >= 0 ? 'just now' : 'in a moment';
  } else if (Math.abs(diffInMinutes) < 60) {
    return diffInMinutes >= 0 
      ? `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
      : `in ${Math.abs(diffInMinutes)} minute${Math.abs(diffInMinutes) !== 1 ? 's' : ''}`;
  } else if (Math.abs(diffInHours) < 24) {
    return diffInHours >= 0 
      ? `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`
      : `in ${Math.abs(diffInHours)} hour${Math.abs(diffInHours) !== 1 ? 's' : ''}`;
  } else if (Math.abs(diffInDays) < 7) {
    return diffInDays >= 0 
      ? `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`
      : `in ${Math.abs(diffInDays)} day${Math.abs(diffInDays) !== 1 ? 's' : ''}`;
  } else if (Math.abs(diffInWeeks) < 4) {
    return diffInWeeks >= 0 
      ? `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`
      : `in ${Math.abs(diffInWeeks)} week${Math.abs(diffInWeeks) !== 1 ? 's' : ''}`;
  } else if (Math.abs(diffInMonths) < 12) {
    return diffInMonths >= 0 
      ? `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`
      : `in ${Math.abs(diffInMonths)} month${Math.abs(diffInMonths) !== 1 ? 's' : ''}`;
  } else {
    return diffInYears >= 0 
      ? `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`
      : `in ${Math.abs(diffInYears)} year${Math.abs(diffInYears) !== 1 ? 's' : ''}`;
  }
};

/**
 * Check if a date is today
 * @param {Date|string} date - The date to check
 * @returns {boolean} True if the date is today
 */
export const isToday = (date) => {
  if (!date) return false;
  
  const dateObj = new Date(date);
  const today = new Date();
  
  return dateObj.toDateString() === today.toDateString();
};

/**
 * Check if a date is in the past
 * @param {Date|string} date - The date to check
 * @returns {boolean} True if the date is in the past
 */
export const isPast = (date) => {
  if (!date) return false;
  
  const dateObj = new Date(date);
  const now = new Date();
  
  return dateObj < now;
};

/**
 * Check if a date is in the future
 * @param {Date|string} date - The date to check
 * @returns {boolean} True if the date is in the future
 */
export const isFuture = (date) => {
  if (!date) return false;
  
  const dateObj = new Date(date);
  const now = new Date();
  
  return dateObj > now;
};

/**
 * Get the duration between two dates
 * @param {Date|string} startDate - The start date
 * @param {Date|string} endDate - The end date
 * @returns {Object} Duration object with days, hours, minutes
 */
export const getDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return { days: 0, hours: 0, minutes: 0 };
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { days: 0, hours: 0, minutes: 0 };
  }
  
  const diffInMs = Math.abs(end - start);
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  
  return {
    days: diffInDays,
    hours: diffInHours % 24,
    minutes: diffInMinutes % 60
  };
};

/**
 * Format duration to a readable string
 * @param {Object} duration - Duration object from getDuration
 * @returns {string} Formatted duration string
 */
export const formatDuration = (duration) => {
  const { days, hours, minutes } = duration;
  const parts = [];
  
  if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
  
  if (parts.length === 0) return '0 minutes';
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return parts.join(' and ');
  
  return parts.slice(0, -1).join(', ') + ', and ' + parts[parts.length - 1];
};

export default {
  formatDate,
  formatTime,
  formatDateTime,
  formatRelativeTime,
  isToday,
  isPast,
  isFuture,
  getDuration,
  formatDuration
};