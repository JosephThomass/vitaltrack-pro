import React from 'react';
import { 
  ShieldCheck, 
  Pill, 
  Flame, 
  CheckCircle, 
  Clock, 
  Sparkles, 
  Scale, 
  Lightbulb, 
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Check,
  Zap,
  Leaf
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DailyGuidanceReport, MedicineOrSupplement, UserProfile } from '../types';
import { CalculatedTargets } from '../utils/calorieCalculator';
import { soundManager } from '../utils/audio';

interface RegimenSectionProps {
  profile: UserProfile;
  targets: CalculatedTargets;
  report: DailyGuidanceReport;
  meds: MedicineOrSupplement[];
  onToggleMed: (medId: string) => void;
  onOpenProfile: () => void;
}

export const RegimenSection: React.FC<RegimenSectionProps> = ({
  profile,
  targets,
  report,
  meds,
  onToggleMed,
  onOpenProfile,
}) => {
  const hairMeds = meds.filter((m) => m.category === 'hair_loss');
  const supplementMeds = meds.filter((m) => m.category === 'supplement');

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* 1. Header Banner: BMI & Goal Progress */}
      <div className="bg-white dark:bg-[#0d221a] text-slate-900 dark:text-emerald-50 border border-emerald-100 dark:border-emerald-900/50 rounded-3xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Scale className="w-4 h-4" />
              <span>Biometric Goal Tracker</span>
            </span>
            <h2 className="text-2xl font-black tracking-tight mt-1">
              BMI & Target Weight Trajectory
            </h2>
          </div>
          <button
            onClick={onOpenProfile}
            className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-[#071510] dark:hover:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-xs font-bold rounded-xl border border-emerald-200 dark:border-emerald-800/60 transition shadow-xs"
          >
            Adjust Goals
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-50 dark:bg-[#071510] p-3.5 rounded-2xl border border-slate-200 dark:border-emerald-900/50">
            <span className="text-[10px] text-slate-500 dark:text-emerald-300/60 uppercase font-bold">Current Weight</span>
            <p className="text-xl font-black mt-0.5">{profile.weightKg} kg</p>
          </div>

          <div className="bg-emerald-50/70 dark:bg-[#071510] p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-700">
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-bold">Target Goal</span>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {profile.goalWeightKg || profile.systemRecommendedWeightKg || profile.weightKg} kg
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-[#071510] p-3.5 rounded-2xl border border-slate-200 dark:border-emerald-900/50">
            <span className="text-[10px] text-teal-600 dark:text-teal-400 uppercase font-bold">Current BMI</span>
            <p className="text-xl font-black text-teal-600 dark:text-teal-400 mt-0.5">{profile.bmi || 23.5}</p>
          </div>

          <div className="bg-slate-50 dark:bg-[#071510] p-3.5 rounded-2xl border border-slate-200 dark:border-emerald-900/50">
            <span className="text-[10px] text-cyan-600 dark:text-cyan-400 uppercase font-bold">Health Score</span>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{report.healthScore}%</p>
          </div>
        </div>
      </div>

      {/* 2. Hair Regrowth Protocol (Minoxidil, DHT blockers) */}
      <div className="bg-white dark:bg-[#0d221a] text-slate-900 dark:text-emerald-50 border border-emerald-100 dark:border-emerald-900/50 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-200 dark:border-purple-800/40">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Hair Regrowth Routine</h3>
              <p className="text-xs text-slate-500 dark:text-emerald-300/60">Minoxidil & DHT barrier for hair follicle stimulation</p>
            </div>
          </div>
          <span className="text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 px-3 py-1 rounded-xl border border-purple-200 dark:border-purple-800/40">
            {hairMeds.filter(m => m.takenToday).length}/{hairMeds.length} Taken Today
          </span>
        </div>

        <div className="space-y-3">
          {hairMeds.map((med) => (
            <div
              key={med.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                med.takenToday
                  ? 'bg-purple-50/50 border-purple-200 dark:bg-purple-950/20 dark:border-purple-800/40'
                  : 'bg-slate-50 border-slate-200 dark:bg-[#071510] dark:border-emerald-900/40 hover:border-purple-300'
              }`}
            >
              <div className="flex items-start space-x-3.5 min-w-0">
                <button
                  onClick={() => onToggleMed(med.id)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition shrink-0 mt-0.5 ${
                    med.takenToday
                      ? 'bg-purple-500 text-white font-bold shadow-md shadow-purple-500/30'
                      : 'bg-white dark:bg-[#0d221a] text-slate-400 hover:text-purple-600 border border-slate-200 dark:border-emerald-900/50 shadow-xs'
                  }`}
                >
                  <Check className={`w-4 h-4 ${med.takenToday ? 'stroke-[3]' : ''}`} />
                </button>

                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className={`text-sm font-bold ${med.takenToday ? 'line-through opacity-70' : ''}`}>
                      {med.name}
                    </h4>
                    <span className="text-[10px] bg-white dark:bg-[#0d221a] border border-slate-200 dark:border-emerald-900/40 px-2 py-0.5 rounded font-mono text-slate-600 dark:text-emerald-200">
                      {med.dosage}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-emerald-300/60 mt-0.5">{med.purpose}</p>
                  <p className="text-[11px] text-purple-600 dark:text-purple-300 mt-1 italic">{med.instructions}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-mono text-xs font-bold text-slate-700 dark:text-emerald-200 bg-white dark:bg-[#0d221a] px-2.5 py-1 rounded-lg border border-slate-200 dark:border-emerald-900/50 shadow-xs">
                  {med.scheduledTime}
                </span>
                <div className="flex items-center justify-end space-x-1 text-amber-500 text-xs font-bold mt-1">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>{med.streakDays}d streak</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Fitness & Health Supplements */}
      <div className="bg-white dark:bg-[#0d221a] text-slate-900 dark:text-emerald-50 border border-emerald-100 dark:border-emerald-900/50 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-200 dark:border-teal-800/40">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Fitness Supplements Stack</h3>
              <p className="text-xs text-slate-500 dark:text-emerald-300/60">Creatine, Whey Protein, Vitamin D3 & ZMA</p>
            </div>
          </div>
          <span className="text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 px-3 py-1 rounded-xl border border-teal-200 dark:border-teal-800/40">
            {supplementMeds.filter(m => m.takenToday).length}/{supplementMeds.length} Taken
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {supplementMeds.map((med) => (
            <div
              key={med.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                med.takenToday
                  ? 'bg-teal-50/50 border-teal-200 dark:bg-teal-950/20 dark:border-teal-800/40'
                  : 'bg-slate-50 border-slate-200 dark:bg-[#071510] dark:border-emerald-900/40 hover:border-teal-300'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <button
                  onClick={() => onToggleMed(med.id)}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition shrink-0 ${
                    med.takenToday
                      ? 'bg-teal-500 text-white font-bold shadow-md shadow-teal-500/30'
                      : 'bg-white dark:bg-[#0d221a] text-slate-400 hover:text-teal-600 border border-slate-200 dark:border-emerald-900/50 shadow-xs'
                  }`}
                >
                  <Check className={`w-3.5 h-3.5 ${med.takenToday ? 'stroke-[3]' : ''}`} />
                </button>

                <div className="min-w-0">
                  <h4 className={`text-xs sm:text-sm font-bold truncate ${med.takenToday ? 'line-through opacity-70' : ''}`}>
                    {med.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-emerald-300/60 truncate">{med.dosage} • {med.purpose}</p>
                </div>
              </div>

              <span className="font-mono text-xs font-bold text-slate-700 dark:text-emerald-200 bg-white dark:bg-[#0d221a] px-2 py-1 rounded-lg border border-slate-200 dark:border-emerald-900/50 shadow-xs shrink-0">
                {med.scheduledTime}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Smart Coach Insights */}
      <div className="bg-white dark:bg-[#0d221a] text-slate-900 dark:text-emerald-50 border border-emerald-100 dark:border-emerald-900/50 rounded-3xl p-6 sm:p-7 shadow-sm space-y-3">
        <h3 className="text-base font-bold flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <span>Coach Daily Advice</span>
        </h3>

        <div className="space-y-2.5">
          {report.actionPlan.map((action, idx) => (
            <div key={idx} className="p-3.5 bg-slate-50 dark:bg-[#071510] rounded-2xl border border-slate-200 dark:border-emerald-900/40 flex items-start space-x-3 text-xs leading-relaxed">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p>{action}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
