import { ActivityLevel, FitnessGoal, Gender, UserProfile } from '../types';

export interface CalculatedTargets {
  bmr: number;
  tdee: number;
  targetCalories: number;
  targetProteinGrams: number;
  targetCarbsGrams: number;
  targetFatGrams: number;
  targetWaterMl: number;
}

export function calculateNutritionTargets(profile: UserProfile): CalculatedTargets {
  const { age, gender, weightKg, heightCm, activityLevel, goal } = profile;

  // Mifflin - St Jeor BMR Equation
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'male') {
    bmr += 5;
  } else {
    bmr -= 161;
  }

  // Activity multipliers
  const activityMultipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very_active: 1.725,
    athlete: 1.9,
  };

  const tdee = Math.round(bmr * (activityMultipliers[activityLevel] || 1.4));

  // Goal calorie adjustment
  let targetCalories = tdee;
  if (goal === 'fat_loss') {
    targetCalories = Math.max(1400, Math.round(tdee - 500));
  } else if (goal === 'lean_bulk') {
    targetCalories = Math.round(tdee + 350);
  } else if (goal === 'muscle_recomp') {
    targetCalories = Math.round(tdee - 200);
  }

  // Use custom override if provided
  if (profile.customTargetCalories && profile.customTargetCalories > 0) {
    targetCalories = profile.customTargetCalories;
  }

  // Macro splits
  // Protein: High priority (2.0g/kg for lifters, 2.2g/kg for cutting)
  const proteinPerKg = goal === 'fat_loss' || goal === 'muscle_recomp' ? 2.2 : 2.0;
  const targetProteinGrams = profile.customTargetProtein || Math.round(weightKg * proteinPerKg);

  // Fat: 25% of total energy or min 0.8g/kg
  const fatCalories = targetCalories * 0.25;
  const targetFatGrams = profile.customTargetFat || Math.round(fatCalories / 9);

  // Carbs: Remainder of calories (4 kcal/g)
  const caloriesFromProteinAndFat = (targetProteinGrams * 4) + (targetFatGrams * 9);
  const remainingCarbCalories = Math.max(200, targetCalories - caloriesFromProteinAndFat);
  const targetCarbsGrams = profile.customTargetCarbs || Math.round(remainingCarbCalories / 4);

  // Water calculation: 35ml per kg + 500ml gym buffer
  const calculatedWater = Math.max(2500, Math.round(weightKg * 38 + 500));
  const targetWaterMl = profile.targetWaterMl || calculatedWater;

  return {
    bmr: Math.round(bmr),
    tdee,
    targetCalories,
    targetProteinGrams,
    targetCarbsGrams,
    targetFatGrams,
    targetWaterMl,
  };
}
