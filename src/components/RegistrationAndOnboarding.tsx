import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  KeyRound, 
  User, 
  CheckCircle, 
  Dumbbell, 
  Home, 
  Briefcase, 
  Clock, 
  Flame, 
  Scale, 
  Heart, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  Info,
  Calendar,
  RotateCcw,
  Zap,
  Activity,
  Layers,
  X,
  Leaf
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  ActivityLevel, 
  FitnessGoal, 
  Gender, 
  OccupationType, 
  UserProfile, 
  WorkoutLocation 
} from '../types';
import { calculateBMIDetails, deriveActivityLevel, generateMealsForWorkoutTime } from '../utils/bmiHelper';
import { calculateNutritionTargets } from '../utils/calorieCalculator';
import { soundManager } from '../utils/audio';
import { userDatabase, UserAccountData } from '../utils/userDatabase';
import { DEFAULT_MEDICATIONS_AND_SUPPLEMENTS } from '../data/defaultMeds';

interface RegistrationAndOnboardingProps {
  onComplete: (profile: UserProfile, accountData?: UserAccountData) => void;
  onRestoreAccount?: (accountData: UserAccountData) => void;
  initialProfile?: UserProfile;
  onClose?: () => void;
}

export const RegistrationAndOnboarding: React.FC<RegistrationAndOnboardingProps> = ({
  onComplete,
  onRestoreAccount,
  initialProfile,
  onClose,
}) => {
  // Step tracker: 1 = Phone & OTP, 2 = Biometrics & BMI Goal Weight, 3 = Workout & Time, 4 = Occupation & Lifestyle
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Mobile & OTP State
  const [countryCode, setCountryCode] = useState<string>('+91');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [otpTimer, setOtpTimer] = useState<number>(30);
  const [otpError, setOtpError] = useState<string>('');

  // Existing User Account Found in Database State
  const [foundAccount, setFoundAccount] = useState<UserAccountData | null>(null);

  // Step 2-4: Biometrics & Preferences
  const [name, setName] = useState<string>(initialProfile?.name || '');
  const [age, setAge] = useState<number>(initialProfile?.age || 26);
  const [gender, setGender] = useState<Gender>(initialProfile?.gender || 'male');
  const [weightKg, setWeightKg] = useState<number>(initialProfile?.weightKg || 74);
  const [heightCm, setHeightCm] = useState<number>(initialProfile?.heightCm || 176);
  const [goal, setGoal] = useState<FitnessGoal>(initialProfile?.goal || 'lean_bulk');
  const [goalWeightKg, setGoalWeightKg] = useState<number>(initialProfile?.goalWeightKg || 72);

  const [workoutLocation, setWorkoutLocation] = useState<WorkoutLocation>(initialProfile?.workoutLocation || 'gym');
  const [workoutDaysPerWeek, setWorkoutDaysPerWeek] = useState<number>(initialProfile?.workoutDaysPerWeek || 5);
  const [preferredWorkoutTime, setPreferredWorkoutTime] = useState<string>(initialProfile?.preferredWorkoutTime || '18:00');
  const [occupationType, setOccupationType] = useState<OccupationType>(initialProfile?.occupationType || 'desk_job');
  const [hasHairLossRegimen, setHasHairLossRegimen] = useState<boolean>(initialProfile?.hasHairLossRegimen ?? true);

  // Live BMI calculation
  const bmiDetails = calculateBMIDetails(weightKg, heightCm, gender);

  // Update initial goal weight suggestion when height changes
  useEffect(() => {
    if (!initialProfile?.goalWeightKg) {
      setGoalWeightKg(bmiDetails.systemRecommendedWeight);
    }
  }, [bmiDetails.systemRecommendedWeight]);

  // OTP Countdown timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (otpSent && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpSent, otpTimer]);

  // Handler: Send OTP
  const handleSendOtp = () => {
    if (!phoneNumber || phoneNumber.length < 7) {
      setOtpError('Please enter a valid mobile number (min 7 digits)');
      return;
    }
    setOtpError('');
    // Generate simulated 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
    setOtpTimer(30);
    soundManager.playChime('gentle');
  };

  // Handler: Verify OTP
  const handleVerifyOtp = () => {
    if (enteredOtp === generatedOtp || enteredOtp === '123456') {
      setOtpError('');
      soundManager.playChime('success');

      // Check if user already exists in the database!
      const fullPhone = `${countryCode} ${phoneNumber}`;
      const existingUser = userDatabase.getUser(fullPhone) || userDatabase.getUser(phoneNumber);

      if (existingUser) {
        // User already has a registered profile & data in the local DB!
        setFoundAccount(existingUser);
      } else {
        // New user: proceed to Biometric Assessment
        setTimeout(() => {
          setCurrentStep(2);
        }, 300);
      }
    } else {
      setOtpError('Invalid OTP code. Please enter the demo code shown or 123456.');
      soundManager.playTimerBeep(true);
    }
  };

  // Auto-fill OTP
  const handleAutoFillOtp = () => {
    setEnteredOtp(generatedOtp);
    setOtpError('');
  };

  // Action: Resume Existing Account directly
  const handleResumeExisting = (account: UserAccountData) => {
    soundManager.playChime('success');
    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.65 },
    });
    userDatabase.setCurrentPhone(account.phoneNumber);
    if (onRestoreAccount) {
      onRestoreAccount(account);
    } else {
      onComplete(account.profile, account);
    }
  };

  // Action: Review & Edit Existing Account biometrics
  const handleReviewBiometrics = (account: UserAccountData) => {
    setName(account.profile.name);
    setAge(account.profile.age);
    setGender(account.profile.gender);
    setWeightKg(account.profile.weightKg);
    setHeightCm(account.profile.heightCm);
    setGoal(account.profile.goal);
    setGoalWeightKg(account.profile.goalWeightKg || account.profile.systemRecommendedWeightKg || 70);
    setWorkoutLocation(account.profile.workoutLocation);
    setWorkoutDaysPerWeek(account.profile.workoutDaysPerWeek);
    setPreferredWorkoutTime(account.profile.preferredWorkoutTime);
    setOccupationType(account.profile.occupationType);
    setHasHairLossRegimen(account.profile.hasHairLossRegimen ?? true);
    setFoundAccount(null);
    setCurrentStep(2);
  };

  // Derived Activity Level and Nutrition for new/updated profile
  const activityLevel = deriveActivityLevel(occupationType, workoutDaysPerWeek);

  const draftProfile: UserProfile = {
    name: name || 'Alex',
    phoneNumber: `${countryCode} ${phoneNumber}`,
    isRegistered: true,
    age,
    gender,
    weightKg,
    heightCm,
    bmi: bmiDetails.bmi,
    bmiCategory: bmiDetails.category,
    systemRecommendedWeightKg: bmiDetails.systemRecommendedWeight,
    goalWeightKg,
    goal,
    workoutLocation,
    workoutDaysPerWeek,
    preferredWorkoutTime,
    occupationType,
    hasHairLossRegimen,
    activityLevel,
    targetWaterMl: Math.max(2500, Math.round(weightKg * 38 + 500)),
    wakeTime: '07:00',
    sleepTime: '23:00',
  };

  const calculatedNutrition = calculateNutritionTargets(draftProfile);

  // Complete onboarding for new user
  const handleFinishOnboarding = () => {
    const fullPhone = `${countryCode} ${phoneNumber}`;
    const newProfile: UserProfile = {
      ...draftProfile,
      phoneNumber: fullPhone,
      isRegistered: true,
    };

    // If we're updating an existing account, preserve existing logs
    const existing = userDatabase.getUser(fullPhone) || userDatabase.getUser(phoneNumber);
    const alignedMeals = generateMealsForWorkoutTime(newProfile.preferredWorkoutTime);

    const accountToSave: UserAccountData = {
      phoneNumber: fullPhone,
      registeredAt: existing?.registeredAt || new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      profile: newProfile,
      mealSlots: existing?.mealSlots?.length ? existing.mealSlots : alignedMeals,
      loggedWorkouts: existing?.loggedWorkouts || [],
      meds: existing?.meds?.length ? existing.meds : DEFAULT_MEDICATIONS_AND_SUPPLEMENTS,
      waterLogs: existing?.waterLogs || [
        { id: 'w-1', timestamp: '08:15', amountMl: 500 },
        { id: 'w-2', timestamp: '10:45', amountMl: 350 },
      ],
      activities: existing?.activities || [],
    };

    userDatabase.saveUser(accountToSave);
    userDatabase.setCurrentPhone(fullPhone);

    soundManager.playChime('success');
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
    });
    onComplete(newProfile, accountToSave);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#0d221a] text-slate-900 dark:text-emerald-50 border border-emerald-100 dark:border-emerald-900/50 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-auto">
        {/* Top Header with Close button if allowed */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
              🌿 VitalTrack • Member Access
            </span>
          </div>

          {onClose && (
            <button 
              onClick={onClose}
              className="p-1 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-emerald-900/30 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Step Progress Bar (Only shown when not in "Found Account" mode) */}
        {!foundAccount && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-emerald-300 mb-2">
              <span>
                Step {currentStep} of 4: {
                  currentStep === 1 ? 'Mobile Sign In' :
                  currentStep === 2 ? 'Biometrics & Target Weight' :
                  currentStep === 3 ? 'Workout Plan & Time' :
                  'Daily Routine & Energy'
                }
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{currentStep * 25}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-[#071510] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 transition-all duration-500 rounded-full"
                style={{ width: `${currentStep * 25}%` }}
              />
            </div>
          </div>
        )}

        {/* ================= STEP 1: MOBILE & OTP REGISTRATION ================= */}
        {currentStep === 1 && !foundAccount && (
          <div className="space-y-6">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center mx-auto mb-2 shadow-xs">
                <Smartphone className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black tracking-tight">Sign In with Mobile</h2>
              <p className="text-xs text-slate-500 dark:text-emerald-300/70 max-w-md mx-auto">
                Enter your mobile number to sign in or create an account. If you logged in before, your saved workouts and meals resume instantly.
              </p>
            </div>

            {/* Mobile Number Entry */}
            <div className="bg-slate-50 dark:bg-[#071510] border border-slate-200 dark:border-emerald-900/50 rounded-2xl p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-emerald-300 mb-1.5">
                  Mobile Phone Number
                </label>
                <div className="flex items-center space-x-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    disabled={otpSent}
                    className="bg-white dark:bg-[#0d221a] border border-slate-200 dark:border-emerald-800/60 text-slate-900 dark:text-white text-sm font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500 shadow-xs"
                  >
                    <option value="+91">🇮🇳 +91 (IN)</option>
                    <option value="+1">🇺🇸 +1 (US)</option>
                    <option value="+44">🇬🇧 +44 (UK)</option>
                    <option value="+971">🇦🇪 +971 (UAE)</option>
                    <option value="+61">🇦🇺 +61 (AU)</option>
                    <option value="+65">🇸🇬 +65 (SG)</option>
                  </select>

                  <input
                    type="tel"
                    placeholder="98765 43210"
                    disabled={otpSent}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                    className="flex-1 bg-white dark:bg-[#0d221a] border border-slate-200 dark:border-emerald-800/60 text-slate-900 dark:text-white text-base rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 font-mono tracking-wider shadow-xs"
                  />
                </div>
              </div>

              {!otpSent ? (
                <button
                  onClick={handleSendOtp}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-md transition flex items-center justify-center space-x-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Send Verification Code</span>
                </button>
              ) : (
                /* OTP Verification Section */
                <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-emerald-900/40">
                  {/* Demo SMS Simulator Badge */}
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-slate-700 dark:text-emerald-200">
                        Demo SMS Code: <strong className="font-mono text-emerald-600 dark:text-emerald-400 text-sm">{generatedOtp}</strong>
                      </span>
                    </div>
                    <button
                      onClick={handleAutoFillOtp}
                      className="px-2.5 py-1 bg-emerald-600 text-white hover:bg-emerald-500 font-bold text-[11px] rounded-lg transition shadow-xs"
                    >
                      Auto-Fill Code
                    </button>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-emerald-300">
                        Enter 6-Digit OTP
                      </label>
                      <span className="text-[11px] text-slate-500 dark:text-emerald-400/70 font-mono">
                        {otpTimer > 0 ? `Resend in ${otpTimer}s` : (
                          <button onClick={handleSendOtp} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">Resend OTP</button>
                        )}
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="• • • • • •"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full bg-white dark:bg-[#0d221a] border border-slate-200 dark:border-emerald-800/60 text-slate-900 dark:text-white text-center text-xl font-mono tracking-[0.5em] rounded-xl py-3 focus:outline-none focus:border-emerald-500 shadow-xs"
                    />
                  </div>

                  {otpError && (
                    <p className="text-xs text-rose-500 text-center font-bold">{otpError}</p>
                  )}

                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      onClick={() => setOtpSent(false)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-slate-700 dark:text-emerald-200 font-bold rounded-xl text-xs"
                    >
                      Change Number
                    </button>
                    <button
                      onClick={handleVerifyOtp}
                      className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center space-x-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Verify & Continue</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= EXISTING USER FOUND: RESUME SESSION BANNER ================= */}
        {foundAccount && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-800 inline-block">
                Existing Profile Found
              </span>
              <h2 className="text-2xl font-black tracking-tight">
                Welcome Back, {foundAccount.profile.name}!
              </h2>
              <p className="text-xs text-slate-500 dark:text-emerald-300/70 max-w-md mx-auto">
                We retrieved your profile for <strong className="font-mono text-slate-800 dark:text-white">{foundAccount.phoneNumber}</strong>. Your workouts, nutrition goals, and hair loss protocol are ready.
              </p>
            </div>

            {/* Profile Overview Card */}
            <div className="bg-slate-50 dark:bg-[#071510] border border-emerald-100 dark:border-emerald-900/50 rounded-2xl p-4 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-white dark:bg-[#0d221a] p-2.5 rounded-xl border border-slate-200 dark:border-emerald-900/40">
                  <span className="text-[10px] text-slate-400 dark:text-emerald-400/60 uppercase font-bold">Goal</span>
                  <p className="font-bold capitalize mt-0.5">
                    {foundAccount.profile.goal.replace('_', ' ')}
                  </p>
                </div>

                <div className="bg-white dark:bg-[#0d221a] p-2.5 rounded-xl border border-slate-200 dark:border-emerald-900/40">
                  <span className="text-[10px] text-slate-400 dark:text-emerald-400/60 uppercase font-bold">Weight</span>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{foundAccount.profile.weightKg} kg</p>
                </div>

                <div className="bg-white dark:bg-[#0d221a] p-2.5 rounded-xl border border-slate-200 dark:border-emerald-900/40">
                  <span className="text-[10px] text-slate-400 dark:text-emerald-400/60 uppercase font-bold">Goal Target</span>
                  <p className="font-bold text-teal-600 dark:text-teal-400 mt-0.5">
                    {foundAccount.profile.goalWeightKg || foundAccount.profile.systemRecommendedWeightKg || foundAccount.profile.weightKg} kg
                  </p>
                </div>

                <div className="bg-white dark:bg-[#0d221a] p-2.5 rounded-xl border border-slate-200 dark:border-emerald-900/40">
                  <span className="text-[10px] text-slate-400 dark:text-emerald-400/60 uppercase font-bold">Training Mode</span>
                  <p className="font-bold text-cyan-600 dark:text-cyan-400 mt-0.5 capitalize">
                    {foundAccount.profile.workoutLocation} ({foundAccount.profile.workoutDaysPerWeek}d/wk)
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 px-1 text-[11px] text-slate-500 dark:text-emerald-300/60">
                <span>Workouts: <strong className="text-slate-800 dark:text-white">{foundAccount.loggedWorkouts.length} logged</strong></span>
                <span>Meals: <strong className="text-slate-800 dark:text-white">{foundAccount.mealSlots.length} scheduled</strong></span>
                <span>Hair Stack: <strong className="text-emerald-600 dark:text-emerald-400">{foundAccount.profile.hasHairLossRegimen ? 'Active' : 'Off'}</strong></span>
              </div>
            </div>

            {/* Resume Actions */}
            <div className="space-y-2.5">
              <button
                onClick={() => handleResumeExisting(foundAccount)}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 text-white font-black rounded-xl text-sm shadow-md hover:opacity-95 transition flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Resume Session Right Where I Left Off</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleReviewBiometrics(foundAccount)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-slate-700 dark:text-emerald-200 text-xs font-bold rounded-xl transition"
              >
                Review & Update Biometric Goals
              </button>

              <div className="text-center pt-1">
                <button
                  onClick={() => {
                    setFoundAccount(null);
                    setOtpSent(false);
                    setPhoneNumber('');
                    setEnteredOtp('');
                  }}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-emerald-300 transition"
                >
                  Sign in with a different mobile number
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 2: BIOMETRICS & BMI ANALYSIS ================= */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black tracking-tight">Your Body Biometrics & Goal</h2>
              <p className="text-xs text-slate-500 dark:text-emerald-300/70">
                The system analyzes your height and weight to calculate your healthy BMI and target weight.
              </p>
            </div>

            {/* Name, Age, Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-emerald-300 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#071510] border border-slate-200 dark:border-emerald-900/60 rounded-xl px-3 py-2 text-slate-900 dark:text-white text-sm font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-emerald-300 mb-1">Age</label>
                <input
                  type="number"
                  min="14"
                  max="99"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 25)}
                  className="w-full bg-slate-50 dark:bg-[#071510] border border-slate-200 dark:border-emerald-900/60 rounded-xl px-3 py-2 text-slate-900 dark:text-white text-sm font-bold focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-emerald-300 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full bg-slate-50 dark:bg-[#071510] border border-slate-200 dark:border-emerald-900/60 rounded-xl px-3 py-2 text-slate-900 dark:text-white text-sm font-bold focus:outline-none focus:border-emerald-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            {/* Height & Weight Sliders */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 dark:bg-[#071510] p-3.5 rounded-2xl border border-slate-200 dark:border-emerald-900/50">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-emerald-300">Current Weight</label>
                  <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{weightKg} kg</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="160"
                  step="0.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="bg-slate-50 dark:bg-[#071510] p-3.5 rounded-2xl border border-slate-200 dark:border-emerald-900/50">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-emerald-300">Height</label>
                  <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{heightCm} cm</span>
                </div>
                <input
                  type="range"
                  min="130"
                  max="220"
                  value={heightCm}
                  onChange={(e) => setHeightCm(parseInt(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Scientific BMI & System Recommended Goal Weight Card */}
            <div className="bg-emerald-50/60 dark:bg-[#071510] border border-emerald-200 dark:border-emerald-900/50 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Scale className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                    BMI Analysis & System Target
                  </span>
                </div>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  bmiDetails.category === 'Normal' 
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200' 
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200'
                }`}>
                  {bmiDetails.category} (BMI {bmiDetails.bmi})
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white dark:bg-[#0d221a] p-2 rounded-xl border border-slate-200 dark:border-emerald-900/40">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Your BMI</span>
                  <p className="text-base font-extrabold font-mono">{bmiDetails.bmi}</p>
                </div>

                <div className="bg-white dark:bg-[#0d221a] p-2 rounded-xl border border-slate-200 dark:border-emerald-900/40">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Normal Range</span>
                  <p className="text-xs font-bold text-slate-700 dark:text-emerald-200 mt-1 font-mono">{bmiDetails.minHealthyWeight}–{bmiDetails.maxHealthyWeight} kg</p>
                </div>

                <div className="bg-white dark:bg-[#0d221a] p-2 rounded-xl border border-emerald-200 dark:border-emerald-700">
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">Target Weight</span>
                  <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{bmiDetails.systemRecommendedWeight} kg</p>
                </div>
              </div>

              {/* Goal Weight Customizer */}
              <div className="pt-2 border-t border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold">Your Target Goal Weight:</label>
                  <p className="text-[10px] text-slate-500 dark:text-emerald-300/60">Set to system recommendation or customize</p>
                </div>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="number"
                    step="0.5"
                    value={goalWeightKg}
                    onChange={(e) => setGoalWeightKg(parseFloat(e.target.value) || bmiDetails.systemRecommendedWeight)}
                    className="w-20 bg-white dark:bg-[#0d221a] border border-emerald-300 dark:border-emerald-600 rounded-xl px-2 py-1.5 text-center text-sm font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none font-mono"
                  />
                  <span className="text-xs font-bold">kg</span>
                </div>
              </div>
            </div>

            {/* Primary Goal Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-emerald-300 mb-1.5">
                Primary Fitness Objective
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'fat_loss', label: 'Fat Loss', desc: 'Caloric deficit (-500 kcal)' },
                  { id: 'lean_bulk', label: 'Lean Bulk', desc: 'Muscle surplus (+350 kcal)' },
                  { id: 'muscle_recomp', label: 'Recomp', desc: 'Build muscle & lose fat' },
                  { id: 'maintenance', label: 'Maintain', desc: 'Weight stability' },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGoal(g.id as FitnessGoal)}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      goal === g.id
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold'
                        : 'bg-slate-50 dark:bg-[#071510] border-slate-200 dark:border-emerald-900/50 text-slate-600 dark:text-emerald-300/70 hover:bg-slate-100'
                    }`}
                  >
                    <p className="text-xs font-bold">{g.label}</p>
                    <p className="text-[10px] text-slate-400 dark:text-emerald-400/60 mt-0.5">{g.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-3 border-t border-slate-100 dark:border-emerald-900/40">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-slate-700 dark:text-emerald-200 font-bold rounded-xl text-xs flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center space-x-1"
              >
                <span>Next: Training Split</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: WORKOUT PREFERENCE & SCHEDULE ================= */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black tracking-tight">Workout Location & Schedule</h2>
              <p className="text-xs text-slate-500 dark:text-emerald-300/70">
                Choose where you train and at what time so we can align your pre-workout meal and whey shake.
              </p>
            </div>

            {/* Gym vs Home Workout Choice */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-emerald-300 mb-1.5">
                Where do you work out?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setWorkoutLocation('gym')}
                  className={`p-4 rounded-2xl border text-left transition ${
                    workoutLocation === 'gym'
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold shadow-xs'
                      : 'bg-slate-50 dark:bg-[#071510] border-slate-200 dark:border-emerald-900/50 text-slate-600 dark:text-emerald-300/70 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 mb-1.5">
                    <span className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <Dumbbell className="w-4 h-4" />
                    </span>
                    <h4 className="font-bold text-sm">Gym Routine</h4>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-emerald-300/60">Full gym access: barbells, cables, leg press with video guides.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setWorkoutLocation('home')}
                  className={`p-4 rounded-2xl border text-left transition ${
                    workoutLocation === 'home'
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold shadow-xs'
                      : 'bg-slate-50 dark:bg-[#071510] border-slate-200 dark:border-emerald-900/50 text-slate-600 dark:text-emerald-300/70 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 mb-1.5">
                    <span className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                      <Home className="w-4 h-4" />
                    </span>
                    <h4 className="font-bold text-sm">Home Routine</h4>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-emerald-300/60">At-home routines: push-ups, dumbbell squats, calisthenics.</p>
                </button>
              </div>
            </div>

            {/* Frequency: How many times per week */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-emerald-300 mb-1.5">
                Training Frequency
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { days: 3, label: '3 Days / wk', desc: 'Push-Pull-Legs' },
                  { days: 4, label: '4 Days / wk', desc: 'Upper / Lower' },
                  { days: 5, label: '5 Days / wk', desc: 'Optimal Split' },
                  { days: 6, label: '6 Days / wk', desc: 'High Intensity' },
                ].map((item) => (
                  <button
                    key={item.days}
                    type="button"
                    onClick={() => setWorkoutDaysPerWeek(item.days)}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      workoutDaysPerWeek === item.days
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold'
                        : 'bg-slate-50 dark:bg-[#071510] border-slate-200 dark:border-emerald-900/50 text-slate-600 dark:text-emerald-300/70 hover:bg-slate-100'
                    }`}
                  >
                    <p className="text-xs font-bold">{item.label}</p>
                    <p className="text-[10px] text-slate-400 dark:text-emerald-400/60 mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Time of Gym / Workout */}
            <div className="bg-slate-50 dark:bg-[#071510] p-4 rounded-2xl border border-slate-200 dark:border-emerald-900/50 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold flex items-center space-x-1.5">
                    <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Preferred Workout Time Slot</span>
                  </label>
                  <p className="text-xs text-slate-500 dark:text-emerald-300/60 mt-0.5">
                    Aligns your pre-workout meal & protein shake alarms.
                  </p>
                </div>
                <input
                  type="time"
                  value={preferredWorkoutTime}
                  onChange={(e) => setPreferredWorkoutTime(e.target.value)}
                  className="bg-white dark:bg-[#0d221a] border border-emerald-300 dark:border-emerald-600 rounded-xl px-3 py-1.5 text-base font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none font-mono"
                />
              </div>

              {/* Quick time presets */}
              <div className="flex space-x-2 pt-1 text-xs">
                {[
                  { label: 'Morning (06:30 AM)', time: '06:30' },
                  { label: 'Afternoon (12:30 PM)', time: '12:30' },
                  { label: 'Evening (06:00 PM)', time: '18:00' },
                  { label: 'Night (08:30 PM)', time: '20:30' },
                ].map((preset) => (
                  <button
                    key={preset.time}
                    type="button"
                    onClick={() => setPreferredWorkoutTime(preset.time)}
                    className={`px-2.5 py-1 rounded-lg transition font-bold ${
                      preferredWorkoutTime === preset.time
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white dark:bg-[#0d221a] text-slate-600 dark:text-emerald-300 border border-slate-200 dark:border-emerald-900/40'
                    }`}
                  >
                    {preset.label.split('(')[0].trim()}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-3 border-t border-slate-100 dark:border-emerald-900/40">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-slate-700 dark:text-emerald-200 font-bold rounded-xl text-xs flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center space-x-1"
              >
                <span>Next: Job & Health Protocol</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: OCCUPATION & CUSTOMIZED PLAN ================= */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black tracking-tight">Daily Job & Health Regimen</h2>
              <p className="text-xs text-slate-500 dark:text-emerald-300/70">
                Calibrate daily energy burn and enable timed hair regrowth & supplement alarms.
              </p>
            </div>

            {/* Daily Activity Level / Job Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-emerald-300 mb-1.5 flex items-center space-x-1.5">
                <Briefcase className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Daily Job / Activity Level</span>
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'desk_job', label: 'Desk Job / Sedentary', desc: 'Sitting >6 hrs/day (IT, office, remote)' },
                  { id: 'standing_light', label: 'Lightly Active Job', desc: 'Standing / teaching / walking around' },
                  { id: 'active_retail', label: 'Active Retail / Nurse', desc: 'On feet all day, constant movement' },
                  { id: 'heavy_labor', label: 'Heavy Physical Labor', desc: 'Construction, athlete, intense lifting' },
                ].map((job) => (
                  <button
                    key={job.id}
                    type="button"
                    onClick={() => setOccupationType(job.id as OccupationType)}
                    className={`p-3 rounded-2xl border text-left transition ${
                      occupationType === job.id
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold'
                        : 'bg-slate-50 dark:bg-[#071510] border-slate-200 dark:border-emerald-900/50 text-slate-600 dark:text-emerald-300/70 hover:bg-slate-100'
                    }`}
                  >
                    <p className="text-xs font-bold">{job.label}</p>
                    <p className="text-[10px] text-slate-400 dark:text-emerald-400/60 mt-0.5">{job.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Hair Loss Regimen & Supplements Checkbox */}
            <div className="bg-purple-50/60 dark:bg-[#071510] border border-purple-200 dark:border-purple-900/50 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-start space-x-3">
                <span className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm">Hair Regrowth & Supplement Protocol</h4>
                  <p className="text-[11px] text-slate-500 dark:text-purple-300/70 mt-0.5">
                    Enable timely reminders for Minoxidil (AM/PM), Finasteride, Creatine, and Whey.
                  </p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={hasHairLossRegimen}
                onChange={(e) => setHasHairLossRegimen(e.target.checked)}
                className="w-5 h-5 rounded accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Calculated Plan Preview */}
            <div className="bg-emerald-50/60 dark:bg-[#071510] border border-emerald-100 dark:border-emerald-900/50 rounded-2xl p-4 space-y-2 text-xs">
              <span className="font-extrabold text-emerald-700 dark:text-emerald-400 uppercase text-[10px] tracking-wider">
                System Generated Targets
              </span>
              <div className="grid grid-cols-4 gap-2 text-center pt-1 font-mono">
                <div className="bg-white dark:bg-[#0d221a] p-2 rounded-xl border border-slate-200 dark:border-emerald-900/40">
                  <span className="text-[10px] text-slate-400 font-sans font-bold">Burn</span>
                  <p className="font-bold">{calculatedNutrition.tdee} kcal</p>
                </div>
                <div className="bg-white dark:bg-[#0d221a] p-2 rounded-xl border border-emerald-200 dark:border-emerald-700">
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-sans font-bold">Target Diet</span>
                  <p className="font-extrabold text-emerald-600 dark:text-emerald-400">{calculatedNutrition.targetCalories} kcal</p>
                </div>
                <div className="bg-white dark:bg-[#0d221a] p-2 rounded-xl border border-slate-200 dark:border-emerald-900/40">
                  <span className="text-[10px] text-teal-600 dark:text-teal-400 font-sans font-bold">Protein</span>
                  <p className="font-bold text-teal-600 dark:text-teal-400">{calculatedNutrition.targetProteinGrams}g</p>
                </div>
                <div className="bg-white dark:bg-[#0d221a] p-2 rounded-xl border border-slate-200 dark:border-emerald-900/40">
                  <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-sans font-bold">Water</span>
                  <p className="font-bold text-cyan-600 dark:text-cyan-400">{calculatedNutrition.targetWaterMl} ml</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-3 border-t border-slate-100 dark:border-emerald-900/40">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-slate-700 dark:text-emerald-200 font-bold rounded-xl text-xs flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                onClick={handleFinishOnboarding}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-extrabold rounded-xl text-sm shadow-md hover:from-emerald-500 hover:to-teal-400 transition flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Save Profile & Launch Hub</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
