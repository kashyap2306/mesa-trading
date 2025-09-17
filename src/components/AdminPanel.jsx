import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useNavigate } from 'react-router-dom';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  addDoc, 
  deleteDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { 
  getAllPremiumRequests, 
  updatePremiumRequestStatus 
} from '../services/premiumRequestService';
import { 
  TrendingUp, 
  ArrowLeft, 
  Users, 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Crown, 
  Shield,
  Save,
  X,
  BarChart3,
  DollarSign,
  Activity,
  Settings,
  Home,
  LogOut,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Download,
  Bell,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminPanel = () => {
  const { currentUser, logout } = useAuth();
  const { getThemeClasses } = useDarkMode();
  const navigate = useNavigate();
  const themeClasses = getThemeClasses();

  // State management
  const [users, setUsers] = useState([]);
  const [webinars, setWebinars] = useState([]);
  const [premiumRequests, setPremiumRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showWebinarForm, setShowWebinarForm] = useState(false);
  const [editingWebinar, setEditingWebinar] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Webinar form state
  const [webinarForm, setWebinarForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    link: ''
  });

  // Sidebar navigation items
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'premium-requests', label: 'Premium Requests', icon: Crown },
    { id: 'webinars', label: 'Webinars', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Statistics data
  const stats = [
    {
      title: 'Total Users',
      value: users.length.toString(),
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'VIP Members',
      value: users.filter(user => user.vipAccess).length.toString(),
      icon: Crown,
      color: 'from-yellow-500 to-orange-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Pending Requests',
      value: premiumRequests.filter(req => req.status === 'pending').length.toString(),
      icon: Clock,
      color: 'from-purple-500 to-pink-500',
      change: '+3%',
      changeType: 'positive'
    },
    {
      title: 'Active Webinars',
      value: webinars.length.toString(),
      icon: Calendar,
      color: 'from-green-500 to-emerald-500',
      change: '+5%',
      changeType: 'positive'
    }
  ];

  // Check admin access and fetch data
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!currentUser) {
        navigate('/');
        return;
      }

      try {
        const userDoc = await getDocs(collection(db, 'users'));
        const userData = userDoc.docs.find(doc => doc.data().email === currentUser.email);
        
        if (!userData?.data()?.isAdmin) {
          navigate('/');
          return;
        }

        await Promise.all([
          fetchUsers(),
          fetchWebinars(),
          fetchPremiumRequests()
        ]);
      } catch (error) {
        console.error('Error checking admin access:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [currentUser, navigate]);

  // Fetch functions
  const fetchUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchWebinars = async () => {
    try {
      const webinarsSnapshot = await getDocs(collection(db, 'webinars'));
      const webinarsData = webinarsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setWebinars(webinarsData.sort((a, b) => new Date(a.date) - new Date(b.date)));
    } catch (error) {
      console.error('Error fetching webinars:', error);
    }
  };

  const fetchPremiumRequests = async () => {
    try {
      const requests = await getAllPremiumRequests();
      setPremiumRequests(requests);
    } catch (error) {
      console.error('Error fetching premium requests:', error);
    }
  };

  // Action handlers
  const handlePremiumRequestAction = async (requestId, status, userId = null) => {
    try {
      await updatePremiumRequestStatus(requestId, status);
      
      if (status === 'approved' && userId) {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          vipAccess: true,
          premiumStatus: 'active',
          premiumApprovedAt: Timestamp.now()
        });
        await fetchUsers();
      }
      
      await fetchPremiumRequests();
    } catch (error) {
      console.error('Error updating premium request:', error);
    }
  };

  const toggleVipAccess = async (userId, currentVipStatus) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        vipAccess: !currentVipStatus,
        premiumStatus: !currentVipStatus ? 'active' : 'inactive'
      });
      await fetchUsers();
    } catch (error) {
      console.error('Error toggling VIP access:', error);
    }
  };

  const handleWebinarSubmit = async (e) => {
    e.preventDefault();
    try {
      const webinarData = {
        ...webinarForm,
        date: new Date(`${webinarForm.date}T${webinarForm.time}`),
        createdAt: Timestamp.now()
      };

      if (editingWebinar) {
        const webinarRef = doc(db, 'webinars', editingWebinar.id);
        await updateDoc(webinarRef, webinarData);
      } else {
        await addDoc(collection(db, 'webinars'), webinarData);
      }

      setShowWebinarForm(false);
      setEditingWebinar(null);
      setWebinarForm({ title: '', description: '', date: '', time: '', link: '' });
      await fetchWebinars();
    } catch (error) {
      console.error('Error saving webinar:', error);
    }
  };

  const editWebinar = (webinar) => {
    setEditingWebinar(webinar);
    const date = new Date(webinar.date.seconds * 1000);
    setWebinarForm({
      title: webinar.title,
      description: webinar.description,
      date: date.toISOString().split('T')[0],
      time: date.toTimeString().slice(0, 5),
      link: webinar.link || ''
    });
    setShowWebinarForm(true);
  };

  const deleteWebinar = async (webinarId) => {
    if (window.confirm('Are you sure you want to delete this webinar?')) {
      try {
        await deleteDoc(doc(db, 'webinars', webinarId));
        await fetchWebinars();
      } catch (error) {
        console.error('Error deleting webinar:', error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'No date';
    const dateObj = date.seconds ? new Date(date.seconds * 1000) : new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter functions
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRequests = premiumRequests.filter(request => {
    const matchesSearch = request.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || request.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className={`min-h-screen ${themeClasses.background} flex items-center justify-center`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses.background} relative overflow-hidden`}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="flex h-screen relative z-10">
        {/* Sidebar */}
        <motion.div 
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className={`w-80 ${themeClasses.cardBackground} ${themeClasses.border} border-r backdrop-blur-xl flex flex-col`}
        >
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${themeClasses.text}`}>Mesa Admin</h1>
                <p className={`text-sm ${themeClasses.textSecondary}`}>Trading Platform</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30'
                        : `${themeClasses.textSecondary} hover:bg-white/5 hover:${themeClasses.text}`
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                    {item.id === 'premium-requests' && premiumRequests.filter(req => req.status === 'pending').length > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {premiumRequests.filter(req => req.status === 'pending').length}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </nav>

          {/* User Info & Actions */}
          <div className="p-4 border-t border-white/10">
            <div className={`${themeClasses.cardBackground} rounded-2xl p-4 mb-4`}>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${themeClasses.text} truncate`}>{currentUser?.email}</p>
                  <p className={`text-xs ${themeClasses.textSecondary}`}>Administrator</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/')}
                className={`w-full flex items-center space-x-3 px-4 py-2 ${themeClasses.textSecondary} hover:bg-white/5 hover:${themeClasses.text} rounded-xl transition-colors`}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Back to Home</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Logout</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 relative z-10 overflow-auto">
          {/* Header */}
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`${themeClasses.cardBackground} backdrop-blur-md border-b ${themeClasses.border} p-6`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className={`text-3xl font-bold ${themeClasses.text} mb-1`}>
                  {activeTab === 'dashboard' && 'Dashboard Overview'}
                  {activeTab === 'users' && 'User Management'}
                  {activeTab === 'premium-requests' && 'Premium Requests'}
                  {activeTab === 'webinars' && 'Webinar Management'}
                  {activeTab === 'settings' && 'Settings'}
                </h1>
                <p className={themeClasses.textSecondary}>
                  {activeTab === 'dashboard' && 'Monitor your platform statistics and activity'}
                  {activeTab === 'users' && 'Manage user accounts and VIP access'}
                  {activeTab === 'premium-requests' && 'Review and manage premium access requests'}
                  {activeTab === 'webinars' && 'Create and manage webinar sessions'}
                  {activeTab === 'settings' && 'Configure platform settings'}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className={`text-sm ${themeClasses.textSecondary}`}>Last updated</p>
                  <p className={`${themeClasses.text} font-medium`}>{new Date().toLocaleTimeString()}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300"
                >
                  <Bell className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* Dashboard Tab */}
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Statistics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => {
                      const Icon = stat.icon;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          className={`${themeClasses.cardBackground} ${themeClasses.border} rounded-3xl p-6 hover:bg-white/15 transition-all duration-300`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center`}>
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                              stat.changeType === 'positive' ? 'text-green-400 bg-green-500/20' :
                              stat.changeType === 'negative' ? 'text-red-400 bg-red-500/20' :
                              'text-gray-400 bg-gray-500/20'
                            }`}>
                              {stat.change}
                            </span>
                          </div>
                          <div>
                            <h3 className={`text-2xl font-bold ${themeClasses.text} mb-1`}>{stat.value}</h3>
                            <p className={`${themeClasses.textSecondary} text-sm`}>{stat.title}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Recent Activity */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Users */}
                    <motion.div
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: 0.1 }}
                       className={`${themeClasses.cardBackground} rounded-2xl ${themeClasses.border} p-6`}
                     >
                       <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4 flex items-center`}>
                         <Shield className="h-5 w-5 mr-2 text-green-400" />
                         Security Settings
                       </h3>
                       <div className="space-y-4">
                         <div className="flex items-center justify-between">
                           <div>
                             <p className={`${themeClasses.text} font-medium`}>Two-Factor Authentication</p>
                             <p className={`${themeClasses.textSecondary} text-sm`}>Require 2FA for admin accounts</p>
                           </div>
                           <motion.button
                             whileHover={{ scale: 1.02 }}
                             whileTap={{ scale: 0.98 }}
                             className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                           >
                             Enabled
                           </motion.button>
                         </div>
                         <div className="flex items-center justify-between">
                           <div>
                             <p className={`${themeClasses.text} font-medium`}>Session Timeout</p>
                             <p className={`${themeClasses.textSecondary} text-sm`}>Auto logout after inactivity</p>
                           </div>
                           <select className={`px-4 py-2 ${themeClasses.cardBackground} ${themeClasses.text} rounded-xl ${themeClasses.border} focus:outline-none focus:ring-2 focus:ring-cyan-500`}>
                             <option value="30">30 minutes</option>
                             <option value="60">1 hour</option>
                             <option value="120">2 hours</option>
                           </select>
                         </div>
                       </div>
                     </motion.div>

                   <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2 }}
  className={`${themeClasses.cardBackground} rounded-2xl ${themeClasses.border} p-6`}
>
  <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4 flex items-center`}>
    <Bell className="h-5 w-5 mr-2 text-cyan-400" />
    Notification Settings
  </h3>

  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div>
        <p className={`${themeClasses.text} font-medium`}>Email Notifications</p>
        <p className={`${themeClasses.textSecondary} text-sm`}>
          Receive email alerts for important events
        </p>
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
      >
        Enabled
      </motion.button>
    </div>

    <div className="flex items-center justify-between">
      <div>
        <p className={`${themeClasses.text} font-medium`}>Push Notifications</p>
        <p className={`${themeClasses.textSecondary} text-sm`}>
          Browser push notifications
        </p>
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
      >
        Disabled
      </motion.button>
    </div>
  </div>
</motion.div>

                    {/* Recent Users */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`${themeClasses.cardBackground} ${themeClasses.border} rounded-3xl p-6`}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className={`text-xl font-bold ${themeClasses.text} flex items-center`}>
                          <Users className="h-5 w-5 mr-2 text-blue-400" />
                          Recent Users
                        </h3>
                        <button
                          onClick={() => setActiveTab('users')}
                          className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                        >
                          View All
                        </button>
                      </div>
                      <div className="space-y-3">
                        {users.slice(0, 5).map((user) => (
                          <div key={user.id} className={`flex items-center justify-between p-3 ${themeClasses.cardBackground} rounded-xl`}>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                                <Users className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <p className={`${themeClasses.text} text-sm font-medium truncate max-w-32`}>{user.email}</p>
                                <p className={`${themeClasses.textSecondary} text-xs`}>{user.vipAccess ? 'VIP Member' : 'Regular User'}</p>
                              </div>
                            </div>
                            {user.vipAccess && <Crown className="h-4 w-4 text-yellow-400" />}
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Recent Webinars */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`${themeClasses.cardBackground} ${themeClasses.border} rounded-3xl p-6`}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className={`text-xl font-bold ${themeClasses.text} flex items-center`}>
                          <Calendar className="h-5 w-5 mr-2 text-green-400" />
                          Upcoming Webinars
                        </h3>
                        <button
                          onClick={() => setActiveTab('webinars')}
                          className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                        >
                          View All
                        </button>
                      </div>
                      <div className="space-y-3">
                        {webinars.slice(0, 3).map((webinar) => (
                          <div key={webinar.id} className={`p-3 ${themeClasses.cardBackground} rounded-xl`}>
                            <h4 className={`${themeClasses.text} text-sm font-medium mb-1 truncate`}>{webinar.title}</h4>
                            <p className={`${themeClasses.textSecondary} text-xs mb-2 line-clamp-2`}>{webinar.description}</p>
                            <p className="text-cyan-400 text-xs">{formatDate(webinar.date)}</p>
                          </div>
                        ))}
                        {webinars.length === 0 && (
                          <div className="text-center py-8">
                            <Calendar className={`h-12 w-12 ${themeClasses.textSecondary} mx-auto mb-2`} />
                            <p className={`${themeClasses.textSecondary} text-sm`}>No webinars scheduled</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>

                  {/* Quick Actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${themeClasses.cardBackground} ${themeClasses.border} rounded-3xl p-6`}
                  >
                    <h3 className={`text-xl font-bold ${themeClasses.text} mb-6 flex items-center`}>
                      <Activity className="h-5 w-5 mr-2 text-purple-400" />
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab('users')}
                        className="p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl text-left hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-300 group"
                      >
                        <Users className="h-8 w-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                        <h4 className={`${themeClasses.text} font-semibold mb-1`}>Manage Users</h4>
                        <p className={`${themeClasses.textSecondary} text-sm`}>View and manage user accounts</p>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setActiveTab('webinars');
                          setShowWebinarForm(true);
                          setEditingWebinar(null);
                          setWebinarForm({ title: '', description: '', date: '', time: '', link: '' });
                        }}
                        className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl text-left hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-300 group"
                      >
                        <Plus className="h-8 w-8 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
                        <h4 className={`${themeClasses.text} font-semibold mb-1`}>Add Webinar</h4>
                        <p className={`${themeClasses.textSecondary} text-sm`}>Create a new webinar session</p>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab('premium-requests')}
                        className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl text-left hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 group"
                      >
                        <Crown className="h-8 w-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
                        <h4 className={`${themeClasses.text} font-semibold mb-1`}>Premium Requests</h4>
                        <p className={`${themeClasses.textSecondary} text-sm`}>Review premium access requests</p>
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <motion.div
                  key="users"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`${themeClasses.cardBackground} ${themeClasses.border} rounded-3xl p-8`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-2xl font-bold ${themeClasses.text}`}>User Management</h2>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${themeClasses.textSecondary}`} />
                        <input
                          type="text"
                          placeholder="Search users..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className={`pl-10 pr-4 py-2 ${themeClasses.cardBackground} ${themeClasses.border} rounded-xl ${themeClasses.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                        />
                      </div>
                      <div className="text-right">
                        <p className={`text-sm ${themeClasses.textSecondary}`}>Total Users</p>
                        <p className={`text-xl font-bold ${themeClasses.text}`}>{users.length}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm ${themeClasses.textSecondary}`}>VIP Members</p>
                        <p className="text-xl font-bold text-yellow-400">{users.filter(user => user.vipAccess).length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {filteredUsers.map((user, index) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`${themeClasses.cardBackground} rounded-2xl ${themeClasses.border} p-6 hover:bg-white/10 transition-all duration-300`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                              <Users className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className={`text-lg font-semibold ${themeClasses.text}`}>{user.email}</h3>
                              <div className="flex items-center space-x-3 mt-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  user.vipAccess 
                                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                }`}>
                                  {user.vipAccess ? 'VIP Member' : 'Regular User'}
                                </span>
                                {user.isAdmin && (
                                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                                    <Shield className="h-3 w-3 inline mr-1" />
                                    Admin
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleVipAccess(user.id, user.vipAccess)}
                            className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center transform ${
                              user.vipAccess
                                ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/25'
                                : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg shadow-yellow-500/25'
                            }`}
                          >
                            <Crown className="h-4 w-4 mr-2" />
                            {user.vipAccess ? 'Remove VIP' : 'Grant VIP'}
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                    {filteredUsers.length === 0 && (
                      <div className="text-center py-12">
                        <Users className={`h-16 w-16 ${themeClasses.textSecondary} mx-auto mb-4`} />
                        <p className={`${themeClasses.text} text-lg`}>No users found</p>
                        <p className={themeClasses.textSecondary}>Users will appear here once they register</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Premium Requests Tab */}
              {activeTab === 'premium-requests' && (
                <motion.div
                  key="premium-requests"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`${themeClasses.cardBackground} ${themeClasses.border} rounded-3xl p-8`}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className={`text-2xl font-bold ${themeClasses.text} flex items-center`}>
                      <Crown className="h-8 w-8 mr-3 text-yellow-400" />
                      Premium Requests
                    </h2>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${themeClasses.textSecondary}`} />
                        <input
                          type="text"
                          placeholder="Search requests..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className={`pl-10 pr-4 py-2 ${themeClasses.cardBackground} ${themeClasses.border} rounded-xl ${themeClasses.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                        />
                      </div>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className={`px-4 py-2 ${themeClasses.cardBackground} ${themeClasses.border} rounded-xl ${themeClasses.text} focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <div className={`text-sm ${themeClasses.textSecondary}`}>
                        {premiumRequests.filter(req => req.status === 'pending').length} pending requests
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {filteredRequests.map((request, index) => (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`${themeClasses.cardBackground} rounded-2xl ${themeClasses.border} p-6 hover:bg-white/10 transition-all duration-300`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className={`w-3 h-3 rounded-full ${
                                request.status === 'pending' ? 'bg-yellow-400' :
                                request.status === 'approved' ? 'bg-green-400' : 'bg-red-400'
                              }`}></div>
                              <h3 className={`text-lg font-semibold ${themeClasses.text}`}>{request.name}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                request.status === 'pending' ? 'bg-yellow-400/20 text-yellow-400' :
                                request.status === 'approved' ? 'bg-green-400/20 text-green-400' :
                                'bg-red-400/20 text-red-400'
                              }`}>
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className={`${themeClasses.textSecondary} text-sm`}>Email</p>
                                <p className={themeClasses.text}>{request.email}</p>
                              </div>
                              <div>
                                <p className={`${themeClasses.textSecondary} text-sm`}>Phone</p>
                                <p className={themeClasses.text}>{request.phone}</p>
                              </div>
                              <div>
                                <p className={`${themeClasses.textSecondary} text-sm`}>Experience</p>
                                <p className={themeClasses.text}>{request.experience}</p>
                              </div>
                              <div>
                                <p className={`${themeClasses.textSecondary} text-sm`}>Submitted</p>
                                <p className={themeClasses.text}>
                                  {request.createdAt ? new Date(request.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                                </p>
                              </div>
                            </div>
                            
                            {request.reason && (
                              <div className="mb-4">
                                <p className={`${themeClasses.textSecondary} text-sm mb-1`}>Reason for Premium Access</p>
                                <p className={`${themeClasses.textSecondary} ${themeClasses.cardBackground} rounded-xl p-3`}>{request.reason}</p>
                              </div>
                            )}
                          </div>
                          
                          {request.status === 'pending' && (
                            <div className="flex space-x-2 ml-4">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handlePremiumRequestAction(request.id, 'approved', request.userId)}
                                className="p-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 transform flex items-center"
                                title="Approve Request"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handlePremiumRequestAction(request.id, 'rejected')}
                                className="p-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 transform flex items-center"
                                title="Reject Request"
                              >
                                <XCircle className="h-4 w-4" />
                              </motion.button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                    
                    {filteredRequests.length === 0 && (
                      <div className="text-center py-12">
                        <Crown className={`h-16 w-16 ${themeClasses.textSecondary} mx-auto mb-4`} />
                        <p className={`${themeClasses.text} text-lg`}>No premium requests found</p>
                        <p className={themeClasses.textSecondary}>Premium access requests will appear here</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Webinars Tab */}
              {activeTab === 'webinars' && (
                <motion.div
                  key="webinars"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`${themeClasses.cardBackground} ${themeClasses.border} rounded-3xl p-8`}
                >
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className={`text-2xl font-bold ${themeClasses.text}`}>Webinar Management</h2>
                      <p className={`${themeClasses.textSecondary} mt-1`}>Create and manage webinar sessions</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setShowWebinarForm(true);
                        setEditingWebinar(null);
                        setWebinarForm({ title: '', description: '', date: '', time: '', link: '' });
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center transform shadow-lg shadow-green-500/25"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add Webinar
                    </motion.button>
                  </div>

                  {/* Webinar Form */}
                  <AnimatePresence>
                    {showWebinarForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`${themeClasses.cardBackground} rounded-2xl ${themeClasses.border} p-6 mb-6`}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className={`text-xl font-semibold ${themeClasses.text}`}>
                            {editingWebinar ? 'Edit Webinar' : 'Add New Webinar'}
                          </h3>
                          <button
                            onClick={() => {
                              setShowWebinarForm(false);
                              setEditingWebinar(null);
                            }}
                            className={`${themeClasses.textSecondary} hover:${themeClasses.text} transition-colors`}
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                        <form onSubmit={handleWebinarSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>Title</label>
                              <input
                                type="text"
                                required
                                value={webinarForm.title}
                                onChange={(e) => setWebinarForm({...webinarForm, title: e.target.value})}
                                className={`w-full px-4 py-3 ${themeClasses.cardBackground} ${themeClasses.border} rounded-2xl ${themeClasses.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                                placeholder="Webinar title"
                              />
                            </div>
                            <div>
                              <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>Link</label>
                              <input
                                type="url"
                                value={webinarForm.link}
                                onChange={(e) => setWebinarForm({...webinarForm, link: e.target.value})}
                                className={`w-full px-4 py-3 ${themeClasses.cardBackground} ${themeClasses.border} rounded-2xl ${themeClasses.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                                placeholder="https://zoom.us/..."
                              />
                            </div>
                          </div>
                          <div>
                            <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>Description</label>
                            <textarea
                              required
                              value={webinarForm.description}
                              onChange={(e) => setWebinarForm({...webinarForm, description: e.target.value})}
                              className={`w-full px-4 py-3 ${themeClasses.cardBackground} ${themeClasses.border} rounded-2xl ${themeClasses.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 h-24 resize-none`}
                              placeholder="Webinar description"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>Date</label>
                              <input
                                type="date"
                                required
                                value={webinarForm.date}
                                onChange={(e) => setWebinarForm({...webinarForm, date: e.target.value})}
                                className={`w-full px-4 py-3 ${themeClasses.cardBackground} ${themeClasses.border} rounded-2xl ${themeClasses.text} focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                              />
                            </div>
                            <div>
                              <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>Time</label>
                              <input
                                type="time"
                                required
                                value={webinarForm.time}
                                onChange={(e) => setWebinarForm({...webinarForm, time: e.target.value})}
                                className={`w-full px-4 py-3 ${themeClasses.cardBackground} ${themeClasses.border} rounded-2xl ${themeClasses.text} focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                              />
                            </div>
                          </div>
                          <div className="flex space-x-4">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              type="submit"
                              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              {editingWebinar ? 'Update' : 'Create'} Webinar
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              type="button"
                              onClick={() => {
                                setShowWebinarForm(false);
                                setEditingWebinar(null);
                              }}
                              className="px-6 py-3 bg-gray-600 text-white rounded-2xl hover:bg-gray-700 transition-colors"
                            >
                              Cancel
                            </motion.button>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Webinars List */}
                  <div className="space-y-4">
                    {webinars.map((webinar, index) => (
                      <motion.div
                        key={webinar.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`${themeClasses.cardBackground} rounded-2xl ${themeClasses.border} p-6 hover:bg-white/10 transition-all duration-300`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                              <Calendar className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className={`text-xl font-semibold ${themeClasses.text} mb-2`}>{webinar.title}</h3>
                              <p className={`${themeClasses.textSecondary} mb-3 leading-relaxed`}>{webinar.description}</p>
                              <div className="flex items-center space-x-4 text-sm">
                                <span className="text-cyan-400 font-medium">{formatDate(webinar.date)}</span>
                                {webinar.link && (
                                  <a
                                    href={webinar.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-400 hover:text-green-300 transition-colors flex items-center"
                                  >
                                    <span className="mr-1">Join Link</span>
                                    <ArrowLeft className="h-3 w-3 rotate-180" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => editWebinar(webinar)}
                              className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 transform"
                            >
                              <Edit className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => deleteWebinar(webinar.id)}
                              className="p-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 transform"
                            >
                              <Trash2 className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {webinars.length === 0 && (
                      <div className="text-center py-12">
                        <Calendar className={`h-16 w-16 ${themeClasses.textSecondary} mx-auto mb-4`} />
                        <p className={`${themeClasses.text} text-lg`}>No webinars scheduled</p>
                        <p className={themeClasses.textSecondary}>Create your first webinar to get started</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`${themeClasses.cardBackground} ${themeClasses.border} rounded-3xl p-8`}
                >
                  <h2 className={`text-2xl font-bold ${themeClasses.text} mb-6`}>Platform Settings</h2>
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`${themeClasses.cardBackground} rounded-2xl ${themeClasses.border} p-6`}
                    >
                      <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4 flex items-center`}>
                        <Settings className="h-5 w-5 mr-2 text-purple-400" />
                        General Settings
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`${themeClasses.text} font-medium`}>Platform Name</p>
                            <p className={`${themeClasses.textSecondary} text-sm`}>Mesa Trading Platform</p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`px-4 py-2 ${themeClasses.cardBackground} ${themeClasses.text} rounded-xl hover:bg-white/20 transition-colors`}
                          >
                            Edit
                          </motion.button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`${themeClasses.text} font-medium`}>Auto VIP Approval</p>
                            <p className={`${themeClasses.textSecondary} text-sm`}>Automatically approve VIP requests</p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                          >
                            Disabled
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;