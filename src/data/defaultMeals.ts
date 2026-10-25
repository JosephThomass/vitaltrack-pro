import { MealSlot } from '../types';

export const DEFAULT_MEAL_SLOTS: MealSlot[] = [
  {
    id: 'meal-breakfast',
    type: 'breakfast',
    title: 'Power Breakfast',
    scheduledTime: '08:00',
    reminderEnabled: true,
    isCompleted: false,
    items: [
      { foodId: 'f-1', name: 'Whole Eggs (Boiled/Scrambled)', serving: '2 large eggs (100g)', quantity: 1, calories: 143, protein: 13, carbs: 1, fat: 10 },
      { foodId: 'f-2', name: 'Egg Whites', serving: '100g (approx 3 whites)', quantity: 1, calories: 52, protein: 11, carbs: 0.7, fat: 0.2 },
      { foodId: 'f-6', name: 'Rolled Oats (Raw)', serving: '60g dry', quantity: 1, calories: 234, protein: 8, carbs: 40, fat: 4 },
      { foodId: 'f-10', name: 'Banana', serving: '1 medium (118g)', quantity: 1, calories: 105, protein: 1.3, carbs: 27, fat: 0.3 }
    ]
  },
  {
    id: 'meal-midmorning',
    type: 'mid_morning',
    title: 'Mid-Morning Fuel & Hydration',
    scheduledTime: '11:00',
    reminderEnabled: true,
    isCompleted: false,
    items: [
      { foodId: 'f-5', name: 'Greek Yogurt (0% Fat Plain)', serving: '200g cup', quantity: 1, calories: 130, protein: 20, carbs: 8, fat: 0.5 },
      { foodId: 'f-13', name: 'Almonds (Raw)', serving: '1 handful (28g)', quantity: 1, calories: 164, protein: 6, carbs: 6, fat: 14 }
    ]
  },
  {
    id: 'meal-lunch',
    type: 'lunch',
    title: 'Anabolic Lunch Bowl',
    scheduledTime: '13:30',
    reminderEnabled: true,
    isCompleted: false,
    items: [
      { foodId: 'f-3', name: 'Chicken Breast (Grilled/Cooked)', serving: '150g cooked', quantity: 1, calories: 247, protein: 46, carbs: 0, fat: 5.4 },
      { foodId: 'f-7', name: 'White / Basmati Rice (Cooked)', serving: '1 cup cooked (160g)', quantity: 1.5, calories: 315, protein: 6.5, carbs: 67.5, fat: 0.8 },
      { foodId: 'f-16', name: 'Broccoli (Steamed)', serving: '1 cup (150g)', quantity: 1, calories: 50, protein: 4, carbs: 10, fat: 0.6 },
      { foodId: 'f-14', name: 'Extra Virgin Olive Oil', serving: '1 tbsp (14ml)', quantity: 0.5, calories: 60, protein: 0, carbs: 0, fat: 6.8 }
    ]
  },
  {
    id: 'meal-preworkout',
    type: 'pre_workout',
    title: 'Pre-Workout Energy & Focus',
    scheduledTime: '17:00',
    reminderEnabled: true,
    isCompleted: false,
    items: [
      { foodId: 'f-21', name: 'Rice Cakes', serving: '2 cakes (18g)', quantity: 1, calories: 70, protein: 1.5, carbs: 15, fat: 0.5 },
      { foodId: 'f-12', name: 'Peanut Butter (Natural)', serving: '2 tbsp (32g)', quantity: 0.5, calories: 94, protein: 4, carbs: 3, fat: 8 },
      { foodId: 'f-22', name: 'Black Coffee (Espresso / Americano)', serving: '1 cup (200ml)', quantity: 1, calories: 2, protein: 0.2, carbs: 0, fat: 0 }
    ]
  },
  {
    id: 'meal-postworkout',
    type: 'post_workout',
    title: 'Post-Workout Anabolic Window',
    scheduledTime: '19:30',
    reminderEnabled: true,
    isCompleted: false,
    items: [
      { foodId: 'f-4', name: 'Whey Protein Isolate', serving: '1 scoop (30g)', quantity: 1, calories: 120, protein: 25, carbs: 2, fat: 1 }
    ]
  },
  {
    id: 'meal-dinner',
    type: 'dinner',
    title: 'Clean Muscle Dinner',
    scheduledTime: '20:45',
    reminderEnabled: true,
    isCompleted: false,
    items: [
      { foodId: 'f-15', name: 'Salmon Fillet (Pan-seared)', serving: '150g fillet', quantity: 1, calories: 310, protein: 34, carbs: 0, fat: 18 },
      { foodId: 'f-9', name: 'Sweet Potato (Baked)', serving: '1 medium (150g)', quantity: 1, calories: 135, protein: 3, carbs: 31, fat: 0.2 },
      { foodId: 'f-17', name: 'Mixed Salad Greens', serving: '2 cups (100g)', quantity: 1, calories: 20, protein: 1.5, carbs: 3, fat: 0.2 }
    ]
  }
];
