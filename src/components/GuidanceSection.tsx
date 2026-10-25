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
      <div className={`bg-gradient-to-br ${getScoreColor(report.healthScore)} bg-slate-900 border rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-950/60 border border-slate-700 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Goal Analyzer & Coach</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              {getTierLabel(report.healthScore)}
            </h2>
            <p className="text-slate-300 text-sm max-w-xl">
              {goalDescriptions[profile.goal]}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-300">
                Goal: <strong className="text-white capitalize">{profile.goal.replace('_', ' ')}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-300">
                Calorie Budget: <strong className="text-emerald-400">{targets.targetCalories} kcal</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-300">
                Protein Target: <strong className="text-cyan-400">{targets.targetProteinGrams}g</strong>
              </span>
            </div>
          </div>

          {/* Big Circular Score Gauge */}
          <div className="relative w-36 h-36 rounded-full bg-slate-950/90 border-4 border-slate-800 flex flex-col items-center justify-center shadow-2xl shrink-0">
            <span className="text-4xl font-black text-white">{report.healthScore}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Health Score</span>
            <div 
              className="absolute inset-0 rounded-full border-4 border-emerald-400 opacity-60 animate-pulse-ring pointer-events-none" 
            />
          </div>
        </div>
      </div>

      {/* 5 Core Pillars Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Pillar 1: Calorie Balance */}
        <div 
          onClick={() => onNavigateTab('diet')}
          className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 p-4 rounded-2xl cursor-pointer transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <Utensils className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-bold text-slate-400 uppercase">Calories</span>
          </div>
          <p className="text-lg font-black text-white capitalize">{report.calorieStatus.replace('_', ' ')}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {report.calorieDifference > 0 ? `+${report.calorieDifference} kcal` : `${report.calorieDifference} kcal`}
          </p>
        </div>

        {/* Pillar 2: Protein Adequacy */}
        <div 
          onClick={() => onNavigateTab('diet')}
          className="bg-slate-900 border border-slate-800 hover:border-cyan-500/40 p-4 rounded-2xl cursor-pointer transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <Flame className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] font-bold text-slate-400 uppercase">Protein</span>
          </div>
          <p className="text-lg font-black text-white">{report.proteinAdequacyPercent}%</p>
          <p className="text-xs text-slate-500 mt-0.5">Target: {targets.targetProteinGrams}g</p>
        </div>

        {/* Pillar 3: Hydration */}
        <div 
          onClick={() => onNavigateTab('water')}
          className="bg-slate-900 border border-slate-800 hover:border-blue-500/40 p-4 rounded-2xl cursor-pointer transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <Droplet className="w-4 h-4 text-blue-400" />
            <span className="text-[11px] font-bold text-slate-400 uppercase">Water</span>
          </div>
          <p className="text-lg font-black text-white">{report.hydrationPercent}%</p>
          <p className="text-xs text-slate-500 mt-0.5">Target: {targets.targetWaterMl}ml</p>
        </div>

        {/* Pillar 4: Hair Loss & Meds */}
        <div 
          onClick={() => onNavigateTab('hair-meds')}
          className="bg-slate-900 border border-slate-800 hover:border-purple-500/40 p-4 rounded-2xl cursor-pointer transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span className="text-[11px] font-bold text-slate-400 uppercase">Hair & Meds</span>
          </div>
          <p className="text-lg font-black text-white">{report.medicationAdherencePercent}%</p>
          <p className="text-xs text-slate-500 mt-0.5">Adherence Rate</p>
        </div>

        {/* Pillar 5: Gym Workout */}
        <div 
          onClick={() => onNavigateTab('workouts')}
          className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 p-4 rounded-2xl cursor-pointer transition group col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between mb-2">
            <Dumbbell className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] font-bold text-slate-400 uppercase">Workout</span>
          </div>
          <p className="text-lg font-black text-white">
            {report.workoutCompleted ? 'Logged 🔥' : 'Pending'}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">{report.workoutCompleted ? 'Stimulus achieved' : 'Tap to start'}</p>
        </div>
      </div>

      {/* Actionable Today's Protocol Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Coach Recommended Immediate Actions</h3>
          </div>
          <span className="text-xs text-slate-400">Complete these to achieve a 100% Health Score</span>
        </div>

        <div className="space-y-2.5">
          {report.actionPlan.map((action, idx) => (
            <div
              key={idx}
              className="flex items-start space-x-3 bg-slate-950/70 border border-slate-800/80 p-3.5 rounded-2xl"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-sm text-slate-200 font-medium leading-relaxed">{action}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Coach Analysis Feed */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-amber-400" />
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
                    ? 'bg-emerald-950/15 border-emerald-500/30 text-emerald-200'
                    : isWarning
                    ? 'bg-amber-950/15 border-amber-500/30 text-amber-200'
                    : 'bg-indigo-950/15 border-indigo-500/30 text-indigo-200'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                  {!isSuccess && !isWarning && <Lightbulb className="w-5 h-5 text-indigo-400" />}
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-950/60 border border-slate-800">
                      {insight.category.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-semibold capitalize">
                      {insight.type === 'success' ? 'Optimized' : insight.type === 'warning' ? 'Attention Needed' : 'Guidance Tip'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 leading-snug">{insight.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
