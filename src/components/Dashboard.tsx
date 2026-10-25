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
  Plus
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
}) => {
  const totalWaterConsumed = waterLogs.reduce((s, l) => s + l.amountMl, 0);
  const waterPercent = Math.min(100, Math.round((totalWaterConsumed / targets.targetWaterMl) * 100));

  // Determine today's primary routine based on gym/home preference
  const todayRoutine = routines.find(r => 
    profile.workoutLocation === 'home' ? r.location === 'home' : r.id === 'push-day'
  ) || routines[0];

  const workoutLoggedToday = loggedWorkouts.length > 0;

  // Build unified chronological schedule
  interface DailyItem {
    id: string;
    type: 'meal' | 'med' | 'workout';
    title: string;
    subtitle: string;
    time: string;
    completed: boolean;
    icon: React.ElementType;
    iconColor: string;
    onToggle: () => void;
  }

  const scheduleItems: DailyItem[] = [];

  // Add Meals
  mealSlots.forEach((slot) => {
    scheduleItems.push({
      id: `meal-${slot.id}`,
      type: 'meal',
      title: slot.title,
      subtitle: slot.items.map(i => i.name).slice(0, 2).join(', ') || 'Healthy balanced meal',
      time: slot.scheduledTime,
      completed: slot.isCompleted,
      icon: Utensils,
      iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      onToggle: () => onToggleMeal(slot.id),
    });
  });

  // Add Medicines & Supplements
  meds.forEach((med) => {
    scheduleItems.push({
      id: `med-${med.id}`,
      type: 'med',
      title: med.name,
      subtitle: `${med.dosage} • ${med.purpose}`,
      time: med.scheduledTime,
      completed: med.takenToday,
      icon: Pill,
      iconColor: med.category === 'hair_loss' ? 'text-purple-400 bg-purple-500/10 border-purple-500/30' : 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      onToggle: () => onToggleMed(med.id),
    });
  });

  // Add Workout Slot
  scheduleItems.push({
    id: 'workout-today',
    type: 'workout',
    title: todayRoutine.title,
    subtitle: `${todayRoutine.exercises.length} exercises with video guide (${profile.workoutLocation === 'home' ? 'Home' : 'Gym'})`,
    time: profile.preferredWorkoutTime || '18:00',
    completed: workoutLoggedToday,
    icon: Dumbbell,
    iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    onToggle: () => onNavigateTab('workouts'),
  });

  // Sort chronologically by HH:MM
  scheduleItems.sort((a, b) => a.time.localeCompare(b.time));

  // Count progress
  const totalTasks = scheduleItems.length;
  const completedTasks = scheduleItems.filter(i => i.completed).length;
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. Clean Hero Greeting & Daily Progress */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              {profile.workoutLocation === 'home' ? '🏠 Home Training Plan' : '🏋️ Gym Routine Active'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Hello, {profile.name}! 👋
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm">
              Today: <strong className="text-white">{completedTasks} of {totalTasks}</strong> daily goals completed. Keep going!
            </p>

            {/* Quick goal weight indicator */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                Current: <strong className="text-white">{profile.weightKg} kg</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                Target: <strong className="text-emerald-400">{profile.goalWeightKg || profile.systemRecommendedWeightKg || profile.weightKg} kg</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                BMI: <strong className="text-cyan-400">{profile.bmi || 23.5} ({profile.bmiCategory || 'Normal'})</strong>
              </span>
            </div>
          </div>

          {/* Simple Radial Progress Counter */}
          <div className="flex items-center space-x-4 self-center sm:self-auto bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            <div className="relative w-16 h-16 rounded-full bg-slate-900 border-4 border-slate-800 flex items-center justify-center">
              <span className="text-lg font-black text-emerald-400">{progressPercent}%</span>
              <div 
                className="absolute inset-0 rounded-full border-4 border-emerald-400 transition-all duration-700"
                style={{ clipPath: `inset(${100 - progressPercent}% 0 0 0)` }}
              />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Daily Score</p>
              <p className="text-xs text-slate-400">{completedTasks} completed</p>
              <p className="text-[11px] text-emerald-400 font-semibold">{totalTasks - completedTasks} remaining</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-950 rounded-full mt-5 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 2. Quick Action Cards (Water & Workout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Quick Water Logger */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2.5">
              <span className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Droplet className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bold text-sm text-white">Hydration</h3>
                <span className="text-xs text-slate-400">{totalWaterConsumed} / {targets.targetWaterMl} ml ({waterPercent}%)</span>
              </div>
            </div>
            <span className="text-xs font-bold text-cyan-400">{waterPercent}%</span>
          </div>

          <div className="w-full h-1.5 bg-slate-950 rounded-full mb-4 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full transition-all duration-500"
              style={{ width: `${waterPercent}%` }}
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onQuickAddWater(250)}
              className="flex-1 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-bold text-xs transition"
            >
              + Glass (250ml)
            </button>
            <button
              onClick={() => onQuickAddWater(500)}
              className="flex-1 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition shadow-md"
            >
              + Bottle (500ml)
            </button>
          </div>
        </div>

        {/* Quick Workout Button */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2.5">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Dumbbell className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bold text-sm text-white">Today&apos;s Workout</h3>
                <p className="text-xs text-slate-400">{todayRoutine.title.split('(')[0].trim()}</p>
              </div>
            </div>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${workoutLoggedToday ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
              {workoutLoggedToday ? 'Completed 🔥' : 'Pending'}
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-3">
            Scheduled at <strong className="text-white">{profile.preferredWorkoutTime || '18:00'}</strong> with form videos and rest stopwatch.
          </p>

          <button
            onClick={() => onNavigateTab('workouts')}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center justify-center space-x-2"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{workoutLoggedToday ? 'View Logged Workout' : 'Start Workout with Video Guides'}</span>
          </button>
        </div>
      </div>

      {/* 3. Today's Unified Timeline & Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              <span>Today&apos;s Schedule & Checklist</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Tap any item to mark it done. Meals, hair medicines, and workout aligned to your day.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
            {completedTasks}/{totalTasks} Done
          </span>
        </div>

        {/* Schedule Items List */}
        <div className="space-y-2.5 pt-1">
          {scheduleItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  item.completed
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  {/* Time Badge */}
                  <span className="font-mono text-xs font-bold text-slate-300 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 shrink-0">
                    {item.time}
                  </span>

                  {/* Icon */}
                  <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${item.iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Title & Subtitle */}
                  <div className="min-w-0">
                    <h4 className={`text-sm font-bold truncate ${item.completed ? 'text-emerald-300 line-through' : 'text-white'}`}>
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">{item.subtitle}</p>
                  </div>
                </div>

                {/* Single Tap Checkmark Button */}
                <button
                  onClick={item.onToggle}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                    item.completed
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                  title={item.completed ? 'Marked complete' : 'Tap to complete'}
                >
                  <CheckCircle className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
