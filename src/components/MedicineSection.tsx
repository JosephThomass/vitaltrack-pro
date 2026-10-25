import React, { useState } from 'react';
import { 
  Pill, 
  CheckCircle, 
  Clock, 
  Bell, 
  BellOff, 
  Flame, 
  Sparkles, 
  Plus, 
  ShieldCheck, 
  AlertCircle, 
  Calendar,
  Volume2,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MedicineOrSupplement } from '../types';
import { soundManager } from '../utils/audio';
import { notificationService } from '../utils/notifications';

interface MedicineSectionProps {
  meds: MedicineOrSupplement[];
  onUpdateMeds: (meds: MedicineOrSupplement[]) => void;
}

export const MedicineSection: React.FC<MedicineSectionProps> = ({
  meds,
  onUpdateMeds,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'hair_loss' | 'supplement'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMed, setNewMed] = useState({
    name: '',
    category: 'hair_loss' as MedicineOrSupplement['category'],
    dosage: '1 dose',
    scheduledTime: '09:00',
    purpose: '',
    instructions: '',
    frequency: 'daily' as MedicineOrSupplement['frequency'],
  });

  const hairMeds = meds.filter((m) => m.category === 'hair_loss');
  const supplementMeds = meds.filter((m) => m.category === 'supplement');

  const takenCount = meds.filter((m) => m.takenToday).length;
  const adherencePercent = meds.length > 0 ? Math.round((takenCount / meds.length) * 100) : 100;

  const toggleTaken = (medId: string) => {
    const updated = meds.map((m) => {
      if (m.id === medId) {
        const nextTaken = !m.takenToday;
        if (nextTaken) {
          soundManager.playPillPop();
          confetti({
            particleCount: 35,
            spread: 45,
            origin: { y: 0.7 },
          });
        }
        return {
          ...m,
          takenToday: nextTaken,
          takenAt: nextTaken ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
          streakDays: nextTaken ? m.streakDays + 1 : Math.max(0, m.streakDays - 1),
        };
      }
      return m;
    });
    onUpdateMeds(updated);
  };

  const toggleReminder = (medId: string) => {
    const updated = meds.map((m) => {
      if (m.id === medId) {
        const nextState = !m.reminderEnabled;
        if (nextState) {
          notificationService.trigger(
            `Reminder Set: ${m.name}`,
            `Scheduled for ${m.scheduledTime}. You will receive a chime alert.`,
            'medication'
          );
        }
        return { ...m, reminderEnabled: nextState };
      }
      return m;
    });
    onUpdateMeds(updated);
  };

  const updateTime = (medId: string, newTime: string) => {
    const updated = meds.map((m) => {
      if (m.id === medId) {
        return { ...m, scheduledTime: newTime };
      }
      return m;
    });
    onUpdateMeds(updated);
  };

  const deleteMed = (medId: string) => {
    onUpdateMeds(meds.filter((m) => m.id !== medId));
  };

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.name) return;

    const item: MedicineOrSupplement = {
      id: `med-${Date.now()}`,
      name: newMed.name,
      category: newMed.category,
      dosage: newMed.dosage,
      scheduledTime: newMed.scheduledTime,
      purpose: newMed.purpose || 'Health & fitness support',
      instructions: newMed.instructions || 'Take as directed',
      reminderEnabled: true,
      takenToday: false,
      streakDays: 0,
      frequency: newMed.frequency,
    };

    onUpdateMeds([...meds, item]);
    setShowAddModal(false);
    setNewMed({
      name: '',
      category: 'hair_loss',
      dosage: '1 dose',
      scheduledTime: '09:00',
      purpose: '',
      instructions: '',
      frequency: 'daily',
    });
    soundManager.playChime('gentle');
  };

  const testChime = () => {
    soundManager.playPillPop();
    notificationService.trigger('Test Medicine Reminder', 'Time for your hair loss treatment / supplement!', 'medication');
  };

  const filteredMeds = meds.filter((m) => {
    if (filterCategory === 'all') return true;
    return m.category === filterCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner: Hair Loss & Supplement Protocol */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border border-indigo-900/50 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold tracking-wider uppercase mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Hair Follicle & Supplement Stack</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Medicine & Supplement Tracker</h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Consistent daily timing for Minoxidil, DHT blockers, and gym supplements maximizes follicular vascularization and muscle synthesis.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={testChime}
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs rounded-xl border border-slate-700 transition"
              title="Test notification sound"
            >
              <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Test Audio Alarm</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-sm hover:from-indigo-400 hover:to-purple-400 shadow-lg shadow-indigo-500/25 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Regimen Item</span>
            </button>
          </div>
        </div>

        {/* Adherence & Streaks Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-3.5">
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Today's Adherence</p>
            <p className="text-xl font-black text-white mt-0.5">{takenCount} / {meds.length}</p>
            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full"
                style={{ width: `${adherencePercent}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-3.5">
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Hair Loss Protocol</p>
            <p className="text-xl font-black text-emerald-400 mt-0.5">
              {hairMeds.filter((m) => m.takenToday).length} / {hairMeds.length} Taken
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Minoxidil & DHT barrier</p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-3.5">
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Max Regimen Streak</p>
            <div className="flex items-center space-x-1 mt-0.5">
              <Flame className="w-5 h-5 text-amber-400 fill-current" />
              <p className="text-xl font-black text-amber-400">
                {Math.max(0, ...meds.map((m) => m.streakDays))} Days
              </p>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Unbroken habit</p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-3.5">
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Next Scheduled</p>
            <p className="text-sm font-bold text-slate-200 mt-1 truncate">
              {meds.find((m) => !m.takenToday)?.scheduledTime || 'All Done for Today!'}
            </p>
            <p className="text-[11px] text-indigo-400 mt-0.5 truncate">
              {meds.find((m) => !m.takenToday)?.name || 'Great job!'}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2">
        {[
          { id: 'all', label: `All Items (${meds.length})` },
          { id: 'hair_loss', label: `Hair Regrowth Protocol (${hairMeds.length})` },
          { id: 'supplement', label: `Fitness Supplements (${supplementMeds.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterCategory(tab.id as typeof filterCategory)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              filterCategory === tab.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Medication & Supplement Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMeds.map((med) => (
          <div
            key={med.id}
            className={`bg-slate-900 border rounded-2xl p-5 transition-all ${
              med.takenToday
                ? 'border-emerald-500/40 bg-emerald-950/10'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Header: Title, Category, Action */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start space-x-3">
                <button
                  onClick={() => toggleTaken(med.id)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 mt-0.5 ${
                    med.takenToday
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                  title={med.takenToday ? 'Taken today' : 'Click to mark as taken'}
                >
                  <CheckCircle className="w-6 h-6" />
                </button>

                <div>
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <h3 className={`font-bold text-base ${med.takenToday ? 'text-emerald-300 line-through' : 'text-white'}`}>
                      {med.name}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      med.category === 'hair_loss'
                        ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                        : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    }`}>
                      {med.category === 'hair_loss' ? 'Hair Loss' : 'Supplement'}
                    </span>
                    <span className="text-xs font-semibold text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {med.dosage}
                    </span>
                    <span className="text-xs text-amber-400 font-medium flex items-center space-x-0.5">
                      <Flame className="w-3 h-3 fill-current" />
                      <span>{med.streakDays}d streak</span>
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => deleteMed(med.id)}
                className="text-slate-600 hover:text-rose-400 transition"
                title="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Purpose & Clinical instructions */}
            <div className="mt-3.5 space-y-1.5 text-xs">
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 font-semibold">Purpose: </span>
                <span className="text-slate-200">{med.purpose}</span>
              </div>
              <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/50">
                <span className="text-indigo-400 font-semibold">Instructions: </span>
                <span className="text-slate-300">{med.instructions}</span>
              </div>
            </div>

            {/* Footer: Scheduled Time, Taken timestamp & Reminder Toggle */}
            <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <input
                    type="time"
                    value={med.scheduledTime}
                    onChange={(e) => updateTime(med.id, e.target.value)}
                    className="bg-transparent text-slate-200 text-xs focus:outline-none"
                  />
                </div>

                {med.takenAt && (
                  <span className="text-[11px] text-emerald-400 font-medium">
                    Taken at {med.takenAt}
                  </span>
                )}
              </div>

              <button
                onClick={() => toggleReminder(med.id)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition ${
                  med.reminderEnabled
                    ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                {med.reminderEnabled ? (
                  <>
                    <Bell className="w-3.5 h-3.5" />
                    <span>Alarm Active</span>
                  </>
                ) : (
                  <>
                    <BellOff className="w-3.5 h-3.5" />
                    <span>Muted</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Medicine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Add Medication / Supplement</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddNew} className="space-y-4 py-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Minoxidil Foam, Biotin, Creatine, Ashwagandha"
                  value={newMed.name}
                  onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Category</label>
                  <select
                    value={newMed.category}
                    onChange={(e) => setNewMed({ ...newMed, category: e.target.value as MedicineOrSupplement['category'] })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                  >
                    <option value="hair_loss">Hair Loss Treatment</option>
                    <option value="supplement">Fitness / Health Supplement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Dosage</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1 ml, 1 tablet, 5g"
                    value={newMed.dosage}
                    onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Scheduled Time</label>
                  <input
                    type="time"
                    required
                    value={newMed.scheduledTime}
                    onChange={(e) => setNewMed({ ...newMed, scheduledTime: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Frequency</label>
                  <select
                    value={newMed.frequency}
                    onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value as MedicineOrSupplement['frequency'] })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                  >
                    <option value="daily">Daily</option>
                    <option value="twice_daily">Twice Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Purpose (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Follicle regrowth, DHT blocker, Muscle strength"
                  value={newMed.purpose}
                  onChange={(e) => setNewMed({ ...newMed, purpose: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Instructions (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Apply to dry scalp, take with meal"
                  value={newMed.instructions}
                  onChange={(e) => setNewMed({ ...newMed, instructions: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 font-bold text-white rounded-xl shadow-lg"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
