# VitalTrack Pro 🏋️‍♂️🥗💊💧

> **Your All-In-One Daily Companion**: Gym Workouts with Video Explanations, Time-Scheduled Diet & Reminders, Calorie & Macro Calculator, Hair Loss Regimen (Minoxidil & DHT Blockers), Supplements, Hydration & AI Goal Coach.

---

## 🌟 Key Features

### 1. 🏋️ Gym & Workouts with Video Explanations
- **Pre-Configured Hypertrophy Programs**: Push Day, Pull Day, Legs & Core, and Full Body Express.
- **Biomechanical Video Explanations**: Embedded 16:9 video player with form tutorials for every exercise (Bench Press, Incline Dumbbell Press, Romanian Deadlift, Squats, Lat Pulldowns, etc.).
- **Pro Form Cues & Injury Prevention**: Bulletproof coaching cues and common mistakes to avoid.
- **Active Gym Workout Session**:
  - Live set-by-set tracker (Weight in kg, Reps completed).
  - Automated rest stopwatch countdown (e.g., 60s, 90s, 120s) with audio ticks and bell buzzer.
  - Automatic caloric expenditure calculation and celebration confetti.

### 2. 🥗 Time-Scheduled Diet & Meal Reminders
- **Structured Daily Meal Schedule**:
  - `08:00 AM` — Power Breakfast (Eggs, Oats, Banana)
  - `11:00 AM` — Mid-Morning Fuel (Greek Yogurt, Almonds)
  - `01:30 PM` — Anabolic Lunch Bowl (Chicken Breast, Basmati Rice, Steamed Broccoli, Olive Oil)
  - `05:00 PM` — Pre-Workout Energy (Rice Cakes, Peanut Butter, Black Coffee)
  - `07:30 PM` — Post-Workout Recovery (Whey Protein Isolate)
  - `08:45 PM` — Clean Muscle Dinner (Salmon Fillet, Sweet Potato, Fresh Greens)
- **Time-Triggered Alarms**: In-app audio chimes and native system push notifications.
- **Comprehensive Food Database**: Built-in food library + custom food logging.

### 3. 🔬 Calorie & Macro Intake Engine
- **Mifflin-St Jeor Scientific Calculator**: Computes exact BMR and TDEE based on your age, weight, height, gender, and weekly activity level.
- **Goal Calibration**:
  - Fat Loss (-500 kcal deficit)
  - Lean Bulk (+350 kcal surplus)
  - Muscle Recomposition (-200 kcal high protein)
  - Maintenance
- **Dynamic Macro Split Progress**: Real-time tracking for Protein (g), Carbohydrates (g), and Dietary Fats (g).

### 4. 💊 Hair Loss Medicine & Supplements Tracking
- **Hair Follicle Defense Protocol**:
  - **Minoxidil 5% (Morning Scalp Application - 08:30 AM)**: 1 ml on dry scalp, microcirculation stimulant.
  - **Finasteride 1mg / Anti-DHT Tablet (09:30 AM)**: 5-alpha reductase inhibitor to block follicle miniaturization.
  - **Minoxidil 5% (Evening Scalp Application - 09:30 PM)**: Overnight follicular growth stimulation.
- **Fitness & Longevity Supplements**:
  - **Creatine Monohydrate (5g - 11:30 AM)**: ATP cellular energy & strength.
  - **Vitamin D3 + K2 (09:00 AM)**: Hormonal synthesis & immune function.
  - **Triple Strength Omega-3 (01:45 PM)**: Joint health & scalp blood flow.
  - **Whey Protein Isolate (07:30 PM)**: Post-gym protein synthesis.
  - **Magnesium Glycinate & Zinc ZMA (10:15 PM)**: REM sleep & muscle recovery.
- **Adherence Streaks & Alarms**: Audio pill-pop effects and habit streak counters.

### 5. 💧 Hydration Tracker & Interval Reminders
- **Target Hydration Engine**: Tailored daily water budget (e.g., 3,500 ml).
- **Interactive Flask Visualizer**: Real-time fluid wave animation showing hydration percentage.
- **Quick-Tap Presets**: `+250ml` (Glass), `+500ml` (Gym Bottle), `+750ml` (Shaker), `+1000ml` (Jug).
- **Smart Interval Reminder**: Configurable periodic reminder (every 45, 60, 90, or 120 minutes) with aquatic droplet audio chime.

### 6. 🏃 Other Daily Activities & Cardio
- Log Running, Walking (step counts), Cycling, Swimming, Yoga, Sports, Office Desk Work, and Sleep.
- Automatic MET-based caloric burn calculation based on body weight and intensity.
- Chronological timeline feed of all daily activities.

### 7. 🎯 Smart Goal Analyzer & AI Coach
- **Daily Health Score (0–100%)**: Evaluates calorie balance, protein adequacy, hydration, workout completion, and hair medication compliance.
- **Actionable Today's Checklist**: Real-time priority tasks to hit a 100% score.
- **Biometric Insights Feed**: Green success highlights, yellow/red warnings, and blue pro tips.

---

## 🚀 Running the Application

1. Open your terminal in this directory:
   ```bash
   cd C:\Users\JOSEPH\.gemini\antigravity\scratch\vitaltrack-daily
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://127.0.0.1:5173
   ```

---

## 📱 Running on Your Android Phone

### Method 1: Instant 1-Tap App Install (Recommended — No Setup Required)
VitalTrack Pro is configured as an installable **Progressive Web App (PWA)**:
1. Make sure your Android phone is connected to the same Wi-Fi network as your computer.
2. Open **Google Chrome** on your Android phone and visit:
   ```
   http://192.168.1.34:5173
   ```
   *(Or click **"📱 Open on Phone"** on the desktop web app and scan the generated QR code with your phone camera!)*
3. In Chrome, tap the **3 dots menu (⋮)** at the top right.
4. Tap **"Install app"** or **"Add to Home screen"**.
5. Tap **"Install"**.
👉 **Result**: **VitalTrack Pro** will install directly onto your Android phone as an app with its own home screen icon and app drawer entry, launching in full-screen standalone mode with audio chimes and native local offline storage!

---

### Method 2: Native Android APK Build (Capacitor)
A native Android project with Gradle wrapper is generated in [`android/`](file:///C:/Users/JOSEPH/.gemini/antigravity/scratch/vitaltrack-daily/android):
- **Package ID**: `com.vitaltrack.app`
- **To open in Android Studio**:
  ```bash
  npx cap open android
  ```
  Then click **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
- **To compile APK from terminal**:
  ```bash
  cd android
  .\gradlew assembleDebug
  ```
  The generated APK will be placed in `android/app/build/outputs/apk/debug/app-debug.apk`.
