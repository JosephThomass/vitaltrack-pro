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
    <div className="space-y-6">
      {/* Calorie & Macro Target Progress Dashboard */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-emerald-400 text-xs font-bold tracking-wider uppercase flex items-center space-x-1.5 mb-1">
              <PieChart className="w-4 h-4" />
              <span>Scientific Calorie & Macro Balance</span>
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">Daily Nutritional Blueprint</h2>
            <p className="text-slate-400 text-sm mt-0.5">Time-scheduled meals tuned to maintain energy, muscle anabolism, and fat-loss goals.</p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center space-x-6">
            <div>
              <p className="text-xs text-slate-400">Total Consumed</p>
              <p className="text-2xl font-black text-emerald-400">{totalCaloriesConsumed} <span className="text-sm font-normal text-slate-500">kcal</span></p>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <p className="text-xs text-slate-400">Target Budget</p>
              <p className="text-2xl font-black text-white">{targetCalories} <span className="text-sm font-normal text-slate-500">kcal</span></p>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <p className="text-xs text-slate-400">Remaining</p>
              <p className={`text-2xl font-black ${caloriesRemaining >= 0 ? 'text-cyan-400' : 'text-rose-400'}`}>
                {caloriesRemaining >= 0 ? caloriesRemaining : `+${Math.abs(caloriesRemaining)} over`}
              </p>
            </div>
          </div>
        </div>

        {/* Macro Progress Bars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Protein Bar */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">Protein (Muscle & Follicles)</span>
              <span className="text-xs font-bold text-white">{totalProteinConsumed}g / {targetProtein}g</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (totalProteinConsumed / targetProtein) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              {Math.max(0, targetProtein - totalProteinConsumed)}g remaining to meet nitrogen balance target
            </p>
          </div>

          {/* Carbs Bar */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">Carbohydrates (Gym Energy)</span>
              <span className="text-xs font-bold text-white">{totalCarbsConsumed}g / {targetCarbs}g</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (totalCarbsConsumed / targetCarbs) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              {Math.max(0, targetCarbs - totalCarbsConsumed)}g remaining for glycogen replenishing
            </p>
          </div>

          {/* Fats Bar */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide">Fats (Hormones & Skin)</span>
              <span className="text-xs font-bold text-white">{totalFatConsumed}g / {targetFat}g</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (totalFatConsumed / targetFat) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              {Math.max(0, targetFat - totalFatConsumed)}g remaining for essential fatty acids
            </p>
          </div>
        </div>
      </div>

      {/* Meal Schedule Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            <span>Time-Slotted Meal Schedule & Reminders</span>
          </h3>
          <span className="text-xs text-slate-400">Click bell icons to toggle audio & push notification reminders</span>
        </div>

        {mealSlots.map((slot) => {
          const slotCalories = slot.items.reduce((s, it) => s + Math.round(it.calories * (it.quantity || 1)), 0);
          const slotProtein = slot.items.reduce((s, it) => s + Math.round(it.protein * (it.quantity || 1)), 0);
          const slotCarbs = slot.items.reduce((s, it) => s + Math.round(it.carbs * (it.quantity || 1)), 0);
          const slotFat = slot.items.reduce((s, it) => s + Math.round(it.fat * (it.quantity || 1)), 0);

          return (
            <div
              key={slot.id}
              className={`bg-slate-900 border rounded-2xl overflow-hidden transition-all ${
                slot.isCompleted
                  ? 'border-emerald-500/40 bg-emerald-950/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left: Meal title, time & reminder */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => toggleMealCompleted(slot.id)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      slot.isCompleted
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                    }`}
                    title={slot.isCompleted ? 'Marked as Eaten' : 'Click to mark as eaten'}
                  >
                    <CheckCircle className="w-6 h-6" />
                  </button>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className={`text-base font-bold ${slot.isCompleted ? 'text-emerald-300 line-through' : 'text-white'}`}>
                        {slot.title}
                      </h4>
                      {slot.isCompleted && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                          Eaten
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
                      {/* Scheduled Time Input */}
                      <div className="flex items-center space-x-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        <input
                          type="time"
                          value={slot.scheduledTime}
                          onChange={(e) => updateMealTime(slot.id, e.target.value)}
                          className="bg-transparent text-slate-200 text-xs focus:outline-none"
                        />
                      </div>

                      {/* Reminder Toggle */}
                      <button
                        onClick={() => toggleReminder(slot.id)}
                        className={`flex items-center space-x-1 px-2 py-0.5 rounded border transition ${
                          slot.reminderEnabled
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                        }`}
                        title={slot.reminderEnabled ? 'Reminder is ON for this meal' : 'Reminder is OFF'}
                      >
                        {slot.reminderEnabled ? (
                          <>
                            <Bell className="w-3 h-3" />
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
                    <p className="text-base font-black text-white">{slotCalories} <span className="text-xs font-normal text-slate-400">kcal</span></p>
                    <p className="text-xs text-slate-400">
                      P: <strong className="text-emerald-400">{slotProtein}g</strong> • C: <strong className="text-amber-400">{slotCarbs}g</strong> • F: <strong className="text-indigo-400">{slotFat}g</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveSlotModalId(slot.id)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Food</span>
                  </button>
                </div>
              </div>

              {/* Meal Items Breakdown */}
              {slot.items.length > 0 && (
                <div className="px-5 pb-4 pt-1 border-t border-slate-800/60 bg-slate-950/30">
                  <div className="space-y-1.5 mt-2">
                    {slot.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-slate-900/60 border border-slate-800/50 hover:border-slate-700 transition"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="font-medium text-slate-200">{item.name}</span>
                          <span className="text-slate-500">({item.serving})</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-slate-400">{Math.round(item.calories * (item.quantity || 1))} kcal</span>
                          <span className="text-emerald-400 font-semibold">{Math.round(item.protein * (item.quantity || 1))}g P</span>
                          <button
                            onClick={() => handleRemoveFoodItem(slot.id, idx)}
                            className="text-slate-500 hover:text-rose-400 transition ml-1"
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
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Nutrition Database</span>
                <h3 className="text-xl font-bold text-white">Add Food to Meal</h3>
              </div>
              <button
                onClick={() => setActiveSlotModalId(null)}
                className="text-slate-400 hover:text-white"
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
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Category Filters */}
              <div className="flex space-x-1.5 overflow-x-auto pb-1 text-xs">
                {['all', 'protein', 'carbs', 'fats', 'veggies', 'fruit', 'snack'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg capitalize font-medium ${
                      selectedCategory === cat
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
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
                  className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between hover:border-slate-700 transition"
                >
                  <div>
                    <h5 className="font-semibold text-white text-sm">{f.name}</h5>
                    <p className="text-xs text-slate-400">{f.servingSize} • {f.calories} kcal</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      P: <span className="text-emerald-400 font-semibold">{f.protein}g</span> | C: {f.carbs}g | F: {f.fat}g
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
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg shadow-md transition"
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>

            {/* Custom Food Quick Add */}
            <div className="mt-4 pt-4 border-t border-slate-800">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Or Add Custom Item</h5>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <input
                  type="text"
                  placeholder="Food name"
                  value={customFood.name}
                  onChange={(e) => setCustomFood({ ...customFood, name: e.target.value })}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white col-span-2"
                />
                <input
                  type="number"
                  placeholder="kcal"
                  value={customFood.calories || ''}
                  onChange={(e) => setCustomFood({ ...customFood, calories: parseFloat(e.target.value) || 0 })}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
                <input
                  type="number"
                  placeholder="Protein g"
                  value={customFood.protein || ''}
                  onChange={(e) => setCustomFood({ ...customFood, protein: parseFloat(e.target.value) || 0 })}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
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
                  className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-emerald-400 font-bold text-xs rounded-lg px-3 py-1.5 transition"
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
