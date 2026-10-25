import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { WorkoutSection } from './components/WorkoutSection';
import { DietSection } from './components/DietSection';
import { MedicineSection } from './components/MedicineSection';
import { WaterSection } from './components/WaterSection';
import { ActivitySection } from './components/ActivitySection';
import { GuidanceSection } from './components/GuidanceSection';
import { ProfileModal } from './components/ProfileModal';
import { NotificationBanner } from './components/NotificationBanner';
import { PhoneConnectModal } from './components/PhoneConnectModal';
import { RegistrationAndOnboarding } from './components/RegistrationAndOnboarding';
import { generateMealsForWorkoutTime } from './utils/bmiHelper';

import { 
  LoggedWorkout, 
  MealSlot, 
  MedicineOrSupplement, 
  OtherActivity, 
  UserProfile, 
  WaterLog, 
  WorkoutRoutine 
} from './types';
import { DEFAULT_WORKOUT_ROUTINES } from './data/defaultWorkouts';
import { DEFAULT_MEAL_SLOTS } from './data/defaultMeals';
import { DEFAULT_MEDICATIONS_AND_SUPPLEMENTS } from './data/defaultMeds';
import { calculateNutritionTargets } from './utils/calorieCalculator';
import { analyzeDailyProgress } from './utils/guidanceEngine';
import { AppNotification, notificationService } from './utils/notifications';
import { soundManager } from './utils/audio';

