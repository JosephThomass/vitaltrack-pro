import React from 'react';
import { 
  CheckCircle, 
  Dumbbell, 
  Utensils, 
  Pill, 
  Droplet, 
  Play, 
  Clock, 
  Flame, 
  Scale, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Plus,
  ShieldCheck,
  Zap,
  Activity,
  Check,
  Layers,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  DailyGuidanceReport, 
  LoggedWorkout, 
  MealSlot, 
  MedicineOrSupplement, 
  UserProfile, 
  WaterLog, 
  WorkoutRoutine 
} from '../types';
import { CalculatedTargets } from '../utils/calorieCalculator';
import { soundManager } from '../utils/audio';

interface DashboardProps {
  profile: UserProfile;
  targets: CalculatedTargets;
  report: DailyGuidanceReport;
  mealSlots: MealSlot[];
  routines: WorkoutRoutine[];
  loggedWorkouts: LoggedWorkout[];
  meds: MedicineOrSupplement[];
  waterLogs: WaterLog[];
  onNavigateTab: (tab: string) => void;
  onQuickAddWater: (amountMl: number) => void;
  onToggleMeal: (slotId: string) => void;
  onToggleMed: (medId: string) => void;
  onOpenOnboarding: () => void;
  onSwitchAccount?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  targets,
  report,
  mealSlots,
  routines,
  loggedWorkouts,
  meds,
  waterLogs,
  onNavigateTab,
  onQuickAddWater,
  onToggleMeal,
  onToggleMed,
  onOpenOnboarding,
  onSwitchAccount,
}) => {
  const totalWaterConsumed = waterLogs.reduce((s, l) => s + l.amountMl, 0);
  const waterPercent = Math.min(100, Math.round((totalWaterConsumed / targets.targetWaterMl) * 100));

  const totalCaloriesConsumed = mealSlots.reduce((sum, slot) => {
    return sum + slot.items.reduce((s, it) => s + Math.round(it.calories * (it.quantity || 1)), 0);
  }, 0);
  const caloriePercent = Math.min(100, Math.round((totalCaloriesConsumed / targets.targetCalories) * 100));

  // Determine today's primary routine based on gym/home preference
  const todayRoutine = routines.find(r => 
    profile.workoutLocation === 'home' ? r.location === 'home' : r.id === 'push-day'
  ) || routines[0];

  const workoutLoggedToday = loggedWorkouts.length > 0;

  // Build unified chronological schedule
  interface DailyItem {
    id: string;
    type: 'meal' | 'med' | 'workout';
    categoryLabel: string;
    title: string;
    subtitle: string;
    time: string;
    completed: boolean;
    icon: React.ElementType;
    iconColor: string;
    accentBorder: string;
    onToggle: () => void;
  }

  const scheduleItems: DailyItem[] = [];

  // Add Meals
  mealSlots.forEach((slot) => {
    scheduleItems.push({
      id: `meal-${slot.id}`,
      type: 'meal',
      categoryLabel: 'NUTRITION',
      title: slot.title,
      subtitle: slot.items.map(i => i.name).slice(0, 2).join(', ') || 'Healthy planned nutrition',
      time: slot.scheduledTime,
      completed: slot.isCompleted,
      icon: Utensils,
      iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      accentBorder: 'border-l-amber-500',
      onToggle: () => onToggleMeal(slot.id),
    });
  });

  // Add Medicines & Supplements
  meds.forEach((med) => {
    const isHair = med.category === 'hair_loss';
    scheduleItems.push({
      id: `med-${med.id}`,
      type: 'med',
      categoryLabel: isHair ? 'HAIR REGIMEN' : 'SUPPLEMENT',
      title: med.name,
      subtitle: `${med.dosage} • ${med.purpose}`,
      time: med.scheduledTime,
      completed: med.takenToday,
      icon: isHair ? ShieldCheck : Pill,
      iconColor: isHair ? 'text-purple-400 bg-purple-500/10 border-purple-500/20' : 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      accentBorder: isHair ? 'border-l-purple-500' : 'border-l-cyan-500',
      onToggle: () => onToggleMed(med.id),
    });
  });

  // Add Workout Slot
  scheduleItems.push({
    id: 'workout-today',
    type: 'workout',
    categoryLabel: profile.workoutLocation === 'home' ? 'HOME WORKOUT' : 'GYM WORKOUT',
    title: todayRoutine.title,
    subtitle: `${todayRoutine.exercises.length} exercises with video guides & rest timer`,
    time: profile.preferredWorkoutTime || '18:00',
    completed: workoutLoggedToday,
    icon: Dumbbell,
    iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    accentBorder: 'border-l-emerald-500',
    onToggle: () => onNavigateTab('workouts'),
  });

  // Sort chronologically by time HH:MM
  scheduleItems.sort((a, b) => a.time.localeCompare(b.time));

  // Count progress
  const totalTasks = scheduleItems.length;
  const completedTasks = scheduleItems.filter(i => i.completed).length;
  const taskProgressPercent = Math.round((completedTasks / totalTasks) * 100);

  // Time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Concentric Multi-Ring Activity SVG Calculations
  // Ring 1 (Tasks / Regimen): radius = 54, stroke = 7
  const r1 = 54;
  const c1 = 2 * Math.PI * r1;
  const offset1 = c1 - (taskProgressPercent / 100) * c1;

  // Ring 2 (Nutrition Calories): radius = 42, stroke = 7
  const r2 = 42;
  const c2 = 2 * Math.PI * r2;
  const offset2 = c2 - (caloriePercent / 100) * c2;

  // Ring 3 (Hydration): radius = 30, stroke = 7
  const r3 = 30;
  const c3 = 2 * Math.PI * r3;
  const offset3 = c3 - (waterPercent / 100) * c3;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. Executive Performance Command Banner */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Subtle background ambient glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[10px] tracking-wider uppercase font-bold border border-emerald-500/30">
                {profile.workoutLocation === 'home' ? '🏠 Home Routine Active' : '🏋️ Gym Routine Active'}
              </span>
              <span className="text-zinc-500 text-xs">•</span>
              <span className="text-zinc-400 text-xs font-mono">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
              {profile.phoneNumber && (
                <span className="text-zinc-500 text-[11px] font-mono">
                  (Account: {profile.phoneNumber})
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {getGreeting()}, {profile.name}! 👋
            </h1>

            <p className="text-zinc-400 text-xs sm:text-sm max-w-xl leading-relaxed">
              Today you have <strong className="text-white font-mono">{completedTasks} of {totalTasks}</strong> daily targets completed. Your energy intake, hydration, and hair follicle protocol are synchronized.
            </p>

            {/* Biometric Badges Row */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono">
              <div className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 flex items-center space-x-1.5">
                <span className="text-zinc-500">Weight:</span>
                <strong className="text-white">{profile.weightKg} kg</strong>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-emerald-500/30 text-emerald-400 flex items-center space-x-1.5">
                <span className="text-zinc-500">Goal Target:</span>
                <strong>{profile.goalWeightKg || profile.systemRecommendedWeightKg || profile.weightKg} kg</strong>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-cyan-400 flex items-center space-x-1.5">
                <span className="text-zinc-500">BMI:</span>
                <strong>{profile.bmi || 23.5} ({profile.bmiCategory || 'Normal'})</strong>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-purple-500/30 text-purple-400 flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>Hair Stack: {profile.hasHairLossRegimen ? 'Active' : 'Off'}</span>
              </div>
            </div>
          </div>

          {/* Multi-Ring Activity Gauge (Apple Fitness Style) */}
          <div className="flex items-center space-x-6 bg-zinc-950/80 p-5 rounded-3xl border border-zinc-800/80 shadow-inner shrink-0 self-center lg:self-auto">
            {/* SVG Concentric Rings */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 130 130">
                {/* Background tracks */}
                <circle cx="65" cy="65" r={r1} stroke="#18181b" strokeWidth="8" fill="none" />
                <circle cx="65" cy="65" r={r2} stroke="#18181b" strokeWidth="8" fill="none" />
                <circle cx="65" cy="65" r={r3} stroke="#18181b" strokeWidth="8" fill="none" />

                {/* Ring 1: Tasks / Regimen (Emerald) */}
                <circle
                  cx="65"
                  cy="65"
                  r={r1}
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={c1}
                  strokeDashoffset={offset1}
                  className="transition-all duration-1000 ease-out"
                />

                {/* Ring 2: Nutrition / Calories (Amber) */}
                <circle
                  cx="65"
                  cy="65"
                  r={r2}
                  stroke="#f59e0b"
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={c2}
                  strokeDashoffset={offset2}
                  className="transition-all duration-1000 ease-out"
                />

                {/* Ring 3: Hydration (Cyan) */}
                <circle
                  cx="65"
                  cy="65"
                  r={r3}
                  stroke="#06b6d4"
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={c3}
                  strokeDashoffset={offset3}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              {/* Center Readiness Metric */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-lg font-black text-white font-mono leading-none">
                  {report.healthScore}%
                </span>
                <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold mt-0.5">
                  OPTIMAL
                </span>
              </div>
            </div>

            {/* Legend & Summary */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-zinc-400">Schedule:</span>
                <strong className="text-white font-mono">{taskProgressPercent}%</strong>
              </div>

              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-zinc-400">Calories:</span>
                <strong className="text-white font-mono">{caloriePercent}%</strong>
              </div>

              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                <span className="text-zinc-400">Hydration:</span>
                <strong className="text-white font-mono">{waterPercent}%</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quick Performance Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1: Hydration Station with Quick Add */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                  <Droplet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Hydration Station</h3>
                  <span className="text-xs text-zinc-400 font-mono">
                    {totalWaterConsumed} / {targets.targetWaterMl} ml
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-lg border border-cyan-500/20">
                {waterPercent}%
              </span>
            </div>

            <div className="w-full h-1.5 bg-zinc-950 rounded-full my-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full transition-all duration-500"
                style={{ width: `${waterPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <button
              onClick={() => onQuickAddWater(250)}
              className="flex-1 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-cyan-500/40 text-cyan-300 font-semibold text-xs transition"
            >
              + 250ml Glass
            </button>
            <button
              onClick={() => onQuickAddWater(500)}
              className="flex-1 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs transition shadow-md shadow-cyan-500/20"
            >
              + 500ml Bottle
            </button>
          </div>
        </div>

        {/* Metric 2: Today's Workout Command */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Daily Workout Routine</h3>
                  <p className="text-xs text-zinc-400 truncate max-w-[170px]">{todayRoutine.title.split('(')[0].trim()}</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full font-mono ${
                workoutLoggedToday ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-400'
              }`}>
                {workoutLoggedToday ? 'Completed' : 'Pending'}
              </span>
            </div>

            <p className="text-xs text-zinc-400 my-2 leading-relaxed">
              Target Time: <strong className="text-zinc-200 font-mono">{profile.preferredWorkoutTime || '18:00'}</strong> ({todayRoutine.exercises.length} exercises with video guides)
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('workouts')}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 font-bold text-xs shadow-md transition flex items-center justify-center space-x-2"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{workoutLoggedToday ? 'Review Workout Log' : 'Launch Workout HUD & Videos'}</span>
          </button>
        </div>

        {/* Metric 3: Hair Loss & Supplement Protocol */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Hair Regrowth Stack</h3>
                  <p className="text-xs text-zinc-400">Minoxidil & DHT Barrier</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-lg border border-purple-500/20">
                14-Day Streak 🔥
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 my-2">
              {meds.filter(m => m.category === 'hair_loss').slice(0, 2).map((m) => (
                <button
                  key={m.id}
                  onClick={() => onToggleMed(m.id)}
                  className={`p-2 rounded-xl text-left border transition ${
                    m.takenToday
                      ? 'bg-purple-950/30 border-purple-500/50 text-purple-300'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  <p className="text-[11px] font-bold truncate text-white">{m.name.split('(')[0]}</p>
                  <p className="text-[10px] text-zinc-500">{m.takenToday ? 'Taken ✓' : `Due ${m.scheduledTime}`}</p>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('regimen')}
            className="w-full py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-purple-500/40 text-purple-300 font-semibold text-xs transition flex items-center justify-center space-x-1.5"
          >
            <span>Full Regimen & Biometrics</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Today's Chronological Schedule & Interactive Checklist */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              <span>Today&apos;s Chronological Schedule</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Scheduled nutrition, supplements, and workout aligned to your preferred time slot.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800">
              {completedTasks} / {totalTasks} Completed
            </span>
          </div>
        </div>

        {/* Schedule List */}
        <div className="space-y-2.5 pt-1">
          {scheduleItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  item.completed
                    ? 'bg-zinc-950/90 border-emerald-500/30 text-emerald-200 shadow-sm'
                    : `bg-zinc-950/60 border-zinc-800/90 hover:border-zinc-700 ${item.accentBorder} border-l-4`
                }`}
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  {/* High-Tech Time Tag */}
                  <span className="font-mono text-xs font-bold text-zinc-300 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800 shrink-0">
                    {item.time}
                  </span>

                  {/* Icon */}
                  <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${item.iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Item Details */}
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 font-bold">
                        {item.categoryLabel}
                      </span>
                    </div>
                    <h4 className={`text-sm font-bold truncate ${item.completed ? 'text-zinc-400 line-through' : 'text-white'}`}>
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-zinc-400 truncate">{item.subtitle}</p>
                  </div>
                </div>

                {/* Tactile Completion Action */}
                <button
                  onClick={item.onToggle}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                    item.completed
                      ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/30'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white border border-zinc-700'
                  }`}
                  title={item.completed ? 'Completed' : 'Tap to mark completed'}
                >
                  <Check className={`w-4 h-4 ${item.completed ? 'stroke-[3]' : ''}`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
