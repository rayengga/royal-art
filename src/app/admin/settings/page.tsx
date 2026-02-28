'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Mail, 
  Bell, 
  Database, 
  Globe, 
  Palette,
  Save,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Trash2,
  Plus
} from 'lucide-react';

interface AdminSettings {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  notifications: {
    emailOrders: boolean;
    emailUsers: boolean;
    emailProducts: boolean;
    emailLowStock: boolean;
  };
  system: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    allowRegistration: boolean;
    requireEmailVerification: boolean;
    maintenanceMode: boolean;
  };
  appearance: {
    theme: 'dark' | 'light';
    primaryColor: string;
    accentColor: string;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<AdminSettings>({
    profile: {
      firstName: '',
      lastName: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    notifications: {
      emailOrders: true,
      emailUsers: true,
      emailProducts: false,
      emailLowStock: true
    },
    system: {
      siteName: 'Decory',
      siteDescription: 'Premium Laser Engraved Products',
      contactEmail: 'contact@decory.com',
      allowRegistration: true,
      requireEmailVerification: false,
      maintenanceMode: false
    },
    appearance: {
      theme: 'dark',
      primaryColor: '#D4AF37',
      accentColor: '#DC2626'
    }
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'system' | 'appearance'>('profile');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    // Load saved theme from localStorage on component mount
    const loadSavedTheme = () => {
      try {
        const savedTheme = localStorage.getItem('decory-theme');
        if (savedTheme) {
          const appearance = JSON.parse(savedTheme);
          applyAppearanceSettings(appearance);
          
          // Update settings state with saved theme
          setSettings(prev => ({
            ...prev,
            appearance: appearance
          }));
        }
      } catch (error) {
        console.error('Error loading saved theme:', error);
      }
    };

    loadSavedTheme();

    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/settings');
        
        if (response.ok) {
          const data = await response.json();
          setSettings(prev => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (section: keyof AdminSettings) => {
    try {
      setSaving(true);
      setMessage(null);

      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section,
          data: settings[section]
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
        
        // Clear password fields after successful save
        if (section === 'profile') {
          setSettings(prev => ({
            ...prev,
            profile: {
              ...prev.profile,
              currentPassword: '',
              newPassword: '',
              confirmPassword: ''
            }
          }));
        }
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Failed to save settings' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while saving settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (section: keyof AdminSettings, field: string, value: any) => {
    setSettings(prev => {
      const newSettings = {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      };

      // Apply appearance changes in real-time
      if (section === 'appearance') {
        applyAppearanceSettings(newSettings.appearance);
      }

      return newSettings;
    });
  };

  // Function to apply appearance settings to the document
  const applyAppearanceSettings = (appearance: AdminSettings['appearance']) => {
    const root = document.documentElement;
    
    // Apply theme
    if (appearance.theme === 'light') {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    } else {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    }

    // Apply custom colors
    root.style.setProperty('--primary-color', appearance.primaryColor);
    root.style.setProperty('--accent-color', appearance.accentColor);

    // Store in localStorage for persistence
    localStorage.setItem('decory-theme', JSON.stringify(appearance));
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System', icon: Database },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-gold mx-auto mb-4"></div>
          <h2 className="text-xl text-white mb-2">Loading Settings...</h2>
          <p className="text-gray-400">Fetching configuration data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">Manage your admin account and system configuration</p>
        </div>
      </motion.div>

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg flex items-center space-x-2 ${
            message.type === 'success' 
              ? 'bg-green-500/20 border border-green-500/50 text-green-400'
              : 'bg-red-500/20 border border-red-500/50 text-red-400'
          }`}
        >
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{message.text}</span>
        </motion.div>
      )}

      {/* Mobile Tabs - horizontal scroll */}
      <div className="lg:hidden">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-md rounded-lg p-2 border border-gray-700/50">
          <nav className="flex space-x-2 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all whitespace-nowrap text-sm flex-shrink-0 ${
                  activeTab === tab.id ? 'bg-soft-gold text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}>
                <tab.icon size={16} /><span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Desktop Tabs Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block bg-gray-800/50 backdrop-blur-md rounded-lg p-4 border border-gray-700/50 h-fit"
        >
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-soft-gold text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <tab.icon size={20} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </motion.div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 border border-gray-700/50"
            >
              <div className="flex items-center space-x-3 mb-6">
                <User className="text-soft-gold" size={24} />
                <h2 className="text-xl font-semibold text-white">Profile Settings</h2>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={settings.profile.firstName}
                      onChange={(e) => handleInputChange('profile', 'firstName', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-soft-gold transition-colors"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={settings.profile.lastName}
                      onChange={(e) => handleInputChange('profile', 'lastName', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-soft-gold transition-colors"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-soft-gold transition-colors"
                    placeholder="Enter your email address"
                  />
                </div>

                <hr className="border-gray-700" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Change Password</h3>
                  
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={settings.profile.currentPassword}
                        onChange={(e) => handleInputChange('profile', 'currentPassword', e.target.value)}
                        className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-soft-gold transition-colors pr-10"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? 'text' : 'password'}
                          value={settings.profile.newPassword}
                          onChange={(e) => handleInputChange('profile', 'newPassword', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-soft-gold transition-colors pr-10"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          value={settings.profile.confirmPassword}
                          onChange={(e) => handleInputChange('profile', 'confirmPassword', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-soft-gold transition-colors pr-10"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleSave('profile')}
                    disabled={saving}
                    className="bg-gradient-to-r from-soft-gold to-laser-red text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2 hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    <Save size={16} />
                    <span>{saving ? 'Saving...' : 'Save Profile'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 border border-gray-700/50"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Bell className="text-soft-gold" size={24} />
                <h2 className="text-xl font-semibold text-white">Notification Settings</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  {[
                    { key: 'emailOrders', label: 'New Orders', description: 'Get notified when new orders are placed' },
                    { key: 'emailUsers', label: 'New Users', description: 'Get notified when new users register' },
                    { key: 'emailProducts', label: 'Product Updates', description: 'Get notified about product changes' },
                    { key: 'emailLowStock', label: 'Low Stock', description: 'Get notified when products are running low' },
                  ].map((notification) => (
                    <div key={notification.key} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                      <div>
                        <h4 className="text-white font-medium">{notification.label}</h4>
                        <p className="text-gray-400 text-sm">{notification.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications[notification.key as keyof typeof settings.notifications]}
                          onChange={(e) => handleInputChange('notifications', notification.key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-soft-gold"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleSave('notifications')}
                    disabled={saving}
                    className="bg-gradient-to-r from-soft-gold to-laser-red text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2 hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    <Save size={16} />
                    <span>{saving ? 'Saving...' : 'Save Notifications'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* System Settings */}
          {activeTab === 'system' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 border border-gray-700/50"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Database className="text-soft-gold" size={24} />
                <h2 className="text-xl font-semibold text-white">System Settings</h2>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={settings.system.siteName}
                      onChange={(e) => handleInputChange('system', 'siteName', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-soft-gold transition-colors"
                      placeholder="Enter site name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={settings.system.contactEmail}
                      onChange={(e) => handleInputChange('system', 'contactEmail', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-soft-gold transition-colors"
                      placeholder="Enter contact email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Site Description
                  </label>
                  <textarea
                    value={settings.system.siteDescription}
                    onChange={(e) => handleInputChange('system', 'siteDescription', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-soft-gold transition-colors"
                    placeholder="Enter site description"
                  />
                </div>

                <div className="space-y-4">
                  {[
                    { key: 'allowRegistration', label: 'Allow User Registration', description: 'Allow new users to register on the website' },
                    { key: 'requireEmailVerification', label: 'Require Email Verification', description: 'Require users to verify their email address' },
                    { key: 'maintenanceMode', label: 'Maintenance Mode', description: 'Put the site in maintenance mode' },
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                      <div>
                        <h4 className="text-white font-medium">{setting.label}</h4>
                        <p className="text-gray-400 text-sm">{setting.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.system[setting.key as keyof typeof settings.system] as boolean}
                          onChange={(e) => handleInputChange('system', setting.key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-soft-gold"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleSave('system')}
                    disabled={saving}
                    className="bg-gradient-to-r from-soft-gold to-laser-red text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2 hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    <Save size={16} />
                    <span>{saving ? 'Saving...' : 'Save System Settings'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 border border-gray-700/50"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Palette className="text-soft-gold" size={24} />
                <h2 className="text-xl font-semibold text-white">Appearance Settings</h2>
              </div>

              <div className="space-y-6">
                {/* Live Preview Section */}
                <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-medium">Live Preview</h3>
                    <button
                      onClick={() => {
                        handleInputChange('appearance', 'primaryColor', '#D4AF37');
                        handleInputChange('appearance', 'accentColor', '#DC2626');
                        handleInputChange('appearance', 'theme', 'dark');
                      }}
                      className="px-3 py-1 text-xs bg-gray-600 text-gray-300 rounded hover:bg-gray-500 transition-colors"
                    >
                      Reset to Default
                    </button>
                  </div>
                  <div 
                    className="p-4 rounded-lg border-2 transition-all"
                    style={{
                      backgroundColor: settings.appearance.theme === 'dark' ? '#1f2937' : '#f9fafb',
                      borderColor: settings.appearance.primaryColor,
                      color: settings.appearance.theme === 'dark' ? '#ffffff' : '#1f2937'
                    }}
                  >
                    <div className="space-y-3">
                      <div 
                        className="h-10 rounded-lg flex items-center justify-center text-white font-medium shadow-md"
                        style={{ backgroundColor: settings.appearance.primaryColor }}
                      >
                        Primary Button
                      </div>
                      <div 
                        className="h-10 rounded-lg flex items-center justify-center text-white font-medium shadow-md"
                        style={{ backgroundColor: settings.appearance.accentColor }}
                      >
                        Accent Button
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div 
                          className="h-8 rounded flex items-center justify-center text-xs text-white"
                          style={{ backgroundColor: settings.appearance.primaryColor + '80' }}
                        >
                          Primary Variant
                        </div>
                        <div 
                          className="h-8 rounded flex items-center justify-center text-xs text-white"
                          style={{ backgroundColor: settings.appearance.accentColor + '80' }}
                        >
                          Accent Variant
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-3">
                    Theme
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { 
                        value: 'dark', 
                        label: 'Dark Theme', 
                        preview: 'bg-gray-800',
                        description: 'Perfect for low-light environments'
                      },
                      { 
                        value: 'light', 
                        label: 'Light Theme', 
                        preview: 'bg-gray-200',
                        description: 'Clean and bright interface'
                      },
                    ].map((theme) => (
                      <label
                        key={theme.value}
                        className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                          settings.appearance.theme === theme.value
                            ? 'border-soft-gold bg-soft-gold/10'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <input
                          type="radio"
                          name="theme"
                          value={theme.value}
                          checked={settings.appearance.theme === theme.value}
                          onChange={(e) => handleInputChange('appearance', 'theme', e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex items-center space-x-3 mb-2">
                          <div className={`w-6 h-6 rounded border-2 border-gray-500 ${theme.preview}`}></div>
                          <span className="text-white font-medium">{theme.label}</span>
                        </div>
                        <p className="text-gray-400 text-sm ml-9">{theme.description}</p>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-3">
                      Primary Color
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={settings.appearance.primaryColor}
                          onChange={(e) => handleInputChange('appearance', 'primaryColor', e.target.value)}
                          className="w-12 h-10 border border-gray-600 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.appearance.primaryColor}
                          onChange={(e) => handleInputChange('appearance', 'primaryColor', e.target.value)}
                          className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-soft-gold transition-colors"
                          placeholder="#D4AF37"
                        />
                      </div>
                      {/* Predefined Primary Colors */}
                      <div className="flex space-x-2">
                        {['#D4AF37', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'].map((color) => (
                          <button
                            key={color}
                            onClick={() => handleInputChange('appearance', 'primaryColor', color)}
                            className={`w-8 h-8 rounded border-2 transition-all ${
                              settings.appearance.primaryColor === color
                                ? 'border-white scale-110'
                                : 'border-gray-500 hover:border-gray-300'
                            }`}
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-3">
                      Accent Color
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={settings.appearance.accentColor}
                          onChange={(e) => handleInputChange('appearance', 'accentColor', e.target.value)}
                          className="w-12 h-10 border border-gray-600 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.appearance.accentColor}
                          onChange={(e) => handleInputChange('appearance', 'accentColor', e.target.value)}
                          className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-soft-gold transition-colors"
                          placeholder="#DC2626"
                        />
                      </div>
                      {/* Predefined Accent Colors */}
                      <div className="flex space-x-2">
                        {['#DC2626', '#7C3AED', '#059669', '#EA580C', '#DB2777'].map((color) => (
                          <button
                            key={color}
                            onClick={() => handleInputChange('appearance', 'accentColor', color)}
                            className={`w-8 h-8 rounded border-2 transition-all ${
                              settings.appearance.accentColor === color
                                ? 'border-white scale-110'
                                : 'border-gray-500 hover:border-gray-300'
                            }`}
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleSave('appearance')}
                    disabled={saving}
                    className="bg-gradient-to-r from-soft-gold to-laser-red text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2 hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    <Save size={16} />
                    <span>{saving ? 'Saving...' : 'Save Appearance'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}