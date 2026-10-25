import { BMICategory, Gender, OccupationType, ActivityLevel, MealSlot } from '../types';

export interface BMIDetails {
  bmi: number;
  category: BMICategory;
  color: string;
  minHealthyWeight: number;
  maxHealthyWeight: number;
  systemRecommendedWeight: number;
  advice: string;
}

export function calculateBMIDetails(
  weightKg: number,
  heightCm: number,
  gender: Gender = 'male'
): BMIDetails {
  if (heightCm <= 0 || weightKg <= 0) {
    return {
      bmi: 22,
      category: 'Normal',
      color: 'text-emerald-400',
      minHealthyWeight: 60,
      maxHealthyWeight: 75,
      systemRecommendedWeight: 68,
      advice: 'Healthy baseline',
    };
  }

  const heightM = heightCm / 100;
  const bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10;

  // WHO BMI Standard Ranges
  const minHealthyWeight = Math.round(18.5 * heightM * heightM);
  const maxHealthyWeight = Math.round(24.9 * heightM * heightM);

  // Target optimal BMI: 22.0 for men, 21.5 for women
  const targetBMI = gender === 'female' ? 21.5 : 22.2;
  const systemRecommendedWeight = Math.round(targetBMI * heightM * heightM);

  let category: BMICategory = 'Normal';
  let color = 'text-emerald-400';
  let advice = '';

  if (bmi < 18.5) {
    category = 'Underweight';
    color = 'text-amber-400';
    advice = `Your BMI is ${bmi} (underweight). The system recommends a lean caloric surplus to gain ~${systemRecommendedWeight - weightKg} kg of healthy muscle tissue.`;
  } else if (bmi <= 24.9) {
    category = 'Normal';
    color = 'text-emerald-400';
    advice = `Your BMI is ${bmi} (healthy normal weight). Optimal range is ${minHealthyWeight}–${maxHealthyWeight} kg. Ideal for athletic lean bulking or body recomp.`;
  } else if (bmi <= 29.9) {
    category = 'Overweight';
    color = 'text-amber-400';
    advice = `Your BMI is ${bmi} (overweight). The system recommends a calibrated caloric deficit to shed ~${weightKg - systemRecommendedWeight} kg towards optimal goal weight of ${systemRecommendedWeight} kg.`;
  } else {
    category = 'Obese';
    color = 'text-rose-400';
    advice = `Your BMI is ${bmi} (obesity threshold). The system prioritizes steady fat reduction and cardiovascular conditioning towards a target weight of ${systemRecommendedWeight} kg.`;
  }

  return {
    bmi,
    category,
    color,
    minHealthyWeight,
    maxHealthyWeight,
    systemRecommendedWeight,
    advice,
  };
}

// Convert job/occupation + gym frequency into calculated ActivityLevel
export function deriveActivityLevel(
  occupation: OccupationType,
  workoutDaysPerWeek: number
): ActivityLevel {
  if (occupation === 'heavy_labor') {
    return workoutDaysPerWeek >= 4 ? 'athlete' : 'very_active';
  }
  if (occupation === 'active_retail') {
    return workoutDaysPerWeek >= 4 ? 'very_active' : 'moderate';
  }
  if (occupation === 'standing_light') {
    return workoutDaysPerWeek >= 5 ? 'very_active' : workoutDaysPerWeek >= 3 ? 'moderate' : 'light';
  }
  // Desk Job
  if (workoutDaysPerWeek >= 6) return 'very_active';
  if (workoutDaysPerWeek >= 4) return 'moderate';
  if (workoutDaysPerWeek >= 2) return 'light';
  return 'sedentary';
}

