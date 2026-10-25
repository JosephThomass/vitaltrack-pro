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
  X
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
    name: name || 'Fitness Athlete',
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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900/95 border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-auto">
        {/* Top Header with Close button if allowed */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase font-semibold">
              VitalTrack Core Access
            </span>
          </div>

          {onClose && (
            <button 
              onClick={onClose}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Step Progress Bar (Only shown when not in "Found Account" mode) */}
        {!foundAccount && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold mb-2">
              <span className="text-zinc-300">
                Phase {currentStep} of 4: {
                  currentStep === 1 ? 'Mobile Authentication' :
                  currentStep === 2 ? 'Biometrics & BMI Analysis' :
                  currentStep === 3 ? 'Training Split & Time' :
                  'Metabolic Engine & Protocol'
                }
              </span>
              <span className="text-emerald-400 font-mono font-bold">{currentStep * 25}%</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-500 rounded-full"
                style={{ width: `${currentStep * 25}%` }}
              />
            </div>
          </div>
        )}

        {/* ================= STEP 1: MOBILE & OTP REGISTRATION ================= */}
        {currentStep === 1 && !foundAccount && (
          <div className="space-y-6">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 text-emerald-400 border border-zinc-700/80 flex items-center justify-center mx-auto mb-2 shadow-inner">
                <Smartphone className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Access Your Profile</h2>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Sign in with your mobile phone number. If you previously registered, your sessions, meals, and hair loss protocol will resume instantly.
              </p>
            </div>

            {/* Mobile Number Entry */}
            <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-5 space-y-4 shadow-inner">
              <div>
                <label className="block text-[11px] font-semibold tracking-wider uppercase text-zinc-400 mb-1.5">
                  Mobile Phone Number
                </label>
                <div className="flex items-center space-x-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    disabled={otpSent}
                    className="bg-zinc-900 border border-zinc-700 text-white text-sm font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500"
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
                    className="flex-1 bg-zinc-900 border border-zinc-700 text-white text-base rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 tracking-wider font-mono"
                  />
                </div>
              </div>

              {!otpSent ? (
                <button
                  onClick={handleSendOtp}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition flex items-center justify-center space-x-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Send Verification Code</span>
                </button>
              ) : (
                /* OTP Verification Section */
                <div className="space-y-4 pt-2 border-t border-zinc-800/80">
                  {/* Demo SMS Simulator Badge */}
                  <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-zinc-300">
                        Demo SMS Code: <strong className="font-mono text-emerald-400 text-sm">{generatedOtp}</strong>
                      </span>
                    </div>
                    <button
                      onClick={handleAutoFillOtp}
                      className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-[11px] rounded-lg transition"
                    >
                      Auto-Fill Code
                    </button>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                        Enter 6-Digit OTP
                      </label>
                      <span className="text-[11px] text-zinc-500 font-mono">
                        {otpTimer > 0 ? `Resend in ${otpTimer}s` : (
                          <button onClick={handleSendOtp} className="text-emerald-400 hover:underline">Resend OTP</button>
                        )}
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="• • • • • •"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full bg-zinc-900 border border-zinc-700 text-white text-center text-xl font-mono tracking-[0.5em] rounded-xl py-3 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {otpError && (
                    <p className="text-xs text-rose-400 text-center font-medium">{otpError}</p>
                  )}

                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      onClick={() => setOtpSent(false)}
                      className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-xl text-xs"
                    >
                      Change Number
                    </button>
                    <button
                      onClick={handleVerifyOtp}
                      className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center space-x-1.5"
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
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 font-bold inline-block">
                Existing Profile Verified
              </span>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Welcome Back, {foundAccount.profile.name}!
              </h2>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                We retrieved your profile for <strong className="text-zinc-200 font-mono">{foundAccount.phoneNumber}</strong>. All your logged workouts, scheduled meals, and hair loss tracking are safely stored.
              </p>
            </div>

            {/* Profile Overview Card */}
            <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold">Goal</span>
                  <p className="font-bold text-white capitalize mt-0.5">
                    {foundAccount.profile.goal.replace('_', ' ')}
                  </p>
                </div>

                <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold">Current Weight</span>
                  <p className="font-bold text-emerald-400 mt-0.5">{foundAccount.profile.weightKg} kg</p>
                </div>

                <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold">Goal Weight</span>
                  <p className="font-bold text-teal-400 mt-0.5">
                    {foundAccount.profile.goalWeightKg || foundAccount.profile.systemRecommendedWeightKg || foundAccount.profile.weightKg} kg
                  </p>
                </div>

                <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold">Training Mode</span>
                  <p className="font-bold text-cyan-400 mt-0.5 capitalize">
                    {foundAccount.profile.workoutLocation} ({foundAccount.profile.workoutDaysPerWeek}d/wk)
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 px-1 text-[11px] text-zinc-400">
                <span>Workouts logged: <strong className="text-white">{foundAccount.loggedWorkouts.length}</strong></span>
                <span>Scheduled meals: <strong className="text-white">{foundAccount.mealSlots.length}</strong></span>
                <span>Hair Loss Stack: <strong className="text-emerald-400">{foundAccount.profile.hasHairLossRegimen ? 'Active' : 'Disabled'}</strong></span>
              </div>
            </div>

            {/* Resume or Edit Actions */}
            <div className="space-y-2.5">
              <button
                onClick={() => handleResumeExisting(foundAccount)}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-zinc-950 font-black rounded-xl text-sm shadow-xl shadow-emerald-500/25 hover:opacity-95 transition flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Resume Session Exactly Where I Left Off</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleReviewBiometrics(foundAccount)}
                className="w-full py-2.5 bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-xl border border-zinc-700/60 transition"
              >
                Review & Update Biometric Analysis
              </button>

              <div className="text-center pt-1">
                <button
                  onClick={() => {
                    setFoundAccount(null);
                    setOtpSent(false);
                    setPhoneNumber('');
                    setEnteredOtp('');
                  }}
                  className="text-xs text-zinc-500 hover:text-zinc-300 transition"
                >
                  Use a different mobile number
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 2: BIOMETRICS & SCIENTIFIC BMI ANALYSIS ================= */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold text-white tracking-tight">Personal Biometrics & BMI Engine</h2>
              <p className="text-xs text-zinc-400">
                Scientific analysis of your height, weight, and automated calculation of your optimal target weight.
              </p>
            </div>

            {/* Name, Age, Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">Age</label>
                <input
                  type="number"
                  min="14"
                  max="99"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 25)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            {/* Height & Weight Sliders */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-950/80 p-3.5 rounded-2xl border border-zinc-800">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-zinc-400">Current Weight</label>
                  <span className="text-sm font-bold text-white font-mono">{weightKg} kg</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="160"
                  step="0.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="bg-zinc-950/80 p-3.5 rounded-2xl border border-zinc-800">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-zinc-400">Height</label>
                  <span className="text-sm font-bold text-white font-mono">{heightCm} cm</span>
                </div>
                <input
                  type="range"
                  min="130"
                  max="220"
                  value={heightCm}
                  onChange={(e) => setHeightCm(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Scientific BMI & System Recommended Goal Weight Card */}
            <div className="bg-zinc-950/90 border border-emerald-500/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Scale className="w-4 h-4 text-emerald-400" />
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                    Scientific BMI Metric & Optimal Target
                  </span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-700 ${bmiDetails.color}`}>
                  {bmiDetails.category} (BMI {bmiDetails.bmi})
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-zinc-900/80 p-2 rounded-xl border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase">Calculated BMI</span>
                  <p className="text-base font-bold text-white font-mono">{bmiDetails.bmi}</p>
                </div>

                <div className="bg-zinc-900/80 p-2 rounded-xl border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase">Normal Range</span>
                  <p className="text-xs font-bold text-zinc-300 mt-1 font-mono">{bmiDetails.minHealthyWeight}–{bmiDetails.maxHealthyWeight} kg</p>
                </div>

                <div className="bg-zinc-900/80 p-2 rounded-xl border border-emerald-500/40">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">System Target</span>
                  <p className="text-base font-bold text-emerald-400 font-mono">{bmiDetails.systemRecommendedWeight} kg</p>
                </div>
              </div>

              <p className="text-[11px] text-zinc-300 leading-snug">{bmiDetails.advice}</p>

              {/* Goal Weight Selector */}
              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-white">Your Target Goal Weight:</label>
                  <p className="text-[10px] text-zinc-400">Pre-set to system recommendation or customize</p>
                </div>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="number"
                    step="0.5"
                    value={goalWeightKg}
                    onChange={(e) => setGoalWeightKg(parseFloat(e.target.value) || bmiDetails.systemRecommendedWeight)}
                    className="w-20 bg-zinc-900 border border-emerald-500/50 rounded-xl px-2 py-1.5 text-center text-sm font-bold text-white focus:outline-none font-mono"
                  />
                  <span className="text-xs text-zinc-400">kg</span>
                </div>
              </div>
            </div>

            {/* Primary Goal Selector */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
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
                        ? 'bg-emerald-500/15 border-emerald-500 text-white font-bold'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                    }`}
                  >
                    <p className="text-xs text-white">{g.label}</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{g.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-3 border-t border-zinc-800">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-xl text-xs flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl text-xs shadow-lg transition flex items-center space-x-1"
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
              <h2 className="text-2xl font-bold text-white tracking-tight">Workout Location & Schedule</h2>
              <p className="text-xs text-zinc-400">
                Choose where you train and at what time of day so we can time your meals, whey shake, and alarms.
              </p>
            </div>

            {/* Gym vs Home Workout Choice */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Where do you work out?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setWorkoutLocation('gym')}
                  className={`p-4 rounded-2xl border text-left transition ${
                    workoutLocation === 'gym'
                      ? 'bg-emerald-500/15 border-emerald-500 text-white font-bold'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 mb-1.5">
                    <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Dumbbell className="w-4 h-4" />
                    </span>
                    <h4 className="font-bold text-white text-sm">Gym Routine</h4>
                  </div>
                  <p className="text-[11px] text-zinc-400">Full gym access: barbells, cables, leg press, lat pulldowns with video guides.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setWorkoutLocation('home')}
                  className={`p-4 rounded-2xl border text-left transition ${
                    workoutLocation === 'home'
                      ? 'bg-emerald-500/15 border-emerald-500 text-white font-bold'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 mb-1.5">
                    <span className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                      <Home className="w-4 h-4" />
                    </span>
                    <h4 className="font-bold text-white text-sm">Home Routine</h4>
                  </div>
                  <p className="text-[11px] text-zinc-400">At-home routines: floor push-ups, dumbbell goblet squats, core calisthenics.</p>
                </button>
              </div>
            </div>

            {/* Frequency: How many times per week */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
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
                        ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                    }`}
                  >
                    <p className="text-xs font-bold text-white">{item.label}</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Time of Gym / Workout */}
            <div className="bg-zinc-950/80 p-4 rounded-2xl border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span>Preferred Workout Time Slot</span>
                  </label>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Used to automatically align your Pre-Workout meal, Whey shake & alarms.
                  </p>
                </div>
                <input
                  type="time"
                  value={preferredWorkoutTime}
                  onChange={(e) => setPreferredWorkoutTime(e.target.value)}
                  className="bg-zinc-900 border border-emerald-500/40 rounded-xl px-3 py-1.5 text-base font-bold text-emerald-400 focus:outline-none font-mono"
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
                    className={`px-2.5 py-1 rounded-lg transition ${
                      preferredWorkoutTime === preset.time
                        ? 'bg-emerald-500 text-zinc-950 font-bold'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {preset.label.split('(')[0].trim()}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-3 border-t border-zinc-800">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-xl text-xs flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl text-xs shadow-lg transition flex items-center space-x-1"
              >
                <span>Next: Job & Regimen</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: OCCUPATION & CUSTOMIZED PLAN ================= */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold text-white tracking-tight">Occupation & Protocol Stack</h2>
              <p className="text-xs text-zinc-400">
                Calibrate daily energy burn and enable timed hair regrowth & supplement alarms.
              </p>
            </div>

            {/* Daily Activity Level / Job Type */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center space-x-1.5">
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                <span>Daily Job / Occupation Activity Level</span>
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
                        ? 'bg-emerald-500/15 border-emerald-500 text-white font-bold'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                    }`}
                  >
                    <p className="text-xs font-bold text-white">{job.label}</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{job.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Hair Loss Regimen & Supplements Checkbox */}
            <div className="bg-purple-950/20 border border-purple-500/30 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-start space-x-3">
                <span className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">Hair Regrowth & Supplement Protocol</h4>
                  <p className="text-[11px] text-zinc-300 mt-0.5">
                    Enable timely reminders for Minoxidil (AM/PM), Finasteride, Creatine, and Whey.
                  </p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={hasHairLossRegimen}
                onChange={(e) => setHasHairLossRegimen(e.target.checked)}
                className="w-5 h-5 rounded accent-purple-500 cursor-pointer"
              />
            </div>

            {/* Calculated Plan Preview */}
            <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 space-y-2 text-xs">
              <span className="font-bold text-emerald-400 uppercase text-[10px] tracking-wider font-mono">
                System Generated Blueprint
              </span>
              <div className="grid grid-cols-4 gap-2 text-center pt-1 font-mono">
                <div className="bg-zinc-900/80 p-2 rounded-xl">
                  <span className="text-[10px] text-zinc-500 font-sans">TDEE Burn</span>
                  <p className="font-bold text-white">{calculatedNutrition.tdee} kcal</p>
                </div>
                <div className="bg-zinc-900/80 p-2 rounded-xl">
                  <span className="text-[10px] text-emerald-400 font-sans">Target Diet</span>
                  <p className="font-bold text-emerald-400">{calculatedNutrition.targetCalories} kcal</p>
                </div>
                <div className="bg-zinc-900/80 p-2 rounded-xl">
                  <span className="text-[10px] text-cyan-400 font-sans">Protein</span>
                  <p className="font-bold text-cyan-400">{calculatedNutrition.targetProteinGrams}g</p>
                </div>
                <div className="bg-zinc-900/80 p-2 rounded-xl">
                  <span className="text-[10px] text-blue-400 font-sans">Daily Water</span>
                  <p className="font-bold text-blue-400">{calculatedNutrition.targetWaterMl} ml</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-3 border-t border-zinc-800">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-xl text-xs flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                onClick={handleFinishOnboarding}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-zinc-950 font-black rounded-xl text-sm shadow-xl shadow-emerald-500/25 hover:opacity-95 transition flex items-center space-x-2"
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
