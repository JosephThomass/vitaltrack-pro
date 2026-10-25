import { DailyGuidanceReport, LoggedWorkout, MealSlot, MedicineOrSupplement, OtherActivity, UserProfile, WaterLog } from '../types';
import { CalculatedTargets } from './calorieCalculator';

export function analyzeDailyProgress(
  profile: UserProfile,
  targets: CalculatedTargets,
  meals: MealSlot[],
  workouts: LoggedWorkout[],
  meds: MedicineOrSupplement[],
  waterLogs: WaterLog[],
  activities: OtherActivity[]
): DailyGuidanceReport {
  // 1. Calculate totals
  const totalCaloriesConsumed = meals.reduce((acc, slot) => {
    return acc + slot.items.reduce((sum, item) => sum + (item.calories * (item.quantity || 1)), 0);
  }, 0);

  const totalProteinConsumed = meals.reduce((acc, slot) => {
    return acc + slot.items.reduce((sum, item) => sum + (item.protein * (item.quantity || 1)), 0);
  }, 0);

  const totalCaloriesBurnedWorkout = workouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
  const totalCaloriesBurnedActivities = activities.reduce((sum, a) => sum + a.caloriesBurned, 0);
  const totalAdditionalBurned = totalCaloriesBurnedWorkout + totalCaloriesBurnedActivities;

  const totalWaterConsumed = waterLogs.reduce((sum, log) => sum + log.amountMl, 0);

  const totalMeds = meds.length;
  const takenMeds = meds.filter((m) => m.takenToday).length;
  const medAdherence = totalMeds > 0 ? Math.round((takenMeds / totalMeds) * 100) : 100;

  const workoutCompleted = workouts.length > 0;

  const hydrationPercent = Math.min(100, Math.round((totalWaterConsumed / targets.targetWaterMl) * 100));
  const proteinAdequacy = Math.min(120, Math.round((totalProteinConsumed / targets.targetProteinGrams) * 100));

  // Calorie analysis
  const netCalories = totalCaloriesConsumed; // standard nutritional intake vs target
  const calorieDiff = netCalories - targets.targetCalories;
  let calorieStatus: 'surplus' | 'deficit' | 'on_track' | 'under_eating' | 'over_eating' = 'on_track';

  if (Math.abs(calorieDiff) <= 150) {
    calorieStatus = 'on_track';
  } else if (profile.goal === 'fat_loss') {
    if (calorieDiff > 250) calorieStatus = 'over_eating';
    else if (calorieDiff < -400) calorieStatus = 'under_eating';
    else calorieStatus = 'deficit';
  } else if (profile.goal === 'lean_bulk') {
    if (calorieDiff > 400) calorieStatus = 'over_eating';
    else if (calorieDiff < -200) calorieStatus = 'under_eating';
    else calorieStatus = 'surplus';
  } else {
    calorieStatus = calorieDiff > 0 ? 'surplus' : 'deficit';
  }

  // Calculate Health Score (weighted: 25% calories, 25% protein, 20% water, 15% meds, 15% workout)
  let calorieScore = 100 - Math.min(100, Math.abs(calorieDiff) / 10);
  if (calorieScore < 0) calorieScore = 0;

  const proteinScore = Math.min(100, (totalProteinConsumed / targets.targetProteinGrams) * 100);
  const waterScore = Math.min(100, (totalWaterConsumed / targets.targetWaterMl) * 100);
  const workoutScore = workoutCompleted ? 100 : 40;
  const hairMedScore = medAdherence;

  const healthScore = Math.round(
    calorieScore * 0.25 +
    proteinScore * 0.25 +
    waterScore * 0.20 +
    hairMedScore * 0.15 +
    workoutScore * 0.15
  );

  const insights: DailyGuidanceReport['insights'] = [];
  const actionPlan: string[] = [];

  // Goal-specific guidance
  if (profile.goal === 'fat_loss') {
    if (calorieStatus === 'on_track' || calorieStatus === 'deficit') {
      insights.push({
        category: 'calories',
        type: 'success',
        message: `Your caloric deficit is well calibrated for fat loss. You are within target (${totalCaloriesConsumed} / ${targets.targetCalories} kcal).`,
      });
    } else if (calorieStatus === 'over_eating') {
      insights.push({
        category: 'calories',
        type: 'warning',
        message: `Caloric intake is ${calorieDiff} kcal above your fat loss limit. Focus on lean vegetables and drink 500ml water to suppress hunger.`,
      });
      actionPlan.push(`Swap evening carb-dense snacks for green salad or a zero-calorie tea.`);
    } else if (calorieStatus === 'under_eating') {
      insights.push({
        category: 'calories',
        type: 'warning',
        message: `You are eating significantly below metabolic safety (${Math.abs(calorieDiff)} kcal under). Severe deficits trigger muscle catabolism and hair shedding.`,
      });
      actionPlan.push(`Add a serving of oats or a whole egg to reach at least ${targets.targetCalories - 200} kcal.`);
    }
  } else if (profile.goal === 'lean_bulk') {
    if (calorieStatus === 'surplus' || calorieStatus === 'on_track') {
      insights.push({
        category: 'calories',
        type: 'success',
        message: `Excellent fuel surplus for hypertrophy! You have consumed ${totalCaloriesConsumed} kcal towards your ${targets.targetCalories} kcal bulk goal.`,
      });
    } else {
      insights.push({
        category: 'calories',
        type: 'warning',
        message: `You need ${Math.abs(calorieDiff)} more calories to enter an anabolic growth state. Don't skip post-workout meals.`,
      });
      actionPlan.push(`Incorporate peanut butter, bananas, or a protein shake to hit your calorie surplus.`);
    }
  }

  // Protein evaluation
  if (proteinAdequacy >= 90) {
    insights.push({
      category: 'protein',
      type: 'success',
      message: `Protein intake is stellar (${totalProteinConsumed}g / ${targets.targetProteinGrams}g target). Muscle tissue repair and hair keratin synthesis are protected.`,
    });
  } else {
    const proteinShort = targets.targetProteinGrams - totalProteinConsumed;
    insights.push({
      category: 'protein',
      type: 'warning',
      message: `Protein is ${proteinShort}g below target. Essential amino acids are required to rebuild torn muscle fibers and prevent follicle miniaturization.`,
    });
    actionPlan.push(`Consume a scoop of Whey Protein Isolate or 150g Greek Yogurt / Tofu to close the ${proteinShort}g protein deficit.`);
  }

  // Hair loss & Supplement adherence
  const hairMeds = meds.filter((m) => m.category === 'hair_loss');
  const untakenHairMeds = hairMeds.filter((m) => !m.takenToday);

  if (untakenHairMeds.length === 0 && hairMeds.length > 0) {
    insights.push({
      category: 'hair_and_meds',
      type: 'success',
      message: `Hair loss protocol is 100% compliant today! Minoxidil & DHT blocker consistency is the #1 predictor of anagen hair regrowth.`,
    });
  } else if (untakenHairMeds.length > 0) {
    insights.push({
      category: 'hair_and_meds',
      type: 'warning',
      message: `Pending hair treatments: ${untakenHairMeds.map((m) => m.name).join(', ')}. Inconsistent Minoxidil application can trigger shedding phase.`,
    });
    actionPlan.push(`Apply/take your scheduled ${untakenHairMeds[0].name} before the day ends.`);
  }

  // Creatine & gym supplements
  const creatine = meds.find((m) => m.name.toLowerCase().includes('creatine'));
  if (creatine && !creatine.takenToday) {
    actionPlan.push(`Take 5g of Creatine Monohydrate with 300ml water to saturate muscle phosphocreatine stores.`);
  }

  // Hydration evaluation
  if (hydrationPercent >= 85) {
    insights.push({
      category: 'hydration',
      type: 'success',
      message: `Optimal cellular hydration achieved (${totalWaterConsumed} ml / ${targets.targetWaterMl} ml). Excellent for kidney filtration and muscle pumps.`,
    });
  } else {
    const waterShort = targets.targetWaterMl - totalWaterConsumed;
    insights.push({
      category: 'hydration',
      type: 'warning',
      message: `Hydration is at ${hydrationPercent}%. You need ${waterShort} ml more water. Dehydration reduces lifting power by up to 15% and dries the scalp.`,
    });
    actionPlan.push(`Drink 2 full glasses (500 ml) of water right now.`);
  }

  // Workout evaluation
  if (workoutCompleted) {
    insights.push({
      category: 'workout',
      type: 'success',
      message: `Workout logged successfully! Total active energy expenditure: ~${totalCaloriesBurnedWorkout} kcal. Ensure adequate 8-hour sleep for recovery.`,
    });
  } else {
    insights.push({
      category: 'workout',
      type: 'tip',
      message: `No gym session logged yet for today. Even a 30-minute high-intensity session or 8,000 steps maintains metabolic momentum.`,
    });
    actionPlan.push(`Perform today's scheduled gym routine or log an active walking/cardio session.`);
  }

  if (actionPlan.length === 0) {
    actionPlan.push(`All daily pillars achieved! Prioritize 8 hours of restorative sleep to maximize growth hormone release.`);
  }

  return {
    healthScore,
    calorieStatus,
    calorieDifference: calorieDiff,
    proteinAdequacyPercent: proteinAdequacy,
    hydrationPercent,
    medicationAdherencePercent: medAdherence,
    workoutCompleted,
    insights,
    actionPlan,
  };
}
