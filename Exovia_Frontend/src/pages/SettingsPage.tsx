import React from 'react';
import Settings from '@/components/Settings';
import { Settings as SettingsIcon, User, Shield } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-[#6D4C41] via-[#5D4037] to-[#4E342E] rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Account Settings</h1>
              <p className="text-[#EAD9C1]">Manage your profile, notifications, and security preferences</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 px-3 py-1 rounded-full text-sm flex items-center gap-1 text-white">
              <User className="w-3 h-3" />
              Profile Management
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full text-sm flex items-center gap-1 text-white">
              <Shield className="w-3 h-3" />
              Security Settings
            </div>
          </div>
        </div>
      </div>

      {/* Settings Component */}
      <Settings />
    </div>
  );
};

export default SettingsPage;
