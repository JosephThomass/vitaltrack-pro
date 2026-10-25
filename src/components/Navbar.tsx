import React from 'react';
import { 
  Dumbbell, 
  Utensils, 
  Sparkles, 
  Activity,
  Flame,
  LayoutDashboard,
  Smartphone,
  ShieldCheck,
  Bell,
  BellRing,
  UserCheck,
  LogOut,
  Database
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
}) => {
  // Core navigation tabs
  const tabs = [
    { id: 'dashboard', label: 'Today', icon: LayoutDashboard },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell },
    { id: 'diet', label: 'Diet & Macros', icon: Utensils },
    { id: 'regimen', label: 'Health & Coach', icon: ShieldCheck },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-zinc-950/85 backdrop-blur-xl border-b border-zinc-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & System Status */}
            <div className="flex items-center space-x-3.5">
              <div 
                className="flex items-center space-x-2.5 cursor-pointer group" 
                onClick={() => setActiveTab('dashboard')}
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition">
                  <Activity className="w-4 h-4 text-zinc-950 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-extrabold text-base tracking-tight text-white font-sans">VitalTrack</span>
                    <span className="text-[10px] font-mono tracking-widest text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                      PRO
                    </span>
                  </div>
                </div>
              </div>

              {/* Local DB Synced Pill (Desktop) */}
              <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-[10px] font-mono text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>DB SYNCED</span>
                {profile.phoneNumber && (
                  <span className="text-zinc-500 border-l border-zinc-800 pl-1.5">{profile.phoneNumber}</span>
                )}
              </div>
            </div>

            {/* Desktop Navigation (Center segmented pills) */}
            <nav className="hidden md:flex items-center space-x-1 bg-zinc-900/90 p-1 rounded-2xl border border-zinc-800/80 shadow-inner">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/80'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-zinc-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Controls */}
            <div className="flex items-center space-x-2">
              {/* Phone App Connect Button */}
              <button
                onClick={onOpenPhoneModal}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold transition"
                title="Connect or Install on Android Phone"
              >
                <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Phone App</span>
              </button>

              {/* Notification Alarm Bell */}
              <button
                onClick={onRequestNotifications}
                className={`p-2 rounded-xl text-xs transition border ${
                  notificationsEnabled
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
                title={notificationsEnabled ? 'Reminders are active' : 'Click to enable sound & reminders'}
              >
                {notificationsEnabled ? <BellRing className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
              </button>

              {/* User Avatar & Biometrics Dropdown Trigger */}
              <button
                onClick={onOpenProfile}
                className="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 transition border border-zinc-800"
                title="View & Edit Biometrics"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-zinc-950 shadow-sm">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-bold leading-tight text-white">{profile.name}</p>
                  <p className="text-[10px] text-zinc-400 font-mono">{profile.weightKg}kg • BMI {profile.bmi || 23.5}</p>
                </div>
              </button>

              {/* Quick Switch Account / Logout Button */}
              {onSwitchAccount && (
                <button
                  onClick={onSwitchAccount}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-rose-400 transition"
                  title="Switch User / Sign In with Another Number"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Dock (Ultra-clean 4 icons) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-800/80 px-4 py-2 flex items-center justify-around shadow-2xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition ${
                isActive ? 'text-emerald-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px] mt-0.5">{tab.label.split('&')[0].trim()}</span>
              {isActive && <span className="w-1 h-1 rounded-full bg-emerald-400 mt-0.5" />}
            </button>
          );
        })}
      </div>
    </>
  );
};
