import React from 'react';
import { 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  Lightbulb, 
  Flame, 
  ShieldCheck, 
  Droplet, 
  Dumbbell, 
  Utensils, 
  Target,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { DailyGuidanceReport, UserProfile } from '../types';
import { CalculatedTargets } from '../utils/calorieCalculator';

interface GuidanceSectionProps {
  report: DailyGuidanceReport;
  profile: UserProfile;
  targets: CalculatedTargets;
  onNavigateTab: (tab: string) => void;
}

export const GuidanceSection: React.FC<GuidanceSectionProps> = ({
  report,
  profile,
  targets,
  onNavigateTab,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/50 from-emerald-500/20 to-teal-500/10';
    if (score >= 65) return 'text-cyan-400 border-cyan-500/50 from-cyan-500/20 to-blue-500/10';
    if (score >= 50) return 'text-amber-400 border-amber-500/50 from-amber-500/20 to-orange-500/10';
    return 'text-rose-400 border-rose-500/50 from-rose-500/20 to-red-500/10';
  };

  const getTierLabel = (score: number) => {
    if (score >= 90) return 'Elite Anabolic & Regrowth Mastery';
    if (score >= 75) return 'High Performance Execution';
    if (score >= 55) return 'Consistent Progress Zone';
    return 'Action Needed for Alignment';
  };

  const goalDescriptions: Record<string, string> = {
    fat_loss: 'Targeting calibrated caloric deficit while preserving lean muscle mass and hair health.',
    lean_bulk: 'Targeting progressive caloric surplus with high nitrogen retention for maximum hypertrophy.',
    maintenance: 'Targeting energetic equilibrium, hormonal stability, and active recovery.',
    muscle_recomp: 'Simultaneous fat reduction and muscle remodeling via high protein and resistance training.',
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Health Score & Goal Alignment */}
      <div className={`bg-gradient-to-br ${getScoreColor(report.healthScore)} bg-white dark:bg-[#0d221a] border border-emerald-200 dark:border-emerald-800/60 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Goal Analyzer & Coach</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-emerald-50 tracking-tight">
              {getTierLabel(report.healthScore)}
            </h2>
            <p className="text-slate-600 dark:text-emerald-200/90 text-sm max-w-xl font-medium">
              {goalDescriptions[profile.goal]}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 text-xs font-medium">
              <span className="px-3 py-1 rounded-xl bg-white dark:bg-[#071510] border border-slate-200 dark:border-emerald-900/50 text-slate-700 dark:text-emerald-200 shadow-xs">
                Goal: <strong className="text-emerald-700 dark:text-emerald-300 capitalize">{profile.goal.replace('_', ' ')}</strong>
              </span>
              <span className="px-3 py-1 rounded-xl bg-white dark:bg-[#071510] border border-slate-200 dark:border-emerald-900/50 text-slate-700 dark:text-emerald-200 shadow-xs">
                Calorie Budget: <strong className="text-emerald-700 dark:text-emerald-400">{targets.targetCalories} kcal</strong>
              </span>
              <span className="px-3 py-1 rounded-xl bg-white dark:bg-[#071510] border border-slate-200 dark:border-emerald-900/50 text-slate-700 dark:text-emerald-200 shadow-xs">
                Protein Target: <strong className="text-teal-700 dark:text-teal-400">{targets.targetProteinGrams}g</strong>
              </span>
            </div>
          </div>

          {/* Big Circular Score Gauge */}
          <div className="relative w-36 h-36 rounded-full bg-white dark:bg-[#071510] border-4 border-emerald-500 dark:border-emerald-600 flex flex-col items-center justify-center shadow-lg shrink-0">
            <span className="text-4xl font-black text-slate-900 dark:text-emerald-50">{report.healthScore}</span>
            <span className="text-[10px] font-black text-slate-400 dark:text-emerald-400/80 uppercase tracking-wider">Health Score</span>
            <div 
              className="absolute inset-0 rounded-full border-4 border-emerald-400 opacity-40 animate-pulse pointer-events-none" 
            />
          </div>
        </div>
      </div>

      {/* 5 Core Pillars Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Pillar 1: Calorie Balance */}
        <div 
          onClick={() => onNavigateTab('diet')}
          className="bg-white dark:bg-[#0d221a] border border-emerald-100 dark:border-emerald-900/50 hover:border-emerald-400 p-4 rounded-2xl cursor-pointer transition shadow-xs group"
        >
          <div className="flex items-center justify-between mb-2">
            <Utensils className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-[11px] font-bold text-slate-400 dark:text-emerald-400/60 uppercase">Calories</span>
          </div>
          <p className="text-lg font-black text-slate-900 dark:text-white capitalize">{report.calorieStatus.replace('_', ' ')}</p>
          <p className="text-xs text-slate-500 dark:text-emerald-300/60 mt-0.5">
            {report.calorieDifference > 0 ? `+${report.calorieDifference} kcal` : `${report.calorieDifference} kcal`}
          </p>
        </div>

        {/* Pillar 2: Protein Adequacy */}
        <div 
          onClick={() => onNavigateTab('diet')}
          className="bg-white dark:bg-[#0d221a] border border-emerald-100 dark:border-emerald-900/50 hover:border-teal-400 p-4 rounded-2xl cursor-pointer transition shadow-xs group"
        >
          <div className="flex items-center justify-between mb-2">
            <Flame className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span className="text-[11px] font-bold text-slate-400 dark:text-emerald-400/60 uppercase">Protein</span>
          </div>
          <p className="text-lg font-black text-slate-900 dark:text-white">{report.proteinAdequacyPercent}%</p>
          <p className="text-xs text-slate-500 dark:text-emerald-300/60 mt-0.5">Target: {targets.targetProteinGrams}g</p>
        </div>

        {/* Pillar 3: Hydration */}
        <div 
          onClick={() => onNavigateTab('water')}
          className="bg-white dark:bg-[#0d221a] border border-emerald-100 dark:border-emerald-900/50 hover:border-cyan-400 p-4 rounded-2xl cursor-pointer transition shadow-xs group"
        >
          <div className="flex items-center justify-between mb-2">
            <Droplet className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span className="text-[11px] font-bold text-slate-400 dark:text-emerald-400/60 uppercase">Water</span>
          </div>
          <p className="text-lg font-black text-slate-900 dark:text-white">{report.hydrationPercent}%</p>
          <p className="text-xs text-slate-500 dark:text-emerald-300/60 mt-0.5">Target: {targets.targetWaterMl}ml</p>
        </div>

        {/* Pillar 4: Hair Loss & Meds */}
        <div 
          onClick={() => onNavigateTab('hair-meds')}
          className="bg-white dark:bg-[#0d221a] border border-emerald-100 dark:border-emerald-900/50 hover:border-purple-400 p-4 rounded-2xl cursor-pointer transition shadow-xs group"
        >
          <div className="flex items-center justify-between mb-2">
            <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-[11px] font-bold text-slate-400 dark:text-emerald-400/60 uppercase">Hair & Meds</span>
          </div>
          <p className="text-lg font-black text-slate-900 dark:text-white">{report.medicationAdherencePercent}%</p>
          <p className="text-xs text-slate-500 dark:text-emerald-300/60 mt-0.5">Adherence Rate</p>
        </div>

        {/* Pillar 5: Gym Workout */}
        <div 
          onClick={() => onNavigateTab('workouts')}
          className="bg-white dark:bg-[#0d221a] border border-emerald-100 dark:border-emerald-900/50 hover:border-amber-400 p-4 rounded-2xl cursor-pointer transition shadow-xs group col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between mb-2">
            <Dumbbell className="w-4 h-4 text-amber-500" />
            <span className="text-[11px] font-bold text-slate-400 dark:text-emerald-400/60 uppercase">Workout</span>
          </div>
          <p className="text-lg font-black text-slate-900 dark:text-white">
            {report.workoutCompleted ? 'Logged 🔥' : 'Pending'}
          </p>
          <p className="text-xs text-slate-500 dark:text-emerald-300/60 mt-0.5">{report.workoutCompleted ? 'Stimulus achieved' : 'Tap to start'}</p>
        </div>
      </div>

      {/* Actionable Today's Protocol Checklist */}
      <div className="bg-white dark:bg-[#0d221a] border border-emerald-100 dark:border-emerald-900/50 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-lg font-black text-slate-900 dark:text-emerald-50">Coach Recommended Immediate Actions</h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-emerald-300/60 font-medium">Complete these to achieve a 100% Health Score</span>
        </div>

        <div className="space-y-2.5">
          {report.actionPlan.map((action, idx) => (
            <div
              key={idx}
              className="flex items-start space-x-3 bg-slate-50 dark:bg-[#071510] border border-slate-200 dark:border-emerald-900/40 p-3.5 rounded-2xl"
            >
              <div className="w-6 h-6 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-sm text-slate-800 dark:text-emerald-100 font-medium leading-relaxed">{action}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Coach Analysis Feed */}
      <div className="bg-white dark:bg-[#0d221a] border border-emerald-100 dark:border-emerald-900/50 rounded-3xl p-6 space-y-4 shadow-sm">
        <h3 className="text-lg font-black text-slate-900 dark:text-emerald-50 flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <span>Biometric & Regimen Analysis Feed</span>
        </h3>

        <div className="space-y-3">
          {report.insights.map((insight, idx) => {
            const isSuccess = insight.type === 'success';
            const isWarning = insight.type === 'warning';

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border flex items-start space-x-3.5 transition ${
                  isSuccess
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50 text-emerald-950 dark:text-emerald-200'
                    : isWarning
                    ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/50 text-amber-950 dark:text-amber-200'
                    : 'bg-teal-50/60 dark:bg-teal-950/20 border-teal-200 dark:border-teal-800/50 text-teal-950 dark:text-teal-200'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                  {isWarning && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                  {!isSuccess && !isWarning && <Lightbulb className="w-5 h-5 text-teal-600 dark:text-teal-400" />}
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white dark:bg-[#071510] border border-slate-200 dark:border-emerald-900/50 shadow-xs">
                      {insight.category.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-bold capitalize">
                      {insight.type === 'success' ? 'Optimized' : insight.type === 'warning' ? 'Attention Needed' : 'Guidance Tip'}
                    </span>
                  </div>
                  <p className="text-sm font-medium leading-snug">{insight.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
