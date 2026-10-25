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
  Zap
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
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Header Banner: BMI & Goal Progress */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center space-x-1.5">
              <Scale className="w-3.5 h-3.5" />
              <span>Biometric Performance Protocol</span>
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
              BMI & Goal Weight Trajectory
            </h2>
          </div>
          <button
            onClick={onOpenProfile}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl border border-zinc-700 transition"
          >
            Adjust Biometrics
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
          <div className="bg-zinc-950/80 p-3.5 rounded-2xl border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase font-sans font-semibold">Current Weight</span>
            <p className="text-xl font-bold text-white mt-0.5">{profile.weightKg} kg</p>
          </div>

          <div className="bg-zinc-950/80 p-3.5 rounded-2xl border border-emerald-500/30">
            <span className="text-[10px] text-emerald-400 uppercase font-sans font-bold">Goal Target</span>
            <p className="text-xl font-bold text-emerald-400 mt-0.5">
              {profile.goalWeightKg || profile.systemRecommendedWeightKg || profile.weightKg} kg
            </p>
          </div>

          <div className="bg-zinc-950/80 p-3.5 rounded-2xl border border-zinc-800">
            <span className="text-[10px] text-cyan-400 uppercase font-sans font-bold">BMI Metric</span>
            <p className="text-xl font-bold text-cyan-400 mt-0.5">{profile.bmi || 23.5}</p>
          </div>

          <div className="bg-zinc-950/80 p-3.5 rounded-2xl border border-zinc-800">
            <span className="text-[10px] text-zinc-400 uppercase font-sans font-semibold">Daily Vitality</span>
            <p className="text-xl font-bold text-emerald-400 mt-0.5">{report.healthScore}%</p>
          </div>
        </div>
      </div>

      {/* 2. Hair Regrowth Protocol (Minoxidil, DHT blockers) */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Hair Regrowth Protocol</h3>
              <p className="text-xs text-zinc-400">Minoxidil 5% & DHT receptor inhibition schedule</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-xl border border-purple-500/30">
            {hairMeds.filter(m => m.takenToday).length}/{hairMeds.length} Completed
          </span>
        </div>

        <div className="space-y-3">
          {hairMeds.map((med) => (
            <div
              key={med.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                med.takenToday
                  ? 'bg-zinc-950/90 border-purple-500/40 text-purple-200'
                  : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-start space-x-3.5 min-w-0">
                <button
                  onClick={() => onToggleMed(med.id)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition shrink-0 mt-0.5 ${
                    med.takenToday
                      ? 'bg-purple-500 text-white font-bold shadow-md shadow-purple-500/30'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700'
                  }`}
                >
                  <Check className={`w-4 h-4 ${med.takenToday ? 'stroke-[3]' : ''}`} />
                </button>

                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className={`text-sm font-bold ${med.takenToday ? 'text-zinc-400 line-through' : 'text-white'}`}>
                      {med.name}
                    </h4>
                    <span className="text-[10px] bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded font-mono text-zinc-300">
                      {med.dosage}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">{med.purpose}</p>
                  <p className="text-[11px] text-purple-400 mt-1 italic">{med.instructions}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-mono text-xs font-bold text-zinc-300 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
                  {med.scheduledTime}
                </span>
                <div className="flex items-center justify-end space-x-1 text-amber-400 text-xs font-semibold mt-1 font-mono">
                  <Flame className="w-3 h-3 fill-current" />
                  <span>{med.streakDays}d streak</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Fitness & Health Supplements */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Fitness Supplements Stack</h3>
              <p className="text-xs text-zinc-400">Creatine Monohydrate, Whey Protein, Vitamin D3 & ZMA</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-xl border border-cyan-500/30">
            {supplementMeds.filter(m => m.takenToday).length}/{supplementMeds.length} Taken
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {supplementMeds.map((med) => (
            <div
              key={med.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                med.takenToday
                  ? 'bg-zinc-950/90 border-cyan-500/30 text-cyan-200'
                  : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <button
                  onClick={() => onToggleMed(med.id)}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition shrink-0 ${
                    med.takenToday
                      ? 'bg-cyan-500 text-zinc-950 font-bold shadow-md shadow-cyan-500/30'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700'
                  }`}
                >
                  <Check className={`w-3.5 h-3.5 ${med.takenToday ? 'stroke-[3]' : ''}`} />
                </button>

                <div className="min-w-0">
                  <h4 className={`text-xs sm:text-sm font-bold truncate ${med.takenToday ? 'text-zinc-400 line-through' : 'text-white'}`}>
                    {med.name}
                  </h4>
                  <p className="text-[11px] text-zinc-400 truncate">{med.dosage} • {med.purpose}</p>
                </div>
              </div>

              <span className="font-mono text-xs font-bold text-zinc-300 bg-zinc-900 px-2 py-1 rounded-lg border border-zinc-800 shrink-0">
                {med.scheduledTime}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Smart Coach Insights */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-3">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>Coach Action Recommendations</span>
        </h3>

        <div className="space-y-2">
          {report.actionPlan.map((action, idx) => (
            <div key={idx} className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-start space-x-2.5 text-xs text-zinc-200">
              <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0 mt-0.5 font-mono">
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
