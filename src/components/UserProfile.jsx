import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Shield, Crown, Edit2, Save, X, Key, CreditCard, Eye, EyeOff } from 'lucide-react';

const UserProfile = () => {
  const { currentUser, userProfile, updateUserProfile, changePassword, resetPassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setEditedName(userProfile.fullName || '');
    }
  }, [userProfile]);

  const handleSaveProfile = async () => {
    if (!editedName.trim()) {
      setError('Name cannot be empty');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await updateUserProfile({ fullName: editedName.trim() });
      setIsEditing(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setError('Failed to update profile. Please try again.');
    }
    setLoading(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await changePassword(newPassword);
      setShowChangePassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setMessage('Password changed successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        setError('Please log out and log back in before changing your password.');
      } else {
        setError('Failed to change password. Please try again.');
      }
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!currentUser?.email) {
      setError('No email found for password reset.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await resetPassword(currentUser.email);
      setMessage('Password reset email sent! Check your inbox.');
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      setError('Failed to send reset email. Please try again.');
    }
    setLoading(false);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] bg-repeat"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">User Profile</h1>
          <p className="text-gray-300">Manage your account settings and preferences</p>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-2xl">
            <p className="text-green-300 text-sm text-center">{message}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl">
            <p className="text-red-300 text-sm text-center">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <User className="mr-3 h-6 w-6 text-cyan-400" />
                Profile Information
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-xl transition-colors"
                >
                  <Edit2 className="h-5 w-5 text-cyan-400" />
                </button>
              )}
            </div>

            <div className="space-y-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                <div className="p-3 bg-white/5 border border-white/20 rounded-xl">
                  <p className="text-white font-medium">@{userProfile.username}</p>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                {isEditing ? (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="flex-1 p-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Enter your full name"
                    />
                    <button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="p-3 bg-green-500/20 hover:bg-green-500/30 rounded-xl transition-colors disabled:opacity-50"
                    >
                      <Save className="h-5 w-5 text-green-400" />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditedName(userProfile.fullName || '');
                        setError('');
                      }}
                      className="p-3 bg-red-500/20 hover:bg-red-500/30 rounded-xl transition-colors"
                    >
                      <X className="h-5 w-5 text-red-400" />
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-white/5 border border-white/20 rounded-xl">
                    <p className="text-white">{userProfile.fullName || 'Not set'}</p>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <div className="p-3 bg-white/5 border border-white/20 rounded-xl">
                  <p className="text-white flex items-center">
                    <Mail className="mr-2 h-4 w-4 text-gray-400" />
                    {currentUser?.email}
                  </p>
                </div>
              </div>

              {/* VIP Status */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">VIP Status</label>
                <div className="p-3 bg-white/5 border border-white/20 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {userProfile.vipAccess ? (
                        <Crown className="mr-2 h-5 w-5 text-yellow-400" />
                      ) : (
                        <Shield className="mr-2 h-5 w-5 text-gray-400" />
                      )}
                      <span className="text-white">
                        {userProfile.vipAccess ? 'VIP Member' : 'Standard Member'}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      userProfile.vipAccess 
                        ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                    }`}>
                      {userProfile.vipAccess ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Security Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Shield className="mr-3 h-6 w-6 text-cyan-400" />
              Account Security
            </h2>

            <div className="space-y-4">
              {/* Change Password */}
              <button
                onClick={() => setShowChangePassword(true)}
                className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl transition-all duration-300 text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Key className="mr-3 h-5 w-5 text-cyan-400" />
                    <span className="text-white font-medium">Change Password</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </div>
              </button>

              {/* Forgot Password */}
              <button
                onClick={handleForgotPassword}
                disabled={loading}
                className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl transition-all duration-300 text-left disabled:opacity-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Mail className="mr-3 h-5 w-5 text-cyan-400" />
                    <span className="text-white font-medium">Reset Password via Email</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </div>
              </button>

              {/* Buy Premium */}
              <button
                onClick={() => setMessage('Premium features coming soon!')}
                className="w-full p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 border border-yellow-500/30 rounded-xl transition-all duration-300 text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CreditCard className="mr-3 h-5 w-5 text-yellow-400" />
                    <span className="text-white font-medium">Buy Premium</span>
                  </div>
                  <span className="text-yellow-400">→</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 shadow-2xl w-full max-w-md">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Change Password</h3>
            
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-3 pr-12 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-3 pr-12 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowChangePassword(false);
                    setNewPassword('');
                    setConfirmPassword('');
                    setError('');
                  }}
                  className="flex-1 py-3 bg-gray-600 text-white font-semibold rounded-xl hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;