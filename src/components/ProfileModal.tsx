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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Biometric Settings & Profile</h3>
              <p className="text-xs text-zinc-400">BMI metrics, target weight, training split, and energy targets</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Account Authentication Banner */}
        <div className="mt-4 p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <CheckCircle className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-white">Registered Mobile DB</span>
                <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.2 rounded font-mono font-semibold">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                {form.phoneNumber || 'Not registered'}
              </p>
            </div>
          </div>

          {onSwitchAccount && (
            <button
              type="button"
              onClick={onSwitchAccount}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold flex items-center space-x-1.5 border border-zinc-700 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Switch User</span>
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 py-4 text-xs">
          {/* Basic Info: Name, Age, Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">Your Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">Age</label>
              <input
                type="number"
                min="14"
                max="100"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: parseInt(e.target.value) || 25 })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">Gender</label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value as Gender })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          {/* Height, Weight & BMI System Recommendation */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5">
                <Scale className="w-4 h-4" />
                <span>BMI Engine & Optimal Target Weight</span>
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-700 ${bmiDetails.color}`}>
                BMI {bmiDetails.bmi} ({bmiDetails.category})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Current Weight (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={form.weightKg}
                  onChange={(e) => setForm({ ...form, weightKg: parseFloat(e.target.value) || 60 })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm font-bold focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Height (cm)</label>
                <input
                  type="number"
                  required
                  value={form.heightCm}
                  onChange={(e) => setForm({ ...form, heightCm: parseInt(e.target.value) || 170 })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm font-bold focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Target Goal Weight (kg)</label>
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    step="0.5"
                    value={form.goalWeightKg || bmiDetails.systemRecommendedWeight}
                    onChange={(e) => setForm({ ...form, goalWeightKg: parseFloat(e.target.value) || bmiDetails.systemRecommendedWeight })}
                    className="w-full bg-zinc-900 border border-emerald-500/50 rounded-xl px-3 py-2 text-white text-sm font-bold focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, goalWeightKg: bmiDetails.systemRecommendedWeight })}
                    className="px-2 py-2 bg-zinc-800 text-emerald-400 text-[10px] rounded-lg font-bold whitespace-nowrap border border-zinc-700"
                    title="Set to system recommended weight"
                  >
                    Auto
                  </button>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-zinc-300 leading-snug">
              {bmiDetails.advice} Healthy normal range: <strong>{bmiDetails.minHealthyWeight}–{bmiDetails.maxHealthyWeight} kg</strong>.
            </p>
          </div>

          {/* Workout Location (Gym vs Home) & Time of Gym */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1 flex items-center space-x-1">
                <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
                <span>Workout Location</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, workoutLocation: 'gym' })}
                  className={`py-2 px-3 rounded-xl border text-center transition ${
                    form.workoutLocation === 'gym'
                      ? 'bg-emerald-500/15 border-emerald-500 text-white font-bold'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                  }`}
                >
                  🏋️ Gym Routine
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, workoutLocation: 'home' })}
                  className={`py-2 px-3 rounded-xl border text-center transition ${
                    form.workoutLocation === 'home'
                      ? 'bg-emerald-500/15 border-emerald-500 text-white font-bold'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                  }`}
                >
                  🏠 Home Routine
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Workout Time & Frequency</span>
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="time"
                  value={form.preferredWorkoutTime || '18:00'}
                  onChange={(e) => setForm({ ...form, preferredWorkoutTime: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white text-sm font-bold focus:outline-none font-mono"
                />
                <select
                  value={form.workoutDaysPerWeek || 5}
                  onChange={(e) => setForm({ ...form, workoutDaysPerWeek: parseInt(e.target.value) || 5 })}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-2 text-white text-xs font-semibold focus:outline-none"
                >
                  <option value={3}>3 d/wk</option>
                  <option value={4}>4 d/wk</option>
                  <option value={5}>5 d/wk</option>
                  <option value={6}>6 d/wk</option>
                </select>
              </div>
            </div>
          </div>

          {/* Occupation & Daily Activity */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1 flex items-center space-x-1">
              <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
              <span>Daily Job Activity Level</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'desk_job', label: 'Desk Job', desc: 'Sitting >6h' },
                { id: 'standing_light', label: 'Light Stand', desc: 'Teacher, sales' },
                { id: 'active_retail', label: 'Active Retail', desc: 'On feet all day' },
                { id: 'heavy_labor', label: 'Physical Labor', desc: 'Heavy lifting' },
              ].map((occ) => (
                <button
                  key={occ.id}
                  type="button"
                  onClick={() => setForm({ ...form, occupationType: occ.id as OccupationType })}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    form.occupationType === occ.id
                      ? 'bg-emerald-500/15 border-emerald-500 text-white font-bold'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  <p className="text-xs text-white">{occ.label}</p>
                  <p className="text-[10px] text-zinc-500">{occ.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Fitness Goal */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
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
                      ? 'bg-cyan-500/15 border-cyan-500 text-white font-bold'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  <p className="text-xs text-white">{g.label}</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">{g.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Calculated Output Summary */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Calculator className="w-4 h-4" />
              <span>Calculated Metabolic Output</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
              <div className="bg-zinc-900 p-2 rounded-xl border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase font-sans">Basal (BMR)</span>
                <p className="text-base font-bold text-white">{previewTargets.bmr} kcal</p>
              </div>

              <div className="bg-zinc-900 p-2 rounded-xl border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase font-sans">TDEE Burn</span>
                <p className="text-base font-bold text-zinc-200">{previewTargets.tdee} kcal</p>
              </div>

              <div className="bg-zinc-900 p-2 rounded-xl border border-zinc-800">
                <span className="text-[10px] text-emerald-400 uppercase font-bold font-sans">Target Diet</span>
                <p className="text-base font-black text-emerald-400">{previewTargets.targetCalories} kcal</p>
              </div>

              <div className="bg-zinc-900 p-2 rounded-xl border border-zinc-800">
                <span className="text-[10px] text-cyan-400 uppercase font-bold font-sans">Target Protein</span>
                <p className="text-base font-black text-cyan-400">{previewTargets.targetProteinGrams}g</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-xl text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition text-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
