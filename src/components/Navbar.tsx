import React from 'react';
import { 
  Dumbbell, 
  Utensils, 
  Sparkles, 
  Leaf,
  LayoutDashboard,
  Smartphone,
  ShieldCheck,
  Bell,
  BellRing,
  UserCheck,
  LogOut,
  Sun,
  Moon,
  Droplet
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
  onSwitchAccount?: () => void;
  theme?: 'vert-light' | 'vert-dark';
  onToggleTheme?: () => void;
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
  onSwitchAccount,
  theme = 'vert-light',
  onToggleTheme,
}) => {
  const isDark = theme === 'vert-dark';

  // Core navigation tabs
  const tabs = [
    { id: 'dashboard', label: 'Today', icon: LayoutDashboard },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell },
    { id: 'diet', label: 'Diet & Food', icon: Utensils },
    { id: 'regimen', label: 'Hair & Health', icon: ShieldCheck },
  ];

  return (
    <>
      <header className={`sticky top-0 z-40 transition-colors duration-200 border-b backdrop-blur-md ${
        isDark 
          ? 'bg-[#071510]/90 border-emerald-900/40 text-emerald-50' 
          : 'bg-white/95 border-emerald-100 text-slate-800 shadow-xs'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div 
              className="flex items-center space-x-2.5 cursor-pointer group" 
              onClick={() => setActiveTab('dashboard')}
            >
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className={`font-black text-lg tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    VitalTrack
                  </span>
                  <span className="text-[10px] font-bold tracking-wider uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {profile.workoutLocation === 'home' ? 'Home' : 'Gym'}
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation (4 Clean Friendly Tabs) */}
            <nav className={`hidden md:flex items-center space-x-1 p-1 rounded-2xl border ${
              isDark 
                ? 'bg-[#0d221a] border-emerald-900/50' 
                : 'bg-slate-100/90 border-slate-200/80'
            }`}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? isDark 
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' 
                          : 'bg-emerald-600 text-white shadow-sm'
                        : isDark
                          ? 'text-emerald-200/70 hover:text-white hover:bg-emerald-900/30'
                          : 'text-slate-600 hover:text-emerald-700 hover:bg-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Controls */}
            <div className="flex items-center space-x-2">
              {/* Theme Toggle Button (Light/Dark) */}
              {onToggleTheme && (
                <button
                  onClick={onToggleTheme}
                  className={`p-2 rounded-xl text-xs transition border flex items-center space-x-1.5 ${
                    isDark
                      ? 'bg-[#0d221a] text-amber-300 border-emerald-900/60 hover:bg-emerald-900/40'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  }`}
                  title={isDark ? 'Switch to Fresh Vert (Light Mode)' : 'Switch to Forest Vert (Dark Mode)'}
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span className="hidden lg:inline font-bold text-[11px]">{isDark ? 'Light' : 'Dark'}</span>
                </button>
              )}

              {/* Phone App Connect Button */}
              <button
                onClick={onOpenPhoneModal}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                  isDark
                    ? 'bg-teal-950/40 text-teal-300 border-teal-800/60 hover:bg-teal-900/40'
                    : 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100'
                }`}
                title="Connect or Install on Android Phone"
              >
                <Smartphone className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span className="hidden sm:inline">Phone App</span>
              </button>

              {/* Notification Alarm Bell */}
              <button
                onClick={onRequestNotifications}
                className={`p-2 rounded-xl text-xs transition border ${
                  notificationsEnabled
                    ? isDark
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-emerald-100 text-emerald-700 border-emerald-300'
                    : isDark
                      ? 'bg-[#0d221a] text-slate-400 border-emerald-900/40 hover:text-white'
                      : 'bg-slate-100 text-slate-500 border-slate-200 hover:text-slate-800'
                }`}
                title={notificationsEnabled ? 'Reminders are on' : 'Click to enable reminders'}
              >
                {notificationsEnabled ? <BellRing className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Bell className="w-4 h-4" />}
              </button>

              {/* User Avatar & Profile Button */}
              <button
                onClick={onOpenProfile}
                className={`flex items-center space-x-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl transition border ${
                  isDark
                    ? 'bg-[#0d221a] border-emerald-900/50 hover:bg-[#122c22]'
                    : 'bg-white border-slate-200 hover:bg-slate-50 shadow-xs'
                }`}
                title="View & Edit Profile"
              >
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-xs font-black text-white shadow-xs">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden lg:block">
                  <p className={`text-xs font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{profile.name}</p>
                  <p className={`text-[10px] ${isDark ? 'text-emerald-300/70' : 'text-slate-500'}`}>{profile.weightKg}kg • BMI {profile.bmi || 23.5}</p>
                </div>
              </button>

              {/* Quick Switch Account Button */}
              {onSwitchAccount && (
                <button
                  onClick={onSwitchAccount}
                  className={`p-2 rounded-xl transition border ${
                    isDark
                      ? 'bg-[#0d221a] border-emerald-900/50 text-emerald-300/60 hover:text-rose-400'
                      : 'bg-white border-slate-200 text-slate-400 hover:text-rose-500 shadow-xs'
                  }`}
                  title="Switch User / Sign In with Another Number"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Bar (Clean 4 icons with friendly green indicators) */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 px-4 py-2 flex items-center justify-around border-t backdrop-blur-xl shadow-lg transition-colors ${
        isDark
          ? 'bg-[#071510]/95 border-emerald-900/40 text-emerald-50'
          : 'bg-white/95 border-slate-200 text-slate-800'
      }`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition ${
                isActive 
                  ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' 
                  : isDark ? 'text-emerald-200/50 hover:text-emerald-100' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px] mt-0.5">{tab.label.split('&')[0].trim()}</span>
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-0.5" />}
            </button>
          );
        })}
      </div>
    </>
  );
};
