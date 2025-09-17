import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  UsersIcon,
  StarIcon,
  VideoCameraIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeSolidIcon,
  UsersIcon as UsersSolidIcon,
  StarIcon as StarSolidIcon,
  VideoCameraIcon as VideoCameraSolidIcon,
  Cog6ToothIcon as CogSolidIcon,
  ChartBarIcon as ChartBarSolidIcon,
  DocumentTextIcon as DocumentSolidIcon,
  UserCircleIcon as UserCircleSolidIcon
} from '@heroicons/react/24/solid';
import { useDarkMode } from '../contexts/DarkModeContext';

const Sidebar = ({ isOpen, onClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { getThemeClasses } = useDarkMode();
  const theme = getThemeClasses();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: HomeIcon,
      iconSolid: HomeSolidIcon,
      description: 'Overview and analytics'
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: UserCircleIcon,
      iconSolid: UserCircleSolidIcon,
      description: 'User profile settings'
    },
    {
      name: 'Webinars',
      href: '/webinars',
      icon: VideoCameraIcon,
      iconSolid: VideoCameraSolidIcon,
      description: 'Webinar management'
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: ChartBarIcon,
      iconSolid: ChartBarSolidIcon,
      description: 'Reports and insights'
    },
    {
      name: 'Admin Panel',
      href: '/admin',
      icon: StarIcon,
      iconSolid: StarSolidIcon,
      description: 'Admin management'
    }
  ];

  const bottomItems = [
    {
      name: 'Settings',
      href: '/settings',
      icon: Cog6ToothIcon,
      iconSolid: CogSolidIcon,
      description: 'System settings'
    },
    {
      name: 'Help & Support',
      href: '/help',
      icon: QuestionMarkCircleIcon,
      iconSolid: QuestionMarkCircleIcon,
      description: 'Get help and support'
    }
  ];

  const isActiveRoute = (href) => {
    if (href === '/') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const NavItem = ({ item, isBottom = false }) => {
    const isActive = isActiveRoute(item.href);
    const IconComponent = isActive ? item.iconSolid : item.icon;

    return (
      <div className="relative">
        <NavLink
          to={item.href}
          onMouseEnter={() => setHoveredItem(item.name)}
          onMouseLeave={() => setHoveredItem(null)}
          onClick={() => onClose && onClose()}
          className={({ isActive: linkActive }) => {
            const active = isActiveRoute(item.href);
            return `
              group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-md
              ${active
                ? `bg-gradient-to-r from-cyan-500/10 to-blue-500/10 ${theme.text.accent} shadow-md border-l-4 border-l-cyan-500`
                : `${theme.text.secondary} hover:${theme.text.primary} ${theme.button.ghost}`
              }
              ${isCollapsed ? 'justify-center' : ''}
            `;
          }}
        >
          <IconComponent 
            className={`
              ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'} 
              transition-all duration-300 ease-in-out
              ${isActiveRoute(item.href) 
                ? 'text-cyan-500 transform scale-110' 
                : `${theme.text.muted} group-hover:text-cyan-400 group-hover:scale-110`
              }
            `} 
          />
          {!isCollapsed && (
            <span className="truncate font-medium">{item.name}</span>
          )}
          {isActiveRoute(item.href) && !isCollapsed && (
            <div className="ml-auto w-2 h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-sm animate-pulse"></div>
          )}
        </NavLink>

        {/* Tooltip for collapsed sidebar */}
        <AnimatePresence>
          {isCollapsed && hoveredItem === item.name && (
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`absolute left-full top-1/2 transform -translate-y-1/2 ml-3 px-4 py-3 ${theme.card} backdrop-blur-lg text-sm rounded-xl shadow-xl border ${theme.border} z-50 whitespace-nowrap`}
            >
              <div className={`font-semibold ${theme.text.primary}`}>{item.name}</div>
              <div className={`text-xs ${theme.text.muted} mt-1 opacity-90`}>{item.description}</div>
              <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 ${theme.card} rotate-45 border-l border-b ${theme.border}`}></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div 
        initial={false}
        animate={{ 
          x: isOpen ? 0 : -320,
          width: isCollapsed ? 64 : 256
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`
          fixed top-0 left-0 z-50 h-full ${theme.nav} backdrop-blur-xl border-r ${theme.border} shadow-xl
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${theme.border} ${isCollapsed ? 'px-2' : ''}`}>
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-cyan-500/20">
                <span className="text-white font-bold text-sm">MT</span>
              </div>
              <div>
                <h2 className={`text-lg font-bold ${theme.text.primary}`}>Mesa Trading</h2>
                <p className={`text-xs ${theme.text.muted} font-medium`}>Trading Platform</p>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="flex justify-center w-full">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg ring-2 ring-cyan-500/20">
                <span className="text-white font-bold text-xs">MT</span>
              </div>
            </div>
          )}
          
          {/* Collapse Toggle - Desktop Only */}
          <div className="hidden lg:block">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleCollapse}
              className={`p-2 rounded-xl ${theme.button.ghost} transition-all duration-200`}
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? (
                <ChevronRightIcon className="h-4 w-4" />
              ) : (
                <ChevronLeftIcon className="h-4 w-4" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-2">
          {/* Main Menu */}
          <div className="mb-6">
            {!isCollapsed && (
              <h3 className={`px-3 mb-3 text-xs font-semibold ${theme.text.muted} uppercase tracking-wider`}>
                Main Menu
              </h3>
            )}
            <nav className="space-y-1">
              {navigationItems.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </nav>
          </div>

          {/* System */}
          <div>
            {!isCollapsed && (
              <h3 className={`px-3 mb-3 text-xs font-semibold ${theme.text.muted} uppercase tracking-wider`}>
                System
              </h3>
            )}
            <nav className="space-y-1">
              {bottomItems.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </nav>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${theme.border}`}>
          {!isCollapsed && (
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className={`${theme.card} rounded-xl p-4 border ${theme.border}`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">⭐</span>
                </div>
                <div>
                  <h4 className={`text-sm font-semibold ${theme.text.primary}`}>Upgrade to Pro</h4>
                  <p className={`text-xs ${theme.text.muted}`}>Unlock premium features</p>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Upgrade Now
              </motion.button>
            </motion.div>
          )}
          {isCollapsed && (
            <div className="flex justify-center">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center cursor-pointer"
              >
                <span className="text-white text-xs font-bold">⭐</span>
              </motion.div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;