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
  CheckCircle2
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
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. Header Banner: BMI & Goal Progress */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Scale className="w-4 h-4" />
              <span>Biometric Goal Tracker</span>
            </span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
              BMI & Goal Weight Trajectory
            </h2>
          </div>
          <button
            onClick={onOpenProfile}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
          >
            Edit Goals
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Current Weight</span>
            <p className="text-lg font-black text-white mt-0.5">{profile.weightKg} kg</p>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-emerald-500/30">
            <span className="text-[10px] text-emerald-400 uppercase font-bold">Goal Weight</span>
            <p className="text-lg font-black text-emerald-400 mt-0.5">
              {profile.goalWeightKg || profile.systemRecommendedWeightKg || profile.weightKg} kg
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-cyan-400 uppercase font-bold">Current BMI</span>
            <p className="text-lg font-black text-cyan-400 mt-0.5">{profile.bmi || 23.5}</p>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Daily Health Score</span>
            <p className="text-lg font-black text-emerald-400 mt-0.5">{report.healthScore}%</p>
          </div>
        </div>
      </div>

      {/* 2. Hair Regrowth Protocol (Minoxidil, DHT blockers) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">Hair Regrowth Protocol</h3>
              <p className="text-xs text-slate-400">Minoxidil & DHT barrier for follicle stimulation</p>
            </div>
          </div>
          <span className="text-xs text-purple-400 font-semibold bg-purple-500/10 px-2.5 py-1 rounded-xl border border-purple-500/30">
            {hairMeds.filter(m => m.takenToday).length}/{hairMeds.length} Taken Today
          </span>
        </div>

        <div className="space-y-3">
          {hairMeds.map((med) => (
            <div
              key={med.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                med.takenToday
                  ? 'bg-purple-950/20 border-purple-500/40 text-purple-200'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start space-x-3.5 min-w-0">
                <button
                  onClick={() => onToggleMed(med.id)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition shrink-0 mt-0.5 ${
                    med.takenToday
                      ? 'bg-purple-500 text-white font-bold shadow-md shadow-purple-500/30'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <CheckCircle className="w-5 h-5" />
                </button>

                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className={`text-sm font-bold ${med.takenToday ? 'text-purple-300 line-through' : 'text-white'}`}>
                      {med.name}
                    </h4>
                    <span className="text-[10px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-300">
                      {med.dosage}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{med.purpose}</p>
                  <p className="text-[11px] text-purple-400/90 mt-1 italic">{med.instructions}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-mono text-xs font-bold text-slate-300 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                  {med.scheduledTime}
                </span>
                <div className="flex items-center justify-end space-x-1 text-amber-400 text-xs font-semibold mt-1">
                  <Flame className="w-3 h-3 fill-current" />
                  <span>{med.streakDays}d streak</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Fitness & Health Supplements */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <Pill className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">Fitness Supplements Stack</h3>
              <p className="text-xs text-slate-400">Creatine, Whey Protein, Vitamin D3 & ZMA</p>
            </div>
          </div>
          <span className="text-xs text-cyan-400 font-semibold bg-cyan-500/10 px-2.5 py-1 rounded-xl border border-cyan-500/30">
            {supplementMeds.filter(m => m.takenToday).length}/{supplementMeds.length} Taken
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {supplementMeds.map((med) => (
            <div
              key={med.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                med.takenToday
                  ? 'bg-cyan-950/20 border-cyan-500/30 text-cyan-200'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <button
                  onClick={() => onToggleMed(med.id)}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition shrink-0 ${
                    med.takenToday
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                </button>

                <div className="min-w-0">
                  <h4 className={`text-xs sm:text-sm font-bold truncate ${med.takenToday ? 'text-cyan-300 line-through' : 'text-white'}`}>
                    {med.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">{med.dosage} • {med.purpose}</p>
                </div>
              </div>

              <span className="font-mono text-xs font-bold text-slate-300 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 shrink-0">
                {med.scheduledTime}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Smart Coach Insights */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>Coach Action Recommendations</span>
        </h3>

        <div className="space-y-2">
          {report.actionPlan.map((action, idx) => (
            <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start space-x-2.5 text-xs text-slate-200">
              <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="leading-snug">{action}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
