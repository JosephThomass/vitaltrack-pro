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
  ChevronRight,
  Sun,
  Smile,
  Heart
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
  theme?: 'vert-light' | 'vert-dark';
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
  theme = 'vert-light',
}) => {
  const isDark = theme === 'vert-dark';

  const totalWaterConsumed = waterLogs.reduce((s, l) => s + l.amountMl, 0);
  const waterPercent = Math.min(100, Math.round((totalWaterConsumed / targets.targetWaterMl) * 100));

  const totalCaloriesConsumed = mealSlots.reduce((sum, slot) => {
    return sum + slot.items.reduce((s, it) => s + Math.round(it.calories * (it.quantity || 1)), 0);
  }, 0);
  const caloriePercent = Math.min(100, Math.round((totalCaloriesConsumed / targets.targetCalories) * 100));
  const caloriesRemaining = Math.max(0, targets.targetCalories - totalCaloriesConsumed);

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
    cardBg: string;
    onToggle: () => void;
  }

  const scheduleItems: DailyItem[] = [];

  // Add Meals
  mealSlots.forEach((slot) => {
    scheduleItems.push({
      id: `meal-${slot.id}`,
      type: 'meal',
      categoryLabel: 'Meal',
      title: slot.title,
      subtitle: slot.items.map(i => i.name).slice(0, 2).join(', ') || 'Healthy planned nutrition',
      time: slot.scheduledTime,
      completed: slot.isCompleted,
      icon: Utensils,
      iconColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40',
      cardBg: isDark ? 'bg-[#0d221a]' : 'bg-white',
      onToggle: () => onToggleMeal(slot.id),
    });
  });

  // Add Medicines & Supplements
  meds.forEach((med) => {
    const isHair = med.category === 'hair_loss';
    scheduleItems.push({
      id: `med-${med.id}`,
      type: 'med',
      categoryLabel: isHair ? 'Hair Care' : 'Supplement',
      title: med.name,
      subtitle: `${med.dosage} • ${med.purpose}`,
      time: med.scheduledTime,
      completed: med.takenToday,
      icon: isHair ? ShieldCheck : Pill,
      iconColor: isHair 
        ? 'text-purple-500 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40' 
        : 'text-teal-500 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/40',
      cardBg: isDark ? 'bg-[#0d221a]' : 'bg-white',
      onToggle: () => onToggleMed(med.id),
    });
  });

  // Add Workout Slot
  scheduleItems.push({
    id: 'workout-today',
    type: 'workout',
    categoryLabel: profile.workoutLocation === 'home' ? 'Home Workout' : 'Gym Workout',
    title: todayRoutine.title,
    subtitle: `${todayRoutine.exercises.length} exercises with video guides & rest timer`,
    time: profile.preferredWorkoutTime || '18:00',
    completed: workoutLoggedToday,
    icon: Dumbbell,
    iconColor: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40',
    cardBg: isDark ? 'bg-[#0d221a]' : 'bg-white',
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

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* 1. Friendly Vert Greeting & Daily Progress Card */}
      <div className={`p-6 sm:p-7 rounded-3xl border transition-all ${
        isDark 
          ? 'bg-[#0d221a] border-emerald-900/50 shadow-lg text-emerald-50' 
          : 'bg-white border-emerald-100 shadow-sm text-slate-900'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                <span>🌿</span>
                <span>{profile.workoutLocation === 'home' ? 'Home Workout Plan' : 'Gym Workout Plan'}</span>
              </span>
              <span className="text-xs text-slate-400 dark:text-emerald-300/60 font-medium">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {getGreeting()}, {profile.name}! 👋
            </h1>

            <p className={`text-sm leading-relaxed max-w-md ${isDark ? 'text-emerald-200/80' : 'text-slate-600'}`}>
              You have completed <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold">{completedTasks} of {totalTasks}</strong> daily habits. Keep the momentum going!
            </p>

            {/* Quick Goals Pill Row */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className={`px-3 py-1.5 rounded-xl border ${
                isDark ? 'bg-[#071510] border-emerald-900/60 text-emerald-100' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                Current: <strong className="text-emerald-600 dark:text-emerald-400">{profile.weightKg} kg</strong>
              </span>

              <span className={`px-3 py-1.5 rounded-xl border ${
                isDark ? 'bg-[#071510] border-emerald-900/60 text-emerald-100' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                Target Goal: <strong className="text-teal-600 dark:text-teal-400">{profile.goalWeightKg || profile.systemRecommendedWeightKg || profile.weightKg} kg</strong>
              </span>

              <span className={`px-3 py-1.5 rounded-xl border ${
                isDark ? 'bg-[#071510] border-emerald-900/60 text-emerald-100' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                BMI: <strong>{profile.bmi || 23.5} ({profile.bmiCategory || 'Normal'})</strong>
              </span>
            </div>
          </div>

          {/* Clean Big Progress Circle */}
          <div className={`flex flex-col items-center justify-center p-5 rounded-2xl border shrink-0 ${
            isDark ? 'bg-[#071510] border-emerald-900/50' : 'bg-emerald-50/60 border-emerald-100'
          }`}>
            <div className="relative w-20 h-20 rounded-full flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                <path
                  className={`${isDark ? 'text-emerald-950' : 'text-emerald-100'}`}
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500 transition-all duration-700 ease-out"
                  strokeDasharray={`${taskProgressPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                  {taskProgressPercent}%
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-emerald-300/60">
                  Done
                </span>
              </div>
            </div>
            <p className="text-xs font-bold text-slate-600 dark:text-emerald-200 mt-2">
              {totalTasks - completedTasks} remaining
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={`w-full h-2.5 rounded-full mt-6 overflow-hidden ${isDark ? 'bg-[#071510]' : 'bg-slate-100'}`}>
          <div 
            className="h-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 rounded-full transition-all duration-700"
            style={{ width: `${taskProgressPercent}%` }}
          />
        </div>
      </div>

      {/* 2. Today's Key Habits: Big, Friendly Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Hydration Tracker */}
        <div className={`p-5 rounded-3xl border flex flex-col justify-between transition-all ${
          isDark 
            ? 'bg-[#0d221a] border-emerald-900/50 text-emerald-50' 
            : 'bg-white border-emerald-100 shadow-sm text-slate-900'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-500 border border-cyan-200 dark:border-cyan-800/40 flex items-center justify-center">
                  <Droplet className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Water Tracker</h3>
                  <p className="text-xs text-slate-500 dark:text-emerald-300/60">
                    {totalWaterConsumed} / {targets.targetWaterMl} ml
                  </p>
                </div>
              </div>
              <span className="text-xs font-black text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 px-2 py-0.5 rounded-full border border-cyan-200 dark:border-cyan-800/40">
                {waterPercent}%
              </span>
            </div>

            <div className={`w-full h-2 rounded-full mb-4 overflow-hidden ${isDark ? 'bg-[#071510]' : 'bg-slate-100'}`}>
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${waterPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <button
              onClick={() => onQuickAddWater(250)}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition border ${
                isDark
                  ? 'bg-[#071510] border-emerald-900/60 text-cyan-300 hover:bg-cyan-950/40'
                  : 'bg-cyan-50 border-cyan-200 text-cyan-800 hover:bg-cyan-100'
              }`}
            >
              + 250ml
            </button>
            <button
              onClick={() => onQuickAddWater(500)}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold text-xs transition shadow-sm"
            >
              + 500ml
            </button>
          </div>
        </div>

        {/* Card 2: Today's Workout */}
        <div className={`p-5 rounded-3xl border flex flex-col justify-between transition-all ${
          isDark 
            ? 'bg-[#0d221a] border-emerald-900/50 text-emerald-50' 
            : 'bg-white border-emerald-100 shadow-sm text-slate-900'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Today&apos;s Workout</h3>
                  <p className="text-xs text-slate-500 dark:text-emerald-300/60 truncate max-w-[150px]">
                    {todayRoutine.title.split('(')[0].trim()}
                  </p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                workoutLoggedToday 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300' 
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
              }`}>
                {workoutLoggedToday ? 'Done 🔥' : 'Pending'}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-emerald-300/70 my-2">
              Time: <strong className="text-slate-800 dark:text-white">{profile.preferredWorkoutTime || '18:00'}</strong> ({todayRoutine.exercises.length} exercises with video guides)
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('workouts')}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-sm transition flex items-center justify-center space-x-2"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{workoutLoggedToday ? 'View Logged Workout' : 'Start Workout with Videos'}</span>
          </button>
        </div>

        {/* Card 3: Hair Care & Supplements */}
        <div className={`p-5 rounded-3xl border flex flex-col justify-between transition-all ${
          isDark 
            ? 'bg-[#0d221a] border-emerald-900/50 text-emerald-50' 
            : 'bg-white border-emerald-100 shadow-sm text-slate-900'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/40 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Hair Care & Meds</h3>
                  <p className="text-xs text-slate-500 dark:text-emerald-300/60">Minoxidil & Vitamins</p>
                </div>
              </div>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800/40">
                14d streak 🔥
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 my-2">
              {meds.filter(m => m.category === 'hair_loss').slice(0, 2).map((m) => (
                <button
                  key={m.id}
                  onClick={() => onToggleMed(m.id)}
                  className={`p-2 rounded-xl text-left border transition ${
                    m.takenToday
                      ? 'bg-purple-50 border-purple-300 text-purple-800 dark:bg-purple-950/40 dark:border-purple-700 dark:text-purple-300'
                      : isDark
                        ? 'bg-[#071510] border-emerald-900/50 text-slate-300 hover:bg-emerald-900/30'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-purple-50/50'
                  }`}
                >
                  <p className="text-[11px] font-bold truncate">{m.name.split('(')[0]}</p>
                  <p className="text-[10px] text-slate-500 dark:text-emerald-300/60">{m.takenToday ? 'Taken ✓' : `Due ${m.scheduledTime}`}</p>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('regimen')}
            className={`w-full py-2.5 rounded-xl font-bold text-xs transition border flex items-center justify-center space-x-1.5 ${
              isDark
                ? 'bg-[#071510] border-emerald-900/60 text-purple-300 hover:bg-purple-950/30'
                : 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100'
            }`}
          >
            <span>Full Routine & Goals</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Today's Calories & Meals Overview Card */}
      <div className={`p-6 rounded-3xl border transition-all ${
        isDark 
          ? 'bg-[#0d221a] border-emerald-900/50 text-emerald-50' 
          : 'bg-white border-emerald-100 shadow-sm text-slate-900'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold flex items-center space-x-2">
              <Utensils className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Today&apos;s Nutrition & Calories</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-emerald-300/60 mt-0.5">
              Target calculated using your BMI, weight goal, and gym activity.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
              {caloriesRemaining} kcal remaining
            </span>
            <button
              onClick={() => onNavigateTab('diet')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Log Food →
            </button>
          </div>
        </div>

        {/* Calorie Bar */}
        <div className="space-y-1.5 mb-4">
          <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-emerald-200">
            <span>Consumed: <strong className="text-emerald-600 dark:text-emerald-400">{totalCaloriesConsumed} kcal</strong></span>
            <span>Target: <strong className="text-slate-800 dark:text-white">{targets.targetCalories} kcal</strong></span>
          </div>
          <div className={`w-full h-3 rounded-full overflow-hidden ${isDark ? 'bg-[#071510]' : 'bg-slate-100'}`}>
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${caloriePercent}%` }}
            />
          </div>
        </div>

        {/* Macros Row */}
        <div className="grid grid-cols-3 gap-3 text-center text-xs font-bold">
          <div className={`p-3 rounded-2xl border ${isDark ? 'bg-[#071510] border-emerald-900/50' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-slate-500 dark:text-emerald-300/60 text-[10px] block uppercase font-bold">Protein Target</span>
            <span className="text-base text-emerald-600 dark:text-emerald-400 font-extrabold">{targets.targetProteinGrams}g</span>
          </div>

          <div className={`p-3 rounded-2xl border ${isDark ? 'bg-[#071510] border-emerald-900/50' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-slate-500 dark:text-emerald-300/60 text-[10px] block uppercase font-bold">Carbs Target</span>
            <span className="text-base text-teal-600 dark:text-teal-400 font-extrabold">{targets.targetCarbsGrams}g</span>
          </div>

          <div className={`p-3 rounded-2xl border ${isDark ? 'bg-[#071510] border-emerald-900/50' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-slate-500 dark:text-emerald-300/60 text-[10px] block uppercase font-bold">Fats Target</span>
            <span className="text-base text-cyan-600 dark:text-cyan-400 font-extrabold">{targets.targetFatGrams}g</span>
          </div>
        </div>
      </div>

      {/* 4. Today's Full Schedule (Vertical Timeline) */}
      <div className={`p-6 sm:p-7 rounded-3xl border transition-all space-y-4 ${
        isDark 
          ? 'bg-[#0d221a] border-emerald-900/50 text-emerald-50' 
          : 'bg-white border-emerald-100 shadow-sm text-slate-900'
      }`}>
        <div className="flex items-center justify-between border-b pb-4 dark:border-emerald-900/40 border-slate-100">
          <div>
            <h2 className="text-lg font-black flex items-center space-x-2">
              <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Today&apos;s Daily Checklist</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-emerald-300/60 mt-0.5">
              Tap any item to mark it done. Meals, medications, and workout organized in sequence.
            </p>
          </div>

          <span className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
            {completedTasks} / {totalTasks} Completed
          </span>
        </div>

        {/* Schedule List */}
        <div className="space-y-3 pt-1">
          {scheduleItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  item.completed
                    ? isDark
                      ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300/80'
                      : 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                    : isDark
                      ? 'bg-[#071510] border-emerald-900/40 hover:border-emerald-800/60'
                      : 'bg-slate-50 border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  {/* Time Badge */}
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border shrink-0 ${
                    isDark 
                      ? 'bg-[#0d221a] border-emerald-900/50 text-emerald-300' 
                      : 'bg-white border-slate-200 text-slate-700 shadow-xs'
                  }`}>
                    {item.time}
                  </span>

                  {/* Icon */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Title & Subtitle */}
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-emerald-300/60">
                        {item.categoryLabel}
                      </span>
                    </div>
                    <h4 className={`text-sm font-bold truncate ${item.completed ? 'line-through opacity-70' : ''}`}>
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-emerald-300/60 truncate">{item.subtitle}</p>
                  </div>
                </div>

                {/* Tactile Round Check Button */}
                <button
                  onClick={item.onToggle}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                    item.completed
                      ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/30'
                      : isDark
                        ? 'bg-[#0d221a] text-slate-400 hover:text-white border border-emerald-900/50'
                        : 'bg-white text-slate-400 hover:text-emerald-600 border border-slate-200 shadow-xs'
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
