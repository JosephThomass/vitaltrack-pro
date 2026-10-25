import React from 'react';
import { 
  Dumbbell, 
  Utensils, 
  Pill, 
  Droplet, 
  Activity, 
  TrendingUp, 
  Bell, 
  BellRing, 
  Flame,
  LayoutDashboard,
  Smartphone,
  Sparkles
} from 'lucide-react';

import { UserProfile } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: UserProfile;
  onOpenProfile: () => void;
  notificationsEnabled: boolean;
  onRequestNotifications: () => void;
  healthScore: number;
  onOpenPhoneModal: () => void;
  onOpenOnboarding: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  onOpenProfile,
  notificationsEnabled,
  onRequestNotifications,
  healthScore,
  onOpenPhoneModal,
  onOpenOnboarding,
}) => {

  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'workouts', label: 'Gym & Workouts', icon: Dumbbell },
    { id: 'diet', label: 'Diet & Meals', icon: Utensils },
    { id: 'hair-meds', label: 'Hair & Supplements', icon: Pill },
    { id: 'water', label: 'Hydration', icon: Droplet },
    { id: 'activities', label: 'Other Activities', icon: Activity },
    { id: 'guidance', label: 'Goal Coach', icon: TrendingUp },
  ];

  const goalBadgeText: Record<string, string> = {
    fat_loss: 'Fat Shred (-500 kcal)',
    lean_bulk: 'Lean Bulk (+350 kcal)',
    maintenance: 'Maintenance',
    muscle_recomp: 'Recomposition',
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Flame className="w-6 h-6 text-slate-950 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-xl tracking-tight text-white">VitalTrack</span>
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Pro
                  </span>
                </div>
                <p className="text-xs text-slate-400 hidden sm:block">Gym • Diet • Hair Regrowth • Hydration</p>
              </div>
            </div>

            {/* Quick Stats & Controls */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Android Phone Connect Button */}
              <button
                onClick={onOpenPhoneModal}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/40 text-indigo-300 transition text-xs font-semibold shadow-sm animate-pulse"
                title="Run on your Android Phone"
              >
                <Smartphone className="w-4 h-4 text-indigo-400" />
                <span className="hidden sm:inline">📱 Open on Phone</span>
              </button>

              {/* Health Score Pill */}
              <div 
                onClick={() => setActiveTab('guidance')}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 cursor-pointer transition"
                title="Daily Overall Health Score"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-slate-300 hidden md:inline">Score:</span>
                <span className="text-xs font-bold text-emerald-400">{healthScore}%</span>
              </div>

              {/* Notification Permission Toggle */}
              <button
                onClick={onRequestNotifications}
                className={`p-2 rounded-lg text-sm transition flex items-center space-x-1.5 ${
                  notificationsEnabled
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20'
                }`}
                title={notificationsEnabled ? 'Reminders active (Audio + Push)' : 'Click to enable reminder alerts'}
              >
                {notificationsEnabled ? (
                  <>
                    <BellRing className="w-4 h-4" />
                    <span className="text-xs hidden lg:inline">Reminders On</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4" />
                    <span className="text-xs hidden lg:inline">Enable Alerts</span>
                  </>
                )}
              </button>

              {/* Initial Analysis & Registration Trigger */}
              <button
                onClick={onOpenOnboarding}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition"
                title="Re-run Initial Biometric Analysis & OTP Registration"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Initial Analysis</span>
              </button>

              {/* User Profile Button */}
              <button
                onClick={onOpenProfile}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition"
                title="Edit Profile & Fitness Goals"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-xs font-semibold leading-tight">{profile.name}</p>
                  <p className="text-[10px] text-slate-400">{goalBadgeText[profile.goal]}</p>
                </div>
              </button>
            </div>
          </div>


          {/* Desktop/Tablet Horizontal Tabs */}
          <nav className="hidden md:flex space-x-1 overflow-x-auto pb-2 pt-1 scrollbar-none border-t border-slate-800/60">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Shown on phones) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        {[
          { id: 'dashboard', label: 'Today', icon: LayoutDashboard },
          { id: 'workouts', label: 'Gym', icon: Dumbbell },
          { id: 'diet', label: 'Diet', icon: Utensils },
          { id: 'hair-meds', label: 'Hair/Meds', icon: Pill },
          { id: 'water', label: 'Water', icon: Droplet },
          { id: 'guidance', label: 'Coach', icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
                isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px] mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
