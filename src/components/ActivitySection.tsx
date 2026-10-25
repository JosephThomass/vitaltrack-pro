import React, { useState } from 'react';
import { 
  Activity, 
  Plus, 
  Flame, 
  Clock, 
  Footprints, 
  Bike, 
  Moon, 
  Briefcase, 
  HeartPulse, 
  Trash2,
  Sparkles
} from 'lucide-react';
import { OtherActivity } from '../types';
import { soundManager } from '../utils/audio';

interface ActivitySectionProps {
  activities: OtherActivity[];
  onAddActivity: (activity: OtherActivity) => void;
  onRemoveActivity: (id: string) => void;
  weightKg: number;
}

export const ActivitySection: React.FC<ActivitySectionProps> = ({
  activities,
  onAddActivity,
  onRemoveActivity,
  weightKg,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<{
    title: string;
    category: OtherActivity['category'];
    durationMinutes: number;
    intensity: 'low' | 'moderate' | 'high';
    notes: string;
  }>({
    title: '',
    category: 'walking',
    durationMinutes: 30,
    intensity: 'moderate',
    notes: '',
  });

  // MET values for standard activities
  const MET_MAP: Record<OtherActivity['category'], { low: number; moderate: number; high: number }> = {
    running: { low: 7.0, moderate: 9.8, high: 12.0 },
    walking: { low: 2.8, moderate: 3.5, high: 4.5 },
    cycling: { low: 4.0, moderate: 6.8, high: 9.0 },
    swimming: { low: 5.0, moderate: 7.0, high: 9.5 },
    yoga: { low: 2.0, moderate: 3.0, high: 4.0 },
    sports: { low: 4.5, moderate: 7.0, high: 9.0 },
    desk_work: { low: 1.2, moderate: 1.5, high: 1.8 },
    sleep: { low: 0.9, moderate: 0.9, high: 0.9 },
    other: { low: 3.0, moderate: 5.0, high: 7.0 },
  };

  const calculateCalories = (category: OtherActivity['category'], durationMins: number, intensity: 'low' | 'moderate' | 'high') => {
    const met = MET_MAP[category]?.[intensity] || 3.5;
    // Formula: Calories = (MET * 3.5 * weightKg) / 200 * minutes
    return Math.round((met * 3.5 * weightKg) / 200 * durationMins);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = form.title || form.category.toUpperCase().replace('_', ' ');
    const calories = calculateCalories(form.category, form.durationMinutes, form.intensity);

    const newActivity: OtherActivity = {
      id: `act-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title,
      category: form.category,
      durationMinutes: form.durationMinutes,
      intensity: form.intensity,
      caloriesBurned: calories,
      notes: form.notes,
      loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    onAddActivity(newActivity);
    soundManager.playChime('gentle');
    setShowModal(false);
    setForm({
      title: '',
      category: 'walking',
      durationMinutes: 30,
      intensity: 'moderate',
      notes: '',
    });
  };

  const totalCaloriesBurned = activities.reduce((sum, a) => sum + a.caloriesBurned, 0);
  const totalMinutes = activities.reduce((sum, a) => sum + a.durationMinutes, 0);

  const presets = [
    { label: 'Brisk Walk (30 min)', category: 'walking' as const, mins: 30, intensity: 'moderate' as const },
    { label: 'Outdoor Running (20 min)', category: 'running' as const, mins: 20, intensity: 'high' as const },
    { label: 'Bicycle Ride (45 min)', category: 'cycling' as const, mins: 45, intensity: 'moderate' as const },
    { label: 'Yoga & Mobility (25 min)', category: 'yoga' as const, mins: 25, intensity: 'low' as const },
    { label: 'Desk Focus Block (120 min)', category: 'desk_work' as const, mins: 120, intensity: 'low' as const },
    { label: 'Sleep & Recovery (8 hrs)', category: 'sleep' as const, mins: 480, intensity: 'low' as const },
  ];

  const handleQuickPreset = (preset: typeof presets[0]) => {
    const calories = calculateCalories(preset.category, preset.mins, preset.intensity);
    const newActivity: OtherActivity = {
      id: `act-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: preset.label,
      category: preset.category,
      durationMinutes: preset.mins,
      intensity: preset.intensity,
      caloriesBurned: calories,
      loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    onAddActivity(newActivity);
    soundManager.playChime('gentle');
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white dark:bg-[#0d221a] border border-emerald-100 dark:border-emerald-900/50 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-wider uppercase mb-1">
            <Activity className="w-4 h-4" />
            <span>Lifestyle & Active Energy Expenditure</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-emerald-50 tracking-tight">Daily Activity & Cardio Log</h2>
          <p className="text-slate-500 dark:text-emerald-300/70 text-sm mt-0.5">
            Log steps, cardio, yoga, sleep, or desk work to automatically calculate non-exercise physical activity (NEAT).
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-slate-50 dark:bg-[#071510] px-4 py-2 rounded-2xl border border-slate-200 dark:border-emerald-900/50 text-right">
            <span className="text-[11px] text-slate-400 dark:text-emerald-400/60 uppercase font-bold">Active Burn</span>
            <div className="flex items-center space-x-1 text-amber-500 font-black text-lg">
              <Flame className="w-4 h-4 fill-current" />
              <span>{totalCaloriesBurned} kcal</span>
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Log Activity</span>
          </button>
        </div>
      </div>

      {/* Quick 1-Click Presets */}
      <div>
        <h4 className="text-xs font-bold text-slate-500 dark:text-emerald-300/70 uppercase tracking-wider mb-2.5">Quick Activity Presets</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickPreset(p)}
              className="bg-white dark:bg-[#0d221a] border border-emerald-100 dark:border-emerald-900/50 hover:border-emerald-400 p-3.5 rounded-2xl text-left transition hover:shadow-xs group"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center font-black text-xs mb-2">
                +{p.mins}m
              </div>
              <p className="font-bold text-slate-800 dark:text-white text-xs leading-snug group-hover:text-emerald-600 transition">{p.label.split('(')[0].trim()}</p>
              <span className="text-[10px] text-slate-400 dark:text-emerald-300/60 font-semibold">~{calculateCalories(p.category, p.mins, p.intensity)} kcal</span>
            </button>
          ))}
        </div>
      </div>

      {/* Logged Activities Timeline */}
      <div className="bg-white dark:bg-[#0d221a] border border-emerald-100 dark:border-emerald-900/50 rounded-3xl p-6 shadow-sm">
        <h3 className="text-base font-black text-slate-900 dark:text-emerald-50 mb-4 flex items-center space-x-2">
          <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Timeline of Today's Logged Activities ({activities.length})</span>
        </h3>

        {activities.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-200 dark:border-emerald-900/40 rounded-2xl text-slate-400 dark:text-emerald-300/50 text-sm">
            No additional activities logged today yet. Click &quot;Log Activity&quot; or choose a quick preset above.
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((act) => (
              <div
                key={act.id}
                className="bg-slate-50 dark:bg-[#071510] border border-slate-200 dark:border-emerald-900/40 rounded-2xl p-4 flex items-center justify-between hover:border-emerald-300 transition"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#0d221a] border border-slate-200 dark:border-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs">
                    {act.category === 'walking' && <Footprints className="w-5 h-5" />}
                    {act.category === 'cycling' && <Bike className="w-5 h-5" />}
                    {act.category === 'sleep' && <Moon className="w-5 h-5" />}
                    {act.category === 'desk_work' && <Briefcase className="w-5 h-5" />}
                    {!['walking', 'cycling', 'sleep', 'desk_work'].includes(act.category) && <Activity className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{act.title}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 capitalize">
                        {act.intensity} intensity
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-emerald-300/60 mt-0.5">
                      <span>Logged at {act.loggedAt}</span>
                      <span>•</span>
                      <span>{act.durationMinutes} minutes</span>
                      {act.notes && (
                        <>
                          <span>•</span>
                          <span className="italic text-slate-400 truncate max-w-xs">{act.notes}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-amber-500 font-black text-sm">
                      <Flame className="w-4 h-4 fill-current" />
                      <span>{act.caloriesBurned} kcal</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Expenditure</span>
                  </div>

                  <button
                    onClick={() => onRemoveActivity(act.id)}
                    className="text-slate-400 hover:text-rose-500 transition p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Custom Activity Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d221a] text-slate-900 dark:text-emerald-50 border border-emerald-200 dark:border-emerald-900/60 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-emerald-900/40">
              <h3 className="text-lg font-black">Log Daily Activity</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 py-4 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-emerald-300/70 mb-1 font-bold">Activity Title / Name</label>
                <input
                  type="text"
                  placeholder="e.g. Evening Jog, 10,000 Steps, HIIT Circuit"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#071510] border border-slate-200 dark:border-emerald-900/60 rounded-xl px-3 py-2 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-emerald-300/70 mb-1 font-bold">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as OtherActivity['category'] })}
                    className="w-full bg-slate-50 dark:bg-[#071510] border border-slate-200 dark:border-emerald-900/60 rounded-xl px-3 py-2 text-slate-900 dark:text-white text-xs focus:outline-none font-bold"
                  >
                    <option value="walking">Walking / Steps</option>
                    <option value="running">Running / Jogging</option>
                    <option value="cycling">Cycling / Biking</option>
                    <option value="swimming">Swimming</option>
                    <option value="yoga">Yoga / Stretching</option>
                    <option value="sports">Sports / Martial Arts</option>
                    <option value="desk_work">Desk Work / Office</option>
                    <option value="sleep">Sleep & Recovery</option>
                    <option value="other">Other Activity</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-emerald-300/70 mb-1 font-bold">Duration (Minutes)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={form.durationMinutes}
                    onChange={(e) => setForm({ ...form, durationMinutes: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-50 dark:bg-[#071510] border border-slate-200 dark:border-emerald-900/60 rounded-xl px-3 py-2 text-slate-900 dark:text-white text-xs focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-emerald-300/70 mb-1 font-bold">Intensity Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'moderate', 'high'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setForm({ ...form, intensity: lvl })}
                      className={`py-2 rounded-xl text-xs font-bold capitalize transition ${
                        form.intensity === lvl
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-[#071510] border border-slate-200 dark:border-emerald-900/40 text-slate-600 dark:text-emerald-300/60 hover:bg-slate-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-emerald-300/70 mb-1 font-bold">Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="Distance, heart rate, how it felt"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#071510] border border-slate-200 dark:border-emerald-900/60 rounded-xl px-3 py-2 text-slate-900 dark:text-white text-xs focus:outline-none font-medium"
                />
              </div>

              <div className="bg-slate-50 dark:bg-[#071510] p-3 rounded-2xl border border-slate-200 dark:border-emerald-900/40 flex items-center justify-between">
                <span className="text-slate-600 dark:text-emerald-300/70 font-semibold">Estimated Calorie Burn:</span>
                <span className="text-base font-black text-amber-500">
                  ~{calculateCalories(form.category, form.durationMinutes, form.intensity)} kcal
                </span>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-[#071510] hover:bg-slate-200 text-slate-700 dark:text-emerald-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 font-bold text-white rounded-xl shadow-xs"
                >
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
