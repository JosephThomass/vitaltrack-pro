export type FitnessGoal = 'fat_loss' | 'lean_bulk' | 'maintenance' | 'muscle_recomp';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active' | 'athlete';
export type Gender = 'male' | 'female';
export type WorkoutLocation = 'gym' | 'home';
export type OccupationType = 'desk_job' | 'standing_light' | 'active_retail' | 'heavy_labor';
export type BMICategory = 'Underweight' | 'Normal' | 'Overweight' | 'Obese';

export interface UserProfile {
  name: string;
  phoneNumber: string;
  isRegistered: boolean;
  age: number;
  gender: Gender;
  weightKg: number;
  heightCm: number;
  bmi: number;
  bmiCategory: BMICategory;
  systemRecommendedWeightKg: number;
  goalWeightKg: number;
  goal: FitnessGoal;
  workoutLocation: WorkoutLocation;
  workoutDaysPerWeek: number; // e.g., 3, 4, 5, 6
  preferredWorkoutTime: string; // e.g., "18:00" (6 PM)
  occupationType: OccupationType;
  hasHairLossRegimen: boolean;
  activityLevel: ActivityLevel;
  customTargetCalories?: number;
  customTargetProtein?: number;
  customTargetCarbs?: number;
  customTargetFat?: number;
  targetWaterMl: number;
  wakeTime: string; // e.g., "07:00"
  sleepTime: string; // e.g., "23:00"
}


export interface Exercise {
  id: string;
  name: string;
  muscleGroup: 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Full Body' | 'Cardio';
  equipment: string;
  defaultSets: number;
  defaultReps: string;
  restSeconds: number;
  videoUrl: string; // YouTube embed URL
  videoTitle: string;
  thumbnailUrl?: string;
  animationType?: string; // e.g., 'bench_press', 'squat', 'overhead_press', etc.
  gifUrl?: string; // Looping exercise demonstration GIF
  tempo?: string; // e.g. "3-0-1-0" (3s lower, 0s pause, 1s lift)
  primaryMuscles?: string[];
  secondaryMuscles?: string[];
  formCues: string[];
  commonMistakes: string[];
}

export interface WorkoutSetLog {
  setNumber: number;
  weightKg: number;
  reps: number;
  completed: boolean;
}

export interface LoggedExercise {
  exerciseId: string;
  exerciseName: string;
  muscleGroup: string;
  sets: WorkoutSetLog[];
  notes?: string;
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  category: 'Push' | 'Pull' | 'Legs' | 'Upper' | 'Lower' | 'Full Body' | 'Core & Cardio';
  location?: 'gym' | 'home' | 'both';
  description: string;
  durationMinutes: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  exercises: Exercise[];
}


export interface LoggedWorkout {
  id: string;
  date: string; // YYYY-MM-DD
  routineTitle: string;
  exercises: LoggedExercise[];
  durationMinutes: number;
  caloriesBurned: number;
  notes?: string;
  completedAt: string;
}

export interface FoodItem {
  id: string;
  name: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: 'protein' | 'carbs' | 'fats' | 'veggies' | 'fruit' | 'snack' | 'drink';
}

export interface LoggedMealItem {
  foodId?: string;
  name: string;
  serving: string;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealSlot {
  id: string;
  type: 'breakfast' | 'mid_morning' | 'lunch' | 'pre_workout' | 'post_workout' | 'dinner' | 'bedtime_snack';
  title: string;
  scheduledTime: string; // "08:30"
  items: LoggedMealItem[];
  reminderEnabled: boolean;
  isCompleted: boolean;
}

export interface MedicineOrSupplement {
  id: string;
  name: string;
  category: 'hair_loss' | 'supplement' | 'health_med';
  dosage: string;
  scheduledTime: string; // "09:00"
  purpose: string;
  instructions: string; // e.g. "Apply 1ml to dry scalp using dropper" or "Take 1 tablet with warm water"
  reminderEnabled: boolean;
  takenToday: boolean;
  takenAt?: string;
  streakDays: number;
  frequency: 'daily' | 'twice_daily' | 'weekly' | 'alternate_days';
}

export interface WaterLog {
  id: string;
  timestamp: string;
  amountMl: number;
}

export interface OtherActivity {
  id: string;
  date: string;
  title: string;
  category: 'running' | 'walking' | 'cycling' | 'swimming' | 'yoga' | 'sports' | 'desk_work' | 'sleep' | 'other';
  durationMinutes: number;
  caloriesBurned: number;
  intensity: 'low' | 'moderate' | 'high';
  notes?: string;
  loggedAt: string;
}

export interface DailyGuidanceReport {
  healthScore: number; // 0-100
  calorieStatus: 'surplus' | 'deficit' | 'on_track' | 'under_eating' | 'over_eating';
  calorieDifference: number;
  proteinAdequacyPercent: number;
  hydrationPercent: number;
  medicationAdherencePercent: number;
  workoutCompleted: boolean;
  insights: {
    category: 'calories' | 'protein' | 'workout' | 'hair_and_meds' | 'hydration' | 'recovery';
    type: 'success' | 'warning' | 'tip';
    message: string;
  }[];
  actionPlan: string[];
}
