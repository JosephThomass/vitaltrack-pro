import React from 'react';
import { 
  Dumbbell, 
  Utensils, 
  Sparkles, 
  Flame,
  LayoutDashboard,
  Smartphone,
  ShieldCheck,
  Bell,
  BellRing,
  UserCheck
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
  // Simplified 4 core tabs
  const tabs = [
    { id: 'dashboard', label: 'Today', icon: LayoutDashboard },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell },
    { id: 'diet', label: 'Diet & Calories', icon: Utensils },
    { id: 'regimen', label: 'Health & Coach', icon: ShieldCheck },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div 
              className="flex items-center space-x-2.5 cursor-pointer" 
              onClick={() => setActiveTab('dashboard')}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20">
                <Flame className="w-5 h-5 text-slate-950 fill-current" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-white">VitalTrack</span>
                <span className="text-[10px] ml-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
                  {profile.workoutLocation === 'home' ? 'Home' : 'Gym'}
                </span>
              </div>
            </div>

            {/* Desktop Navigation (4 Clean Tabs) */}
            <nav className="hidden md:flex items-center space-x-1 bg-slate-950/80 p-1 rounded-2xl border border-slate-800">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
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
              {/* Phone App Modal Button */}
              <button
                onClick={onOpenPhoneModal}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 text-xs font-semibold transition"
                title="Install or Open on Android Phone"
              >
                <Smartphone className="w-4 h-4 text-indigo-400" />
                <span className="hidden sm:inline">Phone App</span>
              </button>

              {/* Reminder Bell */}
              <button
                onClick={onRequestNotifications}
                className={`p-2 rounded-xl text-xs transition ${
                  notificationsEnabled
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
                title={notificationsEnabled ? 'Reminders are on' : 'Click to enable reminders'}
              >
                {notificationsEnabled ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
              </button>

              {/* User Avatar & Settings Trigger */}
              <button
                onClick={onOpenProfile}
                className="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition border border-slate-700/60"
                title="Profile & Biometric Settings"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-slate-950">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-bold leading-tight">{profile.name}</p>
                  <p className="text-[10px] text-slate-400">{profile.weightKg} kg • BMI {profile.bmi || 23.5}</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Bar (Clean 4 icons) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-4 py-2 flex items-center justify-around shadow-2xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center p-1 rounded-xl transition ${
                isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px] mt-0.5">{tab.label.split('&')[0].trim()}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
