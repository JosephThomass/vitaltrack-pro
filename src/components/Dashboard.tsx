import React from 'react';
import { 
  Dumbbell, 
  Utensils, 
  Pill, 
  Droplet, 
  Flame, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  Plus, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  TrendingUp,
  Volume2
} from 'lucide-react';
import { 
  DailyGuidanceReport, 
  LoggedWorkout, 
  MealSlot, 
  MedicineOrSupplement, 
  OtherActivity, 
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
  activities: OtherActivity[];
  onNavigateTab: (tab: string) => void;
  onQuickAddWater: (amountMl: number) => void;
  onQuickToggleMed: (medId: string) => void;
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
  activities,
  onNavigateTab,
  onQuickAddWater,
  onQuickToggleMed,
}) => {
  const totalCaloriesConsumed = mealSlots.reduce((acc, slot) => {
    return acc + slot.items.reduce((s, it) => s + Math.round(it.calories * (it.quantity || 1)), 0);
  }, 0);

  const totalProteinConsumed = mealSlots.reduce((acc, slot) => {
    return acc + slot.items.reduce((s, it) => s + Math.round(it.protein * (it.quantity || 1)), 0);
  }, 0);

  const totalWaterConsumed = waterLogs.reduce((s, l) => s + l.amountMl, 0);

  const hairMeds = meds.filter((m) => m.category === 'hair_loss');
  const hairTaken = hairMeds.filter((m) => m.takenToday).length;

  const totalCaloriesBurned = loggedWorkouts.reduce((s, w) => s + w.caloriesBurned, 0) +
    activities.reduce((s, a) => s + a.caloriesBurned, 0);

  const nextMeal = mealSlots.find((m) => !m.isCompleted);
  const nextMed = meds.find((m) => !m.takenToday);
  const todaysRoutine = routines[0];

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Personalized Gym, Diet & Regimen Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Good day, {profile.name}!
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Tracking your gym workouts, daily meal schedule, hair loss medications, and water intake with timely alarms.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 mt-4">
              <span className="px-3 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
                Goal: <strong className="text-emerald-400 capitalize">{profile.goal.replace('_', ' ')}</strong>
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
                BMI: <strong className="text-cyan-400">{profile.bmi || 23.5} ({profile.bmiCategory || 'Normal'})</strong>
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
                Weight: <strong className="text-white">{profile.weightKg} kg</strong> ➔ Target: <strong className="text-emerald-400">{profile.goalWeightKg || profile.systemRecommendedWeightKg || profile.weightKg} kg</strong>
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
                Schedule: <strong className="text-amber-400">{profile.workoutLocation === 'home' ? '🏠 Home' : '🏋️ Gym'} at {profile.preferredWorkoutTime || '18:00'} ({profile.workoutDaysPerWeek || 5}d/wk)</strong>
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
                Job: <strong className="text-slate-200 capitalize">{(profile.occupationType || 'desk_job').replace('_', ' ')}</strong>
              </span>
              {profile.phoneNumber && (
                <span className="px-3 py-1 rounded-xl bg-indigo-950/50 border border-indigo-500/30 text-xs text-indigo-300">
                  📱 {profile.phoneNumber}
                </span>
              )}
            </div>
          </div>


          {/* Daily Health Score Badge */}
          <div 
            onClick={() => onNavigateTab('guidance')}
            className="bg-slate-950/80 border border-emerald-500/30 hover:border-emerald-500/60 p-5 rounded-2xl flex items-center space-x-5 cursor-pointer transition shadow-xl shrink-0 group"
          >
            <div className="relative w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-black text-2xl text-emerald-400 group-hover:scale-105 transition-transform">
              {report.healthScore}%
            </div>
            <div>
              <div className="flex items-center space-x-1 text-xs text-slate-400 uppercase font-semibold">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Daily Health Score</span>
              </div>
              <p className="text-base font-bold text-white capitalize">{report.calorieStatus.replace('_', ' ')}</p>
              <span className="text-xs text-emerald-400 flex items-center space-x-1 group-hover:underline">
                <span>View Full AI Coach Analysis</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1: Gym Workouts */}
        <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <Dumbbell className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {loggedWorkouts.length > 0 ? 'Completed' : 'Pending'}
              </span>
            </div>
            <h3 className="font-bold text-base text-white">{todaysRoutine?.title.split('(')[0].trim() || 'Gym Workout'}</h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              {todaysRoutine?.exercises.length || 5} exercises with video explanation and rest stopwatch.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-emerald-400 font-semibold">
              {loggedWorkouts.length > 0 ? `Logged (~${loggedWorkouts[0].caloriesBurned} kcal)` : 'Video Guide Ready'}
            </span>
            <button
              onClick={() => onNavigateTab('workouts')}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-1"
            >
              <span>{loggedWorkouts.length > 0 ? 'View Session' : 'Start Gym'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Pillar 2: Meals & Calories */}
        <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                <Utensils className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold text-amber-400">
                {totalCaloriesConsumed} / {targets.targetCalories} kcal
              </span>
            </div>
            <h3 className="font-bold text-base text-white">Daily Meal Schedule</h3>
            <p className="text-xs text-slate-400 mt-1">
              Next: <strong className="text-slate-200">{nextMeal ? `${nextMeal.title} at ${nextMeal.scheduledTime}` : 'All Meals Completed!'}</strong>
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Protein: <strong className="text-emerald-400">{totalProteinConsumed}g</strong> / {targets.targetProteinGrams}g
            </span>
            <button
              onClick={() => onNavigateTab('diet')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition flex items-center space-x-1"
            >
              <span>Log Food</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Pillar 3: Hair Loss & Meds */}
        <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                <Pill className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold text-purple-400">
                {hairTaken} / {hairMeds.length} Taken
              </span>
            </div>
            <h3 className="font-bold text-base text-white">Hair Regrowth & Supplements</h3>
            <p className="text-xs text-slate-400 mt-1">
              Next: <strong className="text-slate-200">{nextMed ? `${nextMed.name} (${nextMed.scheduledTime})` : 'All Meds Taken!'}</strong>
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            {nextMed ? (
              <button
                onClick={() => onQuickToggleMed(nextMed.id)}
                className="px-2.5 py-1 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 text-xs font-semibold rounded-lg border border-purple-500/30 transition"
              >
                ✓ Take {nextMed.name.split('(')[0].trim().slice(0, 14)}
              </button>
            ) : (
              <span className="text-xs text-emerald-400 font-semibold">100% Protocol Complete</span>
            )}
            <button
              onClick={() => onNavigateTab('hair-meds')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Pillar 4: Water Hydration */}
        <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
                <Droplet className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold text-cyan-400">
                {Math.round((totalWaterConsumed / targets.targetWaterMl) * 100)}%
              </span>
            </div>
            <h3 className="font-bold text-base text-white">Hydration Tracker</h3>
            <p className="text-xs text-slate-400 mt-1">
              {totalWaterConsumed} ml drank / {targets.targetWaterMl} ml goal.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <div className="flex space-x-1">
              <button
                onClick={() => onQuickAddWater(250)}
                className="px-2 py-1 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 font-bold text-xs rounded-lg border border-cyan-500/30 transition"
                title="Quick drink 250ml glass"
              >
                +250ml
              </button>
              <button
                onClick={() => onQuickAddWater(500)}
                className="px-2 py-1 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 font-bold text-xs rounded-lg border border-cyan-500/30 transition"
                title="Quick drink 500ml bottle"
              >
                +500ml
              </button>
            </div>

            <button
              onClick={() => onNavigateTab('water')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition flex items-center space-x-1"
            >
              <span>Flask</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Immediate Today's Action Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Priority Actions for Today</h3>
          </div>
          <span className="text-xs text-slate-400">Personalized to your {profile.goal.replace('_', ' ')} goal</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {report.actionPlan.map((action, idx) => (
            <div
              key={idx}
              className="flex items-start space-x-3 bg-slate-950/70 border border-slate-800/80 p-3.5 rounded-2xl"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-snug">{action}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timed Notification Alarms Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">Today's Timed Notification Schedule</h3>
          </div>
          <span className="text-xs text-slate-400">Audio chimes & reminders trigger automatically</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Scheduled Meals */}
          {mealSlots.filter((m) => m.reminderEnabled).map((m) => (
            <div
              key={m.id}
              className={`p-3 rounded-2xl border text-xs flex items-center justify-between ${
                m.isCompleted
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Utensils className="w-4 h-4 text-amber-400" />
                <div>
                  <p className="font-semibold">{m.title}</p>
                  <span className="text-[10px] text-slate-500">Meal Reminder</span>
                </div>
              </div>
              <span className="font-mono font-bold text-white bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                {m.scheduledTime}
              </span>
            </div>
          ))}

          {/* Scheduled Meds */}
          {meds.filter((m) => m.reminderEnabled).map((m) => (
            <div
              key={m.id}
              className={`p-3 rounded-2xl border text-xs flex items-center justify-between ${
                m.takenToday
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Pill className="w-4 h-4 text-purple-400" />
                <div>
                  <p className="font-semibold truncate max-w-[150px]">{m.name}</p>
                  <span className="text-[10px] text-slate-500">{m.dosage}</span>
                </div>
              </div>
              <span className="font-mono font-bold text-white bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                {m.scheduledTime}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