const STORAGE_KEYS = {
  PROFILE: 'vitaltrack_profile_v1',
  WORKOUTS: 'vitaltrack_workouts_v1',
  LOGGED_WORKOUTS: 'vitaltrack_logged_workouts_v1',
  MEALS: 'vitaltrack_meals_v1',
  MEDS: 'vitaltrack_meds_v1',
  WATER: 'vitaltrack_water_v1',
  ACTIVITIES: 'vitaltrack_activities_v1',
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex',
  phoneNumber: '',
  isRegistered: false,
  age: 26,
  gender: 'male',
  weightKg: 74,
  heightCm: 176,
  bmi: 23.9,
  bmiCategory: 'Normal',
  systemRecommendedWeightKg: 69,
  goalWeightKg: 70,
  goal: 'lean_bulk',
  workoutLocation: 'gym',
  workoutDaysPerWeek: 5,
  preferredWorkoutTime: '18:00',
  occupationType: 'desk_job',
  hasHairLossRegimen: true,
  activityLevel: 'moderate',
  targetWaterMl: 3500,
  wakeTime: '07:30',
  sleepTime: '23:30',
};

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showPhoneModal, setShowPhoneModal] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);

  // App Data State with LocalStorage fallbacks
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [showOnboarding, setShowOnboarding] = useState<boolean>(!profile.isRegistered);


  const [routines] = useState<WorkoutRoutine[]>(DEFAULT_WORKOUT_ROUTINES);

  const [loggedWorkouts, setLoggedWorkouts] = useState<LoggedWorkout[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGGED_WORKOUTS);
    return saved ? JSON.parse(saved) : [];
  });

  const [mealSlots, setMealSlots] = useState<MealSlot[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEALS);
    return saved ? JSON.parse(saved) : DEFAULT_MEAL_SLOTS;
  });

  const [meds, setMeds] = useState<MedicineOrSupplement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEDS);
    return saved ? JSON.parse(saved) : DEFAULT_MEDICATIONS_AND_SUPPLEMENTS;
  });

  const [waterLogs, setWaterLogs] = useState<WaterLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WATER);
    return saved ? JSON.parse(saved) : [
      { id: 'w-1', timestamp: '08:15', amountMl: 500 },
      { id: 'w-2', timestamp: '10:45', amountMl: 350 },
    ];
  });

  const [activities, setActivities] = useState<OtherActivity[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return saved ? JSON.parse(saved) : [];
  });

  // Track fired notification keys today to prevent repeating within the same minute
  const firedRemindersRef = useRef<Set<string>>(new Set());

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGGED_WORKOUTS, JSON.stringify(loggedWorkouts));
  }, [loggedWorkouts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(mealSlots));
  }, [mealSlots]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEDS, JSON.stringify(meds));
  }, [meds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WATER, JSON.stringify(waterLogs));
  }, [waterLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  }, [activities]);

  // Request browser notification permission
  const handleRequestNotifications = async () => {
    const granted = await notificationService.requestPermission();
    setNotificationsEnabled(granted);
    if (granted) {
      triggerAppNotification(
        'Notifications & Audio Active',
        'You will receive reminders for scheduled gym meals, hair loss treatments, and hydration!',
        'general'
      );
    }
  };

  const triggerAppNotification = (
    title: string,
    body: string,
    category: AppNotification['category']
  ) => {
    const notif = notificationService.trigger(title, body, category, true);
    setNotifications((prev) => [notif, ...prev.slice(0, 4)]);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Background reminder scheduler
  useEffect(() => {
    const checkSchedule = () => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      const todayDateStr = now.toISOString().split('T')[0];

      // 1. Check Meal reminders
      mealSlots.forEach((slot) => {
        if (slot.reminderEnabled && !slot.isCompleted && slot.scheduledTime === currentTimeStr) {
          const key = `meal-${slot.id}-${todayDateStr}-${currentTimeStr}`;
          if (!firedRemindersRef.current.has(key)) {
            firedRemindersRef.current.add(key);
            triggerAppNotification(
              `Time to Eat: ${slot.title} 🥗`,
              `Scheduled for ${slot.scheduledTime}. Consume your protein and nutrients on time!`,
              'meal'
            );
          }
        }
      });

      // 2. Check Medicine & Supplement reminders (Hair loss, Creatine, etc.)
      meds.forEach((med) => {
        if (med.reminderEnabled && !med.takenToday && med.scheduledTime === currentTimeStr) {
          const key = `med-${med.id}-${todayDateStr}-${currentTimeStr}`;
          if (!firedRemindersRef.current.has(key)) {
            firedRemindersRef.current.add(key);
            triggerAppNotification(
              `Medication Alert: ${med.name} 💊`,
              `Dosage: ${med.dosage}. ${med.purpose}`,
              'medication'
            );
          }
        }
      });
    };

    // Initial check and recurring 25-second poll
    checkSchedule();
    const interval = setInterval(checkSchedule, 25000);
    return () => clearInterval(interval);
  }, [mealSlots, meds]);

  // Derived calculations: Targets & Coaching Report
  const targets = useMemo(() => calculateNutritionTargets(profile), [profile]);

  const report = useMemo(() => {
    return analyzeDailyProgress(
      profile,
      targets,
      mealSlots,
      loggedWorkouts,
      meds,
      waterLogs,
      activities
    );
  }, [profile, targets, mealSlots, loggedWorkouts, meds, waterLogs, activities]);

  // Handlers
  const handleQuickAddWater = (amountMl: number) => {
    const newLog: WaterLog = {
      id: `water-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      amountMl,
    };
    setWaterLogs((prev) => [...prev, newLog]);
    soundManager.playWaterDrop();
  };

  const handleQuickToggleMed = (medId: string) => {
    setMeds((prev) =>
      prev.map((m) => {
        if (m.id === medId) {
          const nextTaken = !m.takenToday;
          if (nextTaken) soundManager.playPillPop();
          return {
            ...m,
            takenToday: nextTaken,
            takenAt: nextTaken ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
            streakDays: nextTaken ? m.streakDays + 1 : Math.max(0, m.streakDays - 1),
          };
        }
        return m;
      })
    );
  };

  const handleLogWorkout = (workout: LoggedWorkout) => {
    setLoggedWorkouts((prev) => [workout, ...prev]);
  };

  const handleCompleteOnboarding = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setShowOnboarding(false);
    // Align meal slots around their preferred workout time!
    const alignedMeals = generateMealsForWorkoutTime(newProfile.preferredWorkoutTime);
    setMealSlots(alignedMeals);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Floating Notifications */}
      <NotificationBanner
        notifications={notifications}
        onDismiss={dismissNotification}
      />

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        onOpenProfile={() => setShowProfileModal(true)}
        notificationsEnabled={notificationsEnabled}
        onRequestNotifications={handleRequestNotifications}
        healthScore={report.healthScore}
        onOpenPhoneModal={() => setShowPhoneModal(true)}
        onOpenOnboarding={() => setShowOnboarding(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            profile={profile}
            targets={targets}
            report={report}
            mealSlots={mealSlots}
            routines={routines}
            loggedWorkouts={loggedWorkouts}
            meds={meds}
            waterLogs={waterLogs}
            activities={activities}
            onNavigateTab={setActiveTab}
            onQuickAddWater={handleQuickAddWater}
            onQuickToggleMed={handleQuickToggleMed}
          />
        )}

        {activeTab === 'workouts' && (
          <WorkoutSection
            routines={routines}
            loggedWorkouts={loggedWorkouts}
            onLogWorkout={handleLogWorkout}
            weightKg={profile.weightKg}
            workoutLocation={profile.workoutLocation}
          />
        )}


        {activeTab === 'diet' && (
          <DietSection
            mealSlots={mealSlots}
            onUpdateMealSlots={setMealSlots}
            targetCalories={targets.targetCalories}
            targetProtein={targets.targetProteinGrams}
            targetCarbs={targets.targetCarbsGrams}
            targetFat={targets.targetFatGrams}
          />
        )}

        {activeTab === 'hair-meds' && (
          <MedicineSection
            meds={meds}
            onUpdateMeds={setMeds}
          />
        )}

        {activeTab === 'water' && (
          <WaterSection
            waterLogs={waterLogs}
            onAddWater={(amount) => handleQuickAddWater(amount)}
            onRemoveLog={(id) => setWaterLogs((prev) => prev.filter((w) => w.id !== id))}
            onResetToday={() => setWaterLogs([])}
            targetWaterMl={targets.targetWaterMl}
          />
        )}

        {activeTab === 'activities' && (
          <ActivitySection
            activities={activities}
            onAddActivity={(act) => setActivities((prev) => [act, ...prev])}
            onRemoveActivity={(id) => setActivities((prev) => prev.filter((a) => a.id !== id))}
            weightKg={profile.weightKg}
          />
        )}

        {activeTab === 'guidance' && (
          <GuidanceSection
            report={report}
            profile={profile}
            targets={targets}
            onNavigateTab={setActiveTab}
          />
        )}
      </main>

      {/* Profile Settings Modal */}
      {showProfileModal && (
        <ProfileModal
          profile={profile}
          onSaveProfile={setProfile}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {/* Phone Connect & Android PWA/APK Modal */}
      {showPhoneModal && (
        <PhoneConnectModal
          onClose={() => setShowPhoneModal(false)}
        />
      )}

      {/* Registration & Initial Analysis Assessment Modal */}
      {showOnboarding && (
        <RegistrationAndOnboarding
          onComplete={handleCompleteOnboarding}
          initialProfile={profile}
        />
      )}


      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>VitalTrack Pro Daily Health Hub • Workout Form Guides, Calorie & Macro Engine, Hair Regrowth Protocol & Hydration</p>
      </footer>
    </div>
  );
}

export default App;
