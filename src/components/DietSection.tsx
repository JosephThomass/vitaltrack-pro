import React, { useState } from 'react';
import { 
  Utensils, 
  Plus, 
  CheckCircle, 
  Clock, 
  Bell, 
  BellOff, 
  Trash2, 
  Search, 
  Flame, 
  PieChart, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FoodItem, LoggedMealItem, MealSlot } from '../types';
import { COMMON_FOOD_DATABASE } from '../data/foodDatabase';
import { soundManager } from '../utils/audio';
import { notificationService } from '../utils/notifications';

interface DietSectionProps {
  mealSlots: MealSlot[];
  onUpdateMealSlots: (slots: MealSlot[]) => void;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
}

export const DietSection: React.FC<DietSectionProps> = ({
  mealSlots,
  onUpdateMealSlots,
  targetCalories,
  targetProtein,
  targetCarbs,
  targetFat,
}) => {
  const [activeSlotModalId, setActiveSlotModalId] = useState<string | null>(null);
  const [foodSearchTerm, setFoodSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customFood, setCustomFood] = useState({
    name: '',
    serving: '1 serving',
    calories: 150,
    protein: 10,
    carbs: 15,
    fat: 5,
  });

  // Calculate totals from meal slots
  const totalCaloriesConsumed = mealSlots.reduce((sum, slot) => {
    return sum + slot.items.reduce((s, it) => s + Math.round(it.calories * (it.quantity || 1)), 0);
  }, 0);

  const totalProteinConsumed = mealSlots.reduce((sum, slot) => {
    return sum + slot.items.reduce((s, it) => s + Math.round(it.protein * (it.quantity || 1)), 0);
  }, 0);

  const totalCarbsConsumed = mealSlots.reduce((sum, slot) => {
    return sum + slot.items.reduce((s, it) => s + Math.round(it.carbs * (it.quantity || 1)), 0);
  }, 0);

  const totalFatConsumed = mealSlots.reduce((sum, slot) => {
    return sum + slot.items.reduce((s, it) => s + Math.round(it.fat * (it.quantity || 1)), 0);
  }, 0);

  const caloriesRemaining = targetCalories - totalCaloriesConsumed;

  // Toggle meal slot eaten status
  const toggleMealCompleted = (slotId: string) => {
    const updated = mealSlots.map((slot) => {
      if (slot.id === slotId) {
        const nextState = !slot.isCompleted;
        if (nextState) {
          soundManager.playChime('success');
          confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
        }
        return { ...slot, isCompleted: nextState };
      }
      return slot;
    });
    onUpdateMealSlots(updated);
  };

  // Toggle reminder for specific meal
  const toggleReminder = (slotId: string) => {
    const updated = mealSlots.map((slot) => {
      if (slot.id === slotId) {
        const nextState = !slot.reminderEnabled;
        if (nextState) {
          notificationService.trigger(
            `Meal Reminder Active: ${slot.title}`,
            `Scheduled for ${slot.scheduledTime}. You will be notified in time!`,
            'meal'
          );
        }
        return { ...slot, reminderEnabled: nextState };
      }
      return slot;
    });
    onUpdateMealSlots(updated);
  };

  // Update meal time
  const updateMealTime = (slotId: string, newTime: string) => {
    const updated = mealSlots.map((slot) => {
      if (slot.id === slotId) {
        return { ...slot, scheduledTime: newTime };
      }
      return slot;
    });
    onUpdateMealSlots(updated);
  };

  // Add food to meal slot
  const handleAddFoodItem = (slotId: string, item: LoggedMealItem) => {
    const updated = mealSlots.map((slot) => {
      if (slot.id === slotId) {
        return {
          ...slot,
          items: [...slot.items, item],
        };
      }
      return slot;
    });
    onUpdateMealSlots(updated);
    soundManager.playChime('gentle');
  };

  // Remove food from meal slot
  const handleRemoveFoodItem = (slotId: string, itemIdx: number) => {
    const updated = mealSlots.map((slot) => {
      if (slot.id === slotId) {
        const nextItems = [...slot.items];
        nextItems.splice(itemIdx, 1);
        return {
          ...slot,
          items: nextItems,
        };
      }
      return slot;
    });
    onUpdateMealSlots(updated);
  };

  const filteredFoods = COMMON_FOOD_DATABASE.filter((f) => {
    const matchesName = f.name.toLowerCase().includes(foodSearchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || f.category === selectedCategory;
    return matchesName && matchesCat;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Calorie & Macro Target Progress Dashboard */}
      <div className="bg-white dark:bg-[#0d221a] text-slate-900 dark:text-emerald-50 border border-emerald-100 dark:border-emerald-900/50 rounded-3xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-wider uppercase flex items-center space-x-1.5 mb-1">
              <PieChart className="w-4 h-4" />
              <span>Nutrition & Calorie Balance</span>
            </span>
            <h2 className="text-2xl font-black tracking-tight">Daily Meal & Food Tracker</h2>
            <p className="text-slate-500 dark:text-emerald-300/60 text-xs sm:text-sm mt-0.5">Time-scheduled meals tuned to maintain energy, muscle growth, and health goals.</p>
          </div>

          <div className="bg-slate-50 dark:bg-[#071510] border border-slate-200 dark:border-emerald-900/50 rounded-2xl p-4 flex items-center space-x-6">
            <div>
              <p className="text-xs text-slate-400 dark:text-emerald-400/60 font-semibold">Consumed</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{totalCaloriesConsumed} <span className="text-xs font-normal text-slate-400">kcal</span></p>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-emerald-900/50" />
            <div>
              <p className="text-xs text-slate-400 dark:text-emerald-400/60 font-semibold">Daily Budget</p>
              <p className="text-2xl font-black">{targetCalories} <span className="text-xs font-normal text-slate-400">kcal</span></p>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-emerald-900/50" />
            <div>
              <p className="text-xs text-slate-400 dark:text-emerald-400/60 font-semibold">Remaining</p>
              <p className={`text-2xl font-black ${caloriesRemaining >= 0 ? 'text-teal-600 dark:text-teal-400' : 'text-rose-500'}`}>
                {caloriesRemaining >= 0 ? caloriesRemaining : `+${Math.abs(caloriesRemaining)} over`}
              </p>
            </div>
          </div>
        </div>

        {/* Macro Progress Bars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Protein Bar */}
          <div className="bg-slate-50 dark:bg-[#071510] border border-slate-200 dark:border-emerald-900/50 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">Protein (Muscle & Hair)</span>
              <span className="text-xs font-bold">{totalProteinConsumed}g / {targetProtein}g</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 dark:bg-emerald-950 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (totalProteinConsumed / targetProtein) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-emerald-300/60 mt-1.5">
              {Math.max(0, targetProtein - totalProteinConsumed)}g remaining to meet daily target
            </p>
          </div>

          {/* Carbs Bar */}
          <div className="bg-slate-50 dark:bg-[#071510] border border-slate-200 dark:border-emerald-900/50 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">Carbohydrates (Gym Energy)</span>
              <span className="text-xs font-bold">{totalCarbsConsumed}g / {targetCarbs}g</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 dark:bg-emerald-950 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (totalCarbsConsumed / targetCarbs) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-emerald-300/60 mt-1.5">
              {Math.max(0, targetCarbs - totalCarbsConsumed)}g remaining for energy
            </p>
          </div>

          {/* Fats Bar */}
          <div className="bg-slate-50 dark:bg-[#071510] border border-slate-200 dark:border-emerald-900/50 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wide">Fats (Hormones & Skin)</span>
              <span className="text-xs font-bold">{totalFatConsumed}g / {targetFat}g</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 dark:bg-emerald-950 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (totalFatConsumed / targetFat) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-emerald-300/60 mt-1.5">
              {Math.max(0, targetFat - totalFatConsumed)}g remaining for healthy fats
            </p>
          </div>
        </div>
      </div>

      {/* Meal Schedule Timeline */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <h3 className="text-lg font-black text-slate-900 dark:text-emerald-50 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Time-Slotted Meal Schedule & Reminders</span>
          </h3>
          <span className="text-xs text-slate-500 dark:text-emerald-300/60 font-medium">Click bell icons to toggle audio & push notification reminders</span>
        </div>

        {mealSlots.map((slot) => {
          const slotCalories = slot.items.reduce((s, it) => s + Math.round(it.calories * (it.quantity || 1)), 0);
          const slotProtein = slot.items.reduce((s, it) => s + Math.round(it.protein * (it.quantity || 1)), 0);
          const slotCarbs = slot.items.reduce((s, it) => s + Math.round(it.carbs * (it.quantity || 1)), 0);
          const slotFat = slot.items.reduce((s, it) => s + Math.round(it.fat * (it.quantity || 1)), 0);

          return (
            <div
              key={slot.id}
              className={`border rounded-2xl overflow-hidden transition-all ${
                slot.isCompleted
                  ? 'border-emerald-300 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-[#0d221a]'
                  : 'bg-white dark:bg-[#0d221a] border-emerald-100 dark:border-emerald-900/50 shadow-sm hover:border-emerald-300'
              }`}
            >
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left: Meal title, time & reminder */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => toggleMealCompleted(slot.id)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      slot.isCompleted
                        ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/30'
                        : 'bg-slate-100 dark:bg-[#071510] text-slate-400 hover:text-emerald-600 border border-slate-200 dark:border-emerald-900/40 shadow-xs'
                    }`}
                    title={slot.isCompleted ? 'Marked as Eaten' : 'Click to mark as eaten'}
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className={`text-base font-bold ${slot.isCompleted ? 'line-through opacity-70' : ''}`}>
                        {slot.title}
                      </h4>
                      {slot.isCompleted && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                          Eaten
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-emerald-300/60 mt-1">
                      {/* Scheduled Time Input */}
                      <div className="flex items-center space-x-1 bg-slate-100 dark:bg-[#071510] px-2 py-0.5 rounded-lg border border-slate-200 dark:border-emerald-900/50">
                        <Clock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <input
                          type="time"
                          value={slot.scheduledTime}
                          onChange={(e) => updateMealTime(slot.id, e.target.value)}
                          className="bg-transparent text-slate-700 dark:text-emerald-200 text-xs focus:outline-none font-bold"
                        />
                      </div>

                      {/* Reminder Toggle */}
                      <button
                        onClick={() => toggleReminder(slot.id)}
                        className={`flex items-center space-x-1 px-2.5 py-0.5 rounded-lg border transition text-xs font-bold ${
                          slot.reminderEnabled
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                            : 'bg-slate-100 dark:bg-[#071510] border-slate-200 dark:border-emerald-900/40 text-slate-400 dark:text-emerald-300/60'
                        }`}
                        title={slot.reminderEnabled ? 'Reminder is ON for this meal' : 'Reminder is OFF'}
                      >
                        {slot.reminderEnabled ? (
                          <>
                            <Bell className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            <span>Reminder On</span>
                          </>
                        ) : (
                          <>
                            <BellOff className="w-3 h-3" />
                            <span>Muted</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: Macros & Action */}
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-base font-extrabold">{slotCalories} <span className="text-xs font-normal text-slate-400">kcal</span></p>
                    <p className="text-xs text-slate-500 dark:text-emerald-300/60">
                      P: <strong className="text-emerald-600 dark:text-emerald-400">{slotProtein}g</strong> • C: <strong className="text-amber-500">{slotCarbs}g</strong> • F: <strong className="text-cyan-500">{slotFat}g</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveSlotModalId(slot.id)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-[#071510] hover:bg-emerald-100 text-emerald-800 dark:text-emerald-200 text-xs font-bold border border-emerald-200 dark:border-emerald-800/60 transition shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Food</span>
                  </button>
                </div>
              </div>

              {/* Meal Items Breakdown */}
              {slot.items.length > 0 && (
                <div className="px-5 pb-4 pt-1 border-t border-slate-100 dark:border-emerald-900/40 bg-slate-50/60 dark:bg-[#071510]/40">
                  <div className="space-y-1.5 mt-2">
                    {slot.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-white dark:bg-[#0d221a] border border-slate-200 dark:border-emerald-900/40 transition shadow-xs"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="font-bold text-slate-800 dark:text-emerald-100">{item.name}</span>
                          <span className="text-slate-400 text-[11px]">({item.serving})</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="font-semibold text-slate-600 dark:text-emerald-300/80">{Math.round(item.calories * (item.quantity || 1))} kcal</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{Math.round(item.protein * (item.quantity || 1))}g P</span>
                          <button
                            onClick={() => handleRemoveFoodItem(slot.id, idx)}
                            className="text-slate-400 hover:text-rose-500 transition ml-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Food Modal */}
      {activeSlotModalId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d221a] text-slate-900 dark:text-emerald-50 border border-emerald-100 dark:border-emerald-900/50 rounded-3xl max-w-2xl w-full p-6 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-emerald-900/40">
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Nutrition Database</span>
                <h3 className="text-xl font-black">Add Food to Meal</h3>
              </div>
              <button
                onClick={() => setActiveSlotModalId(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Food Search Bar */}
            <div className="py-4 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search chicken breast, eggs, whey, oats, rice, salmon..."
                  value={foodSearchTerm}
                  onChange={(e) => setFoodSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#071510] border border-slate-200 dark:border-emerald-900/60 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              {/* Category Filters */}
              <div className="flex space-x-1.5 overflow-x-auto pb-1 text-xs">
                {['all', 'protein', 'carbs', 'fats', 'veggies', 'fruit', 'snack'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg capitalize font-bold transition ${
                      selectedCategory === cat
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-[#071510] text-slate-600 dark:text-emerald-300 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Food List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredFoods.map((f) => (
                <div
                  key={f.id}
                  className="p-3 bg-slate-50 dark:bg-[#071510] border border-slate-200 dark:border-emerald-900/40 rounded-2xl flex items-center justify-between hover:border-emerald-300 transition"
                >
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-emerald-50 text-sm">{f.name}</h5>
                    <p className="text-xs text-slate-500 dark:text-emerald-300/70">{f.servingSize} • {f.calories} kcal</p>
                    <p className="text-[11px] text-slate-400 dark:text-emerald-400/60 mt-0.5 font-medium">
                      P: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{f.protein}g</span> | C: {f.carbs}g | F: {f.fat}g
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      handleAddFoodItem(activeSlotModalId, {
                        foodId: f.id,
                        name: f.name,
                        serving: f.servingSize,
                        quantity: 1,
                        calories: f.calories,
                        protein: f.protein,
                        carbs: f.carbs,
                        fat: f.fat,
                      });
                      setActiveSlotModalId(null);
                    }}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition"
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>

            {/* Custom Food Quick Add */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-emerald-900/40">
              <h5 className="text-xs font-bold text-slate-500 dark:text-emerald-300/70 uppercase tracking-wider mb-2">Or Add Custom Item</h5>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <input
                  type="text"
                  placeholder="Food name"
                  value={customFood.name}
                  onChange={(e) => setCustomFood({ ...customFood, name: e.target.value })}
                  className="bg-slate-50 dark:bg-[#071510] border border-slate-200 dark:border-emerald-900/50 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 dark:text-white col-span-2 font-medium"
                />
                <input
                  type="number"
                  placeholder="kcal"
                  value={customFood.calories || ''}
                  onChange={(e) => setCustomFood({ ...customFood, calories: parseFloat(e.target.value) || 0 })}
                  className="bg-slate-50 dark:bg-[#071510] border border-slate-200 dark:border-emerald-900/50 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 dark:text-white font-medium"
                />
                <input
                  type="number"
                  placeholder="Protein g"
                  value={customFood.protein || ''}
                  onChange={(e) => setCustomFood({ ...customFood, protein: parseFloat(e.target.value) || 0 })}
                  className="bg-slate-50 dark:bg-[#071510] border border-slate-200 dark:border-emerald-900/50 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 dark:text-white font-medium"
                />
                <button
                  disabled={!customFood.name}
                  onClick={() => {
                    handleAddFoodItem(activeSlotModalId, {
                      name: customFood.name,
                      serving: customFood.serving,
                      quantity: 1,
                      calories: customFood.calories,
                      protein: customFood.protein,
                      carbs: customFood.carbs,
                      fat: customFood.fat,
                    });
                    setCustomFood({ name: '', serving: '1 serving', calories: 150, protein: 10, carbs: 15, fat: 5 });
                    setActiveSlotModalId(null);
                  }}
                  className="bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 disabled:opacity-50 font-bold text-xs rounded-xl px-3 py-1.5 border border-emerald-200 dark:border-emerald-800 transition"
                >
                  Save Custom
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