// Dynamically generate personalized meal schedule aligned with preferred workout time
export function generateMealsForWorkoutTime(workoutTime: string = '18:00'): MealSlot[] {
  // Parse hour (0-23)
  const hour = parseInt(workoutTime.split(':')[0]) || 18;

  // Helper format "HH:MM"
  const fmt = (h: number, m: number = 0) => {
    const wrappedH = (h + 24) % 24;
    return `${String(wrappedH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  // If Morning Workout (between 5 AM and 10 AM)
  if (hour >= 5 && hour <= 10) {
    return [
      {
        id: 'meal-preworkout',
        type: 'pre_workout',
        title: 'Pre-Workout Fast Fuel',
        scheduledTime: fmt(hour - 1, 30), // 30-45 mins before gym
        reminderEnabled: true,
        isCompleted: false,
        items: [
          { foodId: 'f-10', name: 'Banana', serving: '1 medium (118g)', quantity: 1, calories: 105, protein: 1.3, carbs: 27, fat: 0.3 },
          { foodId: 'f-22', name: 'Black Coffee (Espresso / Americano)', serving: '1 cup (200ml)', quantity: 1, calories: 2, protein: 0.2, carbs: 0, fat: 0 },
        ]
      },
      {
        id: 'meal-postworkout',
        type: 'post_workout',
        title: 'Post-Workout Anabolic Shake',
        scheduledTime: fmt(hour + 1, 15), // right after gym
        reminderEnabled: true,
        isCompleted: false,
        items: [
          { foodId: 'f-4', name: 'Whey Protein Isolate', serving: '1 scoop (30g)', quantity: 1, calories: 120, protein: 25, carbs: 2, fat: 1 },
        ]
      },
      {
        id: 'meal-breakfast',
        type: 'breakfast',
        title: 'Post-Gym Hearty Breakfast',
        scheduledTime: fmt(hour + 2, 0),
        reminderEnabled: true,
        isCompleted: false,
        items: [
          { foodId: 'f-1', name: 'Whole Eggs (Boiled/Scrambled)', serving: '2 large eggs (100g)', quantity: 1, calories: 143, protein: 13, carbs: 1, fat: 10 },
          { foodId: 'f-6', name: 'Rolled Oats (Raw)', serving: '60g dry', quantity: 1, calories: 234, protein: 8, carbs: 40, fat: 4 },
        ]
      },
      {
        id: 'meal-lunch',
        type: 'lunch',
        title: 'Sustained Energy Lunch',
        scheduledTime: '13:30',
        reminderEnabled: true,
        isCompleted: false,
        items: [
          { foodId: 'f-3', name: 'Chicken Breast (Grilled/Cooked)', serving: '150g cooked', quantity: 1, calories: 247, protein: 46, carbs: 0, fat: 5.4 },
          { foodId: 'f-7', name: 'White / Basmati Rice (Cooked)', serving: '1 cup cooked (160g)', quantity: 1.5, calories: 315, protein: 6.5, carbs: 67.5, fat: 0.8 },
          { foodId: 'f-16', name: 'Broccoli (Steamed)', serving: '1 cup (150g)', quantity: 1, calories: 50, protein: 4, carbs: 10, fat: 0.6 },
        ]
      },
      {
        id: 'meal-midmorning',
        type: 'mid_morning',
        title: 'Afternoon Nutrient Fuel',
        scheduledTime: '17:00',
        reminderEnabled: true,
        isCompleted: false,
        items: [
          { foodId: 'f-5', name: 'Greek Yogurt (0% Fat Plain)', serving: '200g cup', quantity: 1, calories: 130, protein: 20, carbs: 8, fat: 0.5 },
          { foodId: 'f-13', name: 'Almonds (Raw)', serving: '1 handful (28g)', quantity: 1, calories: 164, protein: 6, carbs: 6, fat: 14 },
        ]
      },
      {
        id: 'meal-dinner',
        type: 'dinner',
        title: 'Recovery Dinner',
        scheduledTime: '20:30',
        reminderEnabled: true,
        isCompleted: false,
        items: [
          { foodId: 'f-15', name: 'Salmon Fillet (Pan-seared)', serving: '150g fillet', quantity: 1, calories: 310, protein: 34, carbs: 0, fat: 18 },
          { foodId: 'f-9', name: 'Sweet Potato (Baked)', serving: '1 medium (150g)', quantity: 1, calories: 135, protein: 3, carbs: 31, fat: 0.2 },
        ]
      }
    ];
  }

  // Otherwise Standard Afternoon/Evening Workout
  return [
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
      title: 'Mid-Morning Fuel',
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
      title: 'Pre-Workout Fuel & Energy',
      scheduledTime: fmt(hour - 1, 15), // 1 hour 15 mins before workout
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
      title: 'Post-Workout Muscle Synthesis',
      scheduledTime: fmt(hour + 1, 30), // right after workout
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
      scheduledTime: fmt(hour + 2, 45),
      reminderEnabled: true,
      isCompleted: false,
      items: [
        { foodId: 'f-15', name: 'Salmon Fillet (Pan-seared)', serving: '150g fillet', quantity: 1, calories: 310, protein: 34, carbs: 0, fat: 18 },
        { foodId: 'f-9', name: 'Sweet Potato (Baked)', serving: '1 medium (150g)', quantity: 1, calories: 135, protein: 3, carbs: 31, fat: 0.2 },
        { foodId: 'f-17', name: 'Mixed Salad Greens', serving: '2 cups (100g)', quantity: 1, calories: 20, protein: 1.5, carbs: 3, fat: 0.2 }
      ]
    }
  ];
}
