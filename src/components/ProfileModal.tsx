import React, { useState } from 'react';
import { User, X, Calculator, Scale, Dumbbell, Home, Clock, Briefcase, Phone, LogOut, CheckCircle } from 'lucide-react';
import { ActivityLevel, FitnessGoal, Gender, OccupationType, UserProfile, WorkoutLocation } from '../types';
import { calculateNutritionTargets } from '../utils/calorieCalculator';
import { calculateBMIDetails, deriveActivityLevel } from '../utils/bmiHelper';
import { soundManager } from '../utils/audio';

interface ProfileModalProps {
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onClose: () => void;
  onSwitchAccount?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  onSaveProfile,
  onClose,
  onSwitchAccount,
}) => {
  const [form, setForm] = useState<UserProfile>({ ...profile });

  // Live BMI calculation
  const bmiDetails = calculateBMIDetails(form.weightKg, form.heightCm, form.gender);

  // Derived activity level based on occupation & days
  const autoActivityLevel = deriveActivityLevel(form.occupationType || 'desk_job', form.workoutDaysPerWeek || 5);

  const previewForm: UserProfile = {
    ...form,
    bmi: bmiDetails.bmi,
    bmiCategory: bmiDetails.category,
    systemRecommendedWeightKg: bmiDetails.systemRecommendedWeight,
    activityLevel: form.activityLevel || autoActivityLevel,
  };

  const previewTargets = calculateNutritionTargets(previewForm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(previewForm);
    soundManager.playChime('success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0d221a] text-slate-900 dark:text-emerald-50 border border-emerald-100 dark:border-emerald-900/50 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-emerald-900/40">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Biometric Settings & Profile</h3>
              <p className="text-xs text-slate-500 dark:text-emerald-300/60">BMI metrics, target weight, training split & energy targets</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-emerald-900/30 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Account Authentication Banner */}
        <div className="mt-4 p-4 rounded-2xl bg-emerald-50/60 dark:bg-[#071510] border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold">Registered Mobile Database</span>
                <span className="text-[10px] bg-emerald-200/80 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-emerald-300/70 font-mono mt-0.5">
                {form.phoneNumber || 'Not registered'}
              </p>
            </div>
          </div>

          {onSwitchAccount && (
            <button
              type="button"
              onClick={onSwitchAccount}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#0d221a] hover:bg-slate-50 dark:hover:bg-emerald-900/40 text-slate-700 dark:text-emerald-200 text-xs font-bold flex items-center space-x-1.5 border border-slate-200 dark:border-emerald-800/60 transition shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-500" />
              <span>Switch User</span>
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 py-4 text-xs">
          {/* Basic Info: Name, Age, Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-600 dark:text-emerald-300 font-bold mb-1">Your Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-50 dark:bg-[#071510] border border-slate-200 dark:border-emerald-900/60 rounded-xl px-3 py-2 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-emerald-300 font-bold mb-1">Age</label>
              <input
                type="number"
                min="14"
                max="100"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: parseInt(e.target.value) || 25 })}
                className="w-full bg-slate-50 dark:bg-[#071510] border border-slate-200 dark:border-emerald-900/60 rounded-xl px-3 py-2 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-emerald-300 font-bold mb-1">Gender</label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value as Gender })}
                className="w-full bg-slate-50 dark:bg-[#071510] border border-slate-200 dark:border-emerald-900/60 rounded-xl px-3 py-2 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          {/* Height, Weight & BMI System Recommendation */}
          <div className="bg-slate-50 dark:bg-[#071510] border border-emerald-100 dark:border-emerald-900/50 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5">
                <Scale className="w-4 h-4" />
                <span>BMI Engine & Ideal Goal Weight</span>
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                bmiDetails.category === 'Normal' 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200' 
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200'
              }`}>
                BMI {bmiDetails.bmi} ({bmiDetails.category})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-500 dark:text-emerald-300/70 font-semibold mb-1">Current Weight (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={form.weightKg}
                  onChange={(e) => setForm({ ...form, weightKg: parseFloat(e.target.value) || 60 })}
                  className="w-full bg-white dark:bg-[#0d221a] border border-slate-200 dark:border-emerald-800/60 rounded-xl px-3 py-2 text-slate-900 dark:text-white text-sm font-bold focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-500 dark:text-emerald-300/70 font-semibold mb-1">Height (cm)</label>
                <input
                  type="number"
                  required
                  value={form.heightCm}
                  onChange={(e) => setForm({ ...form, heightCm: parseInt(e.target.value) || 170 })}
                  className="w-full bg-white dark:bg-[#0d221a] border border-slate-200 dark:border-emerald-800/60 rounded-xl px-3 py-2 text-slate-900 dark:text-white text-sm font-bold focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-500 dark:text-emerald-300/70 font-semibold mb-1">Target Goal Weight (kg)</label>
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    step="0.5"
                    value={form.goalWeightKg || bmiDetails.systemRecommendedWeight}
                    onChange={(e) => setForm({ ...form, goalWeightKg: parseFloat(e.target.value) || bmiDetails.systemRecommendedWeight })}
                    className="w-full bg-white dark:bg-[#0d221a] border border-emerald-300 dark:border-emerald-500/50 rounded-xl px-3 py-2 text-emerald-600 dark:text-emerald-400 text-sm font-bold focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, goalWeightKg: bmiDetails.systemRecommendedWeight })}
                    className="px-2.5 py-2 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] rounded-lg font-bold whitespace-nowrap"
                    title="Set to system recommended weight"
                  >
                    Auto
                  </button>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-emerald-200/80 leading-snug">
              {bmiDetails.advice} Healthy range: <strong>{bmiDetails.minHealthyWeight}–{bmiDetails.maxHealthyWeight} kg</strong>.
            </p>
          </div>

          {/* Workout Location (Gym vs Home) & Time of Gym */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 dark:text-emerald-300 font-bold mb-1 flex items-center space-x-1">
                <Dumbbell className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Workout Location</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, workoutLocation: 'gym' })}
                  className={`py-2 px-3 rounded-xl border text-center transition font-bold ${
                    form.workoutLocation === 'gym'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-[#071510] border-slate-200 dark:border-emerald-900/50 text-slate-600 dark:text-emerald-200/70'
                  }`}
                >
                  🏋️ Gym Routine
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, workoutLocation: 'home' })}
                  className={`py-2 px-3 rounded-xl border text-center transition font-bold ${
                    form.workoutLocation === 'home'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-[#071510] border-slate-200 dark:border-emerald-900/50 text-slate-600 dark:text-emerald-200/70'
                  }`}
                >
                  🏠 Home Routine
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-emerald-300 font-bold mb-1 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Workout Time & Frequency</span>
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="time"
                  value={form.preferredWorkoutTime || '18:00'}
                  onChange={(e) => setForm({ ...form, preferredWorkoutTime: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#071510] border border-slate-200 dark:border-emerald-900/60 rounded-xl px-3 py-2 text-slate-900 dark:text-white text-sm font-bold focus:outline-none font-mono"
                />
                <select
                  value={form.workoutDaysPerWeek || 5}
                  onChange={(e) => setForm({ ...form, workoutDaysPerWeek: parseInt(e.target.value) || 5 })}
                  className="bg-slate-50 dark:bg-[#071510] border border-slate-200 dark:border-emerald-900/60 rounded-xl px-2.5 py-2 text-slate-900 dark:text-white text-xs font-bold focus:outline-none"
                >
                  <option value={3}>3 d/wk</option>
                  <option value={4}>4 d/wk</option>
                  <option value={5}>5 d/wk</option>
                  <option value={6}>6 d/wk</option>
                </select>
              </div>
            </div>
          </div>

          {/* Fitness Goal */}
          <div>
            <label className="block text-slate-600 dark:text-emerald-300 font-bold mb-1">
              Primary Objective
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'fat_loss', label: 'Fat Loss', desc: 'Shred fat (-500 kcal)' },
                { id: 'lean_bulk', label: 'Lean Bulk', desc: 'Gain muscle (+350 kcal)' },
                { id: 'muscle_recomp', label: 'Recomp', desc: 'Burn fat & build lean' },
                { id: 'maintenance', label: 'Maintain', desc: 'Weight stability' },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setForm({ ...form, goal: g.id as FitnessGoal })}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    form.goal === g.id
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold'
                      : 'bg-slate-50 dark:bg-[#071510] border-slate-200 dark:border-emerald-900/50 text-slate-600 dark:text-emerald-300/70 hover:bg-slate-100'
                  }`}
                >
                  <p className="text-xs font-bold">{g.label}</p>
                  <p className="text-[10px] text-slate-400 dark:text-emerald-400/60 mt-0.5">{g.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Calculated Output Summary */}
          <div className="bg-emerald-50/60 dark:bg-[#071510] border border-emerald-100 dark:border-emerald-900/50 rounded-2xl p-4 space-y-2">
            <div className="flex items-center space-x-1.5 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Calculator className="w-4 h-4" />
              <span>Target Energy Summary</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-white dark:bg-[#0d221a] p-2.5 rounded-xl border border-slate-200 dark:border-emerald-900/50">
                <span className="text-[10px] text-slate-500 dark:text-emerald-300/60 uppercase font-bold">Burn (TDEE)</span>
                <p className="text-base font-extrabold text-slate-900 dark:text-white font-mono">{previewTargets.tdee} kcal</p>
              </div>

              <div className="bg-white dark:bg-[#0d221a] p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-700">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold">Target Diet</span>
                <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{previewTargets.targetCalories} kcal</p>
              </div>

              <div className="bg-white dark:bg-[#0d221a] p-2.5 rounded-xl border border-slate-200 dark:border-emerald-900/50">
                <span className="text-[10px] text-teal-600 dark:text-teal-400 uppercase font-bold">Protein</span>
                <p className="text-base font-extrabold text-teal-600 dark:text-teal-400 font-mono">{previewTargets.targetProteinGrams}g</p>
              </div>

              <div className="bg-white dark:bg-[#0d221a] p-2.5 rounded-xl border border-slate-200 dark:border-emerald-900/50">
                <span className="text-[10px] text-cyan-600 dark:text-cyan-400 uppercase font-bold">Water</span>
                <p className="text-base font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">{previewTargets.targetWaterMl} ml</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-emerald-900/40">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-slate-700 dark:text-emerald-200 font-bold rounded-xl text-xs transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold rounded-xl shadow-md hover:from-emerald-500 hover:to-teal-400 transition text-xs"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
