import React, { useState } from 'react';
import { 
  Droplet, 
  Plus, 
  RotateCcw, 
  Clock, 
  Bell, 
  Sparkles, 
  Trash2, 
  Volume2, 
  CheckCircle2,
  Waves
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WaterLog } from '../types';
import { soundManager } from '../utils/audio';
import { notificationService } from '../utils/notifications';

interface WaterSectionProps {
  waterLogs: WaterLog[];
  onAddWater: (amountMl: number) => void;
  onRemoveLog: (id: string) => void;
  onResetToday: () => void;
  targetWaterMl: number;
}

export const WaterSection: React.FC<WaterSectionProps> = ({
  waterLogs,
  onAddWater,
  onRemoveLog,
  onResetToday,
  targetWaterMl,
}) => {
  const [customMl, setCustomMl] = useState<number>(300);
  const [reminderIntervalMin, setReminderIntervalMin] = useState<number>(60);
  const [isReminderActive, setIsReminderActive] = useState<boolean>(true);

  const totalDrankMl = waterLogs.reduce((sum, log) => sum + log.amountMl, 0);
  const percentComplete = Math.min(100, Math.round((totalDrankMl / targetWaterMl) * 100));
  const remainingMl = Math.max(0, targetWaterMl - totalDrankMl);

  const handleLog = (amount: number) => {
    onAddWater(amount);
    soundManager.playWaterDrop();

    if (totalDrankMl + amount >= targetWaterMl && totalDrankMl < targetWaterMl) {
      soundManager.playChime('success');
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  const handleTestReminder = () => {
    soundManager.playWaterDrop();
    notificationService.trigger(
      'Hydration Reminder: Time to Drink Water! 💧',
      'Take 250ml of fresh water to keep your body fueled and joints cushioned.',
      'water'
    );
  };

  return (
    <div className="space-y-6">
      {/* Visual Water Tank & Daily Goal Banner */}
      <div className="bg-gradient-to-br from-cyan-950/70 via-slate-900 to-blue-950 border border-cyan-900/50 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left: Info & Progress */}
          <div className="space-y-4 max-w-xl text-center lg:text-left">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider mb-2">
                <Droplet className="w-3.5 h-3.5" />
                <span>Hydration Protocol</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Stay Hydrated, Lift Strong</h2>
              <p className="text-slate-300 text-sm mt-1">
                Adequate water intake optimizes nutrient delivery, prevents muscle cramping, reduces DHT concentration in sebum, and keeps energy peak.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 text-center">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Target</span>
                <p className="text-xl font-black text-white mt-0.5">{targetWaterMl} <span className="text-xs text-slate-500">ml</span></p>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 text-center">
                <span className="text-[11px] font-semibold text-cyan-400 uppercase">Drank Today</span>
                <p className="text-xl font-black text-cyan-400 mt-0.5">{totalDrankMl} <span className="text-xs text-slate-500">ml</span></p>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 text-center">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Remaining</span>
                <p className="text-xl font-black text-slate-300 mt-0.5">{remainingMl} <span className="text-xs text-slate-500">ml</span></p>
              </div>
            </div>

            {/* Reminder Setting Pill */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-400">Repeat every:</span>
                <select
                  value={reminderIntervalMin}
                  onChange={(e) => setReminderIntervalMin(parseInt(e.target.value))}
                  className="bg-transparent text-cyan-400 font-bold focus:outline-none cursor-pointer"
                >
                  <option value={45} className="bg-slate-900 text-white">45 mins</option>
                  <option value={60} className="bg-slate-900 text-white">60 mins (1 hr)</option>
                  <option value={90} className="bg-slate-900 text-white">90 mins (1.5 hrs)</option>
                  <option value={120} className="bg-slate-900 text-white">120 mins (2 hrs)</option>
                </select>
              </div>

              <button
                onClick={handleTestReminder}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Test Chime</span>
              </button>
            </div>
          </div>

          {/* Right: Interactive Water Flask Visualizer */}
          <div className="flex flex-col items-center">
            <div className="relative w-36 h-60 rounded-3xl border-4 border-cyan-500/50 bg-slate-950/80 p-1.5 shadow-2xl overflow-hidden flex flex-col justify-end">
              {/* Measurement lines */}
              <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between py-4 px-2 opacity-40">
                <div className="border-b border-cyan-300/40 text-[9px] text-cyan-300 text-right">100%</div>
                <div className="border-b border-cyan-300/40 text-[9px] text-cyan-300 text-right">75%</div>
                <div className="border-b border-cyan-300/40 text-[9px] text-cyan-300 text-right">50%</div>
                <div className="border-b border-cyan-300/40 text-[9px] text-cyan-300 text-right">25%</div>
              </div>

              {/* Water Level Fill with Wave Effect */}
              <div 
                className="w-full bg-gradient-to-t from-cyan-600 via-teal-500 to-cyan-400 rounded-2xl relative transition-all duration-700 ease-out flex items-center justify-center overflow-hidden"
                style={{ height: `${Math.max(8, percentComplete)}%` }}
              >
                <div className="absolute -top-3 left-0 right-0 h-6 bg-cyan-300/30 rounded-full blur-sm" />
                <span className="relative z-30 font-black text-xl text-slate-950 drop-shadow-sm">
                  {percentComplete}%
                </span>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-400 mt-2">
              {totalDrankMl} / {targetWaterMl} ml ({percentComplete}%)
            </span>
          </div>
        </div>
      </div>

      {/* Quick Add Presets Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Glass of Water', amount: 250, desc: 'Small cup / 250ml' },
          { label: 'Gym Bottle', amount: 500, desc: 'Half liter / 500ml' },
          { label: 'Protein Shaker', amount: 750, desc: 'Standard shaker / 750ml' },
          { label: 'Hydration Jug', amount: 1000, desc: 'Full liter / 1000ml' },
        ].map((item) => (
          <button
            key={item.amount}
            onClick={() => handleLog(item.amount)}
            className="group bg-slate-900 border border-slate-800 hover:border-cyan-500/50 p-4 rounded-2xl text-left transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-cyan-500/10"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 group-hover:bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm mb-3 border border-cyan-500/20 transition">
              +{item.amount}
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-cyan-300 transition">{item.label}</h4>
            <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
          </button>
        ))}
      </div>

      {/* Custom Amount Entry */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Droplet className="w-5 h-5 text-cyan-400" />
          <div>
            <h4 className="text-sm font-bold text-white">Custom Drink Amount</h4>
            <p className="text-xs text-slate-400">Log custom cup or bottle volume</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <input
            type="number"
            min="50"
            step="50"
            value={customMl}
            onChange={(e) => setCustomMl(Math.max(10, parseInt(e.target.value) || 0))}
            className="w-28 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white text-center focus:outline-none focus:border-cyan-500"
          />
          <span className="text-xs text-slate-400">ml</span>
          <button
            onClick={() => handleLog(customMl)}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 font-bold text-slate-950 text-sm shadow-md transition"
          >
            + Log Water
          </button>
        </div>
      </div>

      {/* History Log */}
      {waterLogs.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-white">Today's Hydration Entries ({waterLogs.length})</h4>
            <button
              onClick={onResetToday}
              className="flex items-center space-x-1 text-xs text-rose-400 hover:text-rose-300 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Daily Water</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {waterLogs.map((log) => (
              <div
                key={log.id}
                className="bg-slate-950 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-cyan-400">+{log.amountMl} ml</span>
                  <span className="block text-[10px] text-slate-500">{log.timestamp}</span>
                </div>
                <button
                  onClick={() => onRemoveLog(log.id)}
                  className="text-slate-600 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
