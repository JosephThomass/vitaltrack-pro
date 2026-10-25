import React, { useState, useEffect } from 'react';
import { 
  Play, 
  CheckCircle, 
  Clock, 
  Dumbbell, 
  Plus, 
  RotateCcw, 
  Info, 
  Flame, 
  X, 
  Award,
  ChevronRight,
  Sparkles,
  Timer,
  Zap,
  Film
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Exercise, LoggedExercise, LoggedWorkout, WorkoutRoutine } from '../types';
import { soundManager } from '../utils/audio';
import { ExerciseMotionPlayer } from './ExerciseMotionPlayer';

interface WorkoutSectionProps {
  routines: WorkoutRoutine[];
  loggedWorkouts: LoggedWorkout[];
  onLogWorkout: (workout: LoggedWorkout) => void;
  weightKg: number;
  workoutLocation?: 'gym' | 'home';
}

export const WorkoutSection: React.FC<WorkoutSectionProps> = ({
  routines,
  loggedWorkouts,
  onLogWorkout,
  weightKg,
  workoutLocation = 'gym',
}) => {
  const [locationFilter, setLocationFilter] = useState<'all' | 'gym' | 'home'>(workoutLocation);
  const initialRoutine = routines.find(r => workoutLocation === 'home' ? r.location === 'home' : r.id === 'push-day') || routines[0];
  const [selectedRoutineId, setSelectedRoutineId] = useState<string>(initialRoutine?.id || routines[0]?.id || 'push-day');
  const [videoModalExercise, setVideoModalExercise] = useState<Exercise | null>(null);

  // Active workout session state
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [sessionDurationSec, setSessionDurationSec] = useState<number>(0);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number>(0);
  const [activeSets, setActiveSets] = useState<Record<string, { weightKg: number; reps: number; completed: boolean }[]>>({});

  // Rest timer state
  const [restTimerSeconds, setRestTimerSeconds] = useState<number>(0);
  const [isRestTimerRunning, setIsRestTimerRunning] = useState<boolean>(false);

  const currentRoutine = routines.find((r) => r.id === selectedRoutineId) || routines[0];

  // Rest timer countdown effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRestTimerRunning && restTimerSeconds > 0) {
      interval = setInterval(() => {
        setRestTimerSeconds((prev) => {
          if (prev <= 1) {
            soundManager.playTimerBeep(true);
            setIsRestTimerRunning(false);
            return 0;
          }
          if (prev <= 4) {
            soundManager.playTimerBeep(false);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRestTimerRunning, restTimerSeconds]);

  // Workout duration stopwatch effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isSessionActive && sessionStartTime) {
      interval = setInterval(() => {
        setSessionDurationSec(Math.floor((Date.now() - sessionStartTime) / 1000));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSessionActive, sessionStartTime]);

  const startWorkoutSession = () => {
    setIsSessionActive(true);
    setSessionStartTime(Date.now());
    setSessionDurationSec(0);
    setActiveExerciseIndex(0);

    // Initialize set entries for all exercises in current routine
    const initialSets: Record<string, { weightKg: number; reps: number; completed: boolean }[]> = {};
    currentRoutine.exercises.forEach((ex) => {
      const setsArr = [];
      const repRange = parseInt(ex.defaultReps.split('-')[0]) || 10;
      for (let i = 0; i < ex.defaultSets; i++) {
        setsArr.push({
          weightKg: 20, // default starter weight
          reps: repRange,
          completed: false,
        });
      }
      initialSets[ex.id] = setsArr;
    });
    setActiveSets(initialSets);
    soundManager.playChime('success');
  };

  const handleSetToggle = (exerciseId: string, setIndex: number, restSeconds: number) => {
    const currentList = activeSets[exerciseId] || [];
    const updated = [...currentList];
    const willBeCompleted = !updated[setIndex].completed;
    updated[setIndex] = {
      ...updated[setIndex],
      completed: willBeCompleted,
    };

    setActiveSets({
      ...activeSets,
      [exerciseId]: updated,
    });

    if (willBeCompleted) {
      soundManager.playChime('gentle');
      // Start rest timer
      setRestTimerSeconds(restSeconds);
      setIsRestTimerRunning(true);
    }
  };

  const handleSetFieldChange = (
    exerciseId: string,
    setIndex: number,
    field: 'weightKg' | 'reps',
    value: number
  ) => {
    const currentList = activeSets[exerciseId] || [];
    const updated = [...currentList];
    updated[setIndex] = {
      ...updated[setIndex],
      [field]: Math.max(0, value),
    };
    setActiveSets({
      ...activeSets,
      [exerciseId]: updated,
    });
  };

  const addExtraSet = (exerciseId: string) => {
    const currentList = activeSets[exerciseId] || [];
    const lastSet = currentList[currentList.length - 1] || { weightKg: 20, reps: 10 };
    setActiveSets({
      ...activeSets,
      [exerciseId]: [
        ...currentList,
        {
          weightKg: lastSet.weightKg,
          reps: lastSet.reps,
          completed: false,
        },
      ],
    });
  };

  const finishWorkoutSession = () => {
    const minutes = Math.max(1, Math.round(sessionDurationSec / 60));
    // Estimate calories burned: lifting MET ~ 5.5 to 6.0
    const caloriesBurned = Math.round((5.8 * 3.5 * weightKg) / 200 * minutes);

    const loggedExercises: LoggedExercise[] = currentRoutine.exercises.map((ex) => {
      const setsData = activeSets[ex.id] || [];
      return {
        exerciseId: ex.id,
        exerciseName: ex.name,
        muscleGroup: ex.muscleGroup,
        sets: setsData.map((s, idx) => ({
          setNumber: idx + 1,
          weightKg: s.weightKg,
          reps: s.reps,
          completed: s.completed,
        })),
      };
    });

    const newWorkout: LoggedWorkout = {
      id: `workout-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      routineTitle: currentRoutine.title,
      exercises: loggedExercises,
      durationMinutes: minutes,
      caloriesBurned,
      completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    onLogWorkout(newWorkout);
    setIsSessionActive(false);
    setIsRestTimerRunning(false);

    soundManager.playChime('success');
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const formatSec = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-6">
      {/* Header & Routine Selector */}
      <div className="bg-white dark:bg-[#0d221a] border border-emerald-100 dark:border-emerald-900/50 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-wider uppercase mb-1">
              <Dumbbell className="w-4 h-4" />
              <span>Gym Workout Assistant</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-emerald-50 tracking-tight">{currentRoutine.title}</h2>
            <p className="text-slate-500 dark:text-emerald-300/70 text-sm mt-1 max-w-2xl">{currentRoutine.description}</p>
          </div>

          <div className="flex items-center space-x-3">
            {!isSessionActive ? (
              <button
                onClick={startWorkoutSession}
                className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold shadow-lg shadow-emerald-600/20 transition-all transform hover:-translate-y-0.5"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Start Gym Workout</span>
              </button>
            ) : (
              <button
                onClick={finishWorkoutSession}
                className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-amber-500/25 transition-all animate-pulse"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Finish & Log ({formatSec(sessionDurationSec)})</span>
              </button>
            )}
          </div>
        </div>

        {/* Location Filter & Routine Category Pills */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center space-x-2">
            {[
              { id: 'all', label: 'All Routines' },
              { id: 'gym', label: '🏋️ Gym Routines' },
              { id: 'home', label: '🏠 Home Routines' },
            ].map((loc) => (
              <button
                key={loc.id}
                disabled={isSessionActive}
                onClick={() => setLocationFilter(loc.id as typeof locationFilter)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  locationFilter === loc.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-[#071510] text-slate-600 dark:text-emerald-300/70 hover:bg-slate-200 dark:hover:bg-[#071510]/80 border border-slate-200 dark:border-emerald-900/40'
                }`}
              >
                {loc.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {routines
              .filter((r) => {
                if (locationFilter === 'gym') return r.location !== 'home';
                if (locationFilter === 'home') return r.location === 'home';
                return true;
              })
              .map((routine) => (
                <button
                  key={routine.id}
                  disabled={isSessionActive}
                  onClick={() => setSelectedRoutineId(routine.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedRoutineId === routine.id
                      ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 shadow-xs'
                      : 'bg-slate-50 dark:bg-[#071510] text-slate-600 dark:text-emerald-300/60 border border-slate-200 dark:border-emerald-900/40 hover:text-emerald-600 hover:bg-white'
                  } ${isSessionActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {routine.title.split('(')[0].trim()}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Floating Active Rest Timer Bar if active */}
      {isRestTimerRunning && (
        <div className="fixed bottom-6 right-6 z-50 bg-white dark:bg-[#0d221a] border-2 border-emerald-500 rounded-2xl p-4 shadow-2xl flex items-center space-x-4 animate-bounce duration-1000">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-black text-lg border border-emerald-300 dark:border-emerald-800">
            {restTimerSeconds}s
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1">
              <Timer className="w-3.5 h-3.5" />
              <span>Rest Timer Active</span>
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-emerald-100">Breathe deep & hydrate</p>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setRestTimerSeconds((prev) => prev + 15)}
              className="px-2 py-1 bg-slate-100 dark:bg-[#071510] hover:bg-slate-200 dark:hover:bg-emerald-950 text-xs text-slate-700 dark:text-emerald-300 rounded-lg font-bold"
            >
              +15s
            </button>
            <button
              onClick={() => {
                setIsRestTimerRunning(false);
                setRestTimerSeconds(0);
              }}
              className="p-1 hover:bg-slate-100 dark:hover:bg-[#071510] text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Exercise Cards List */}
      <div className="space-y-5">
        {currentRoutine.exercises.map((exercise, index) => {
          const setsData = activeSets[exercise.id] || [];
          const isCompletedOverall = setsData.length > 0 && setsData.every((s) => s.completed);

          return (
            <div
              key={exercise.id}
              className={`rounded-3xl border transition-all overflow-hidden shadow-xs ${
                isCompletedOverall
                  ? 'border-emerald-400 dark:border-emerald-700 bg-emerald-50/40 dark:bg-[#0d221a]'
                  : 'bg-white dark:bg-[#0d221a] border-emerald-100 dark:border-emerald-900/50 hover:border-emerald-300'
              }`}
            >
              {/* Exercise Header */}
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-emerald-900/40">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-[#071510] text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-center font-black text-sm shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-lg font-black text-slate-900 dark:text-emerald-50">{exercise.name}</h3>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                        {exercise.muscleGroup}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-emerald-300/60 bg-slate-100 dark:bg-[#071510] px-2 py-0.5 rounded-lg border border-slate-200 dark:border-emerald-900/50">
                        {exercise.equipment}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-emerald-300/70">
                      <span>Target: <strong className="text-slate-800 dark:text-emerald-100">{exercise.defaultSets} sets × {exercise.defaultReps} reps</strong></span>
                      <span>Rest: <strong className="text-slate-800 dark:text-emerald-100">{exercise.restSeconds}s</strong></span>
                    </div>
                  </div>
                </div>

                {/* Animation & Video Explanation CTA */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setVideoModalExercise(exercise)}
                    className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md shadow-emerald-600/20 group"
                  >
                    <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300 group-hover:scale-110 transition-transform" />
                    <span>⚡ Quick Form Animation</span>
                  </button>
                </div>
              </div>

              {/* Form cues & Common Mistakes Quick Preview */}
              <div className="px-5 py-3.5 bg-slate-50/70 dark:bg-[#071510]/50 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs border-b border-slate-100 dark:border-emerald-900/40">
                <div className="space-y-1">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider text-[10px]">Key Biomechanical Cues:</span>
                  <ul className="list-disc list-inside text-slate-700 dark:text-emerald-200/90 space-y-0.5">
                    {exercise.formCues.slice(0, 2).map((cue, i) => (
                      <li key={i} className="truncate">{cue}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider text-[10px]">Mistakes To Avoid:</span>
                  <ul className="list-disc list-inside text-slate-600 dark:text-rose-200/70 space-y-0.5">
                    {exercise.commonMistakes.slice(0, 2).map((m, i) => (
                      <li key={i} className="truncate">{m}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Workout Set Tracker (Interactive during session) */}
              {isSessionActive && (
                <div className="p-5 space-y-3">
                  <div className="grid grid-cols-12 gap-2 text-xs font-bold text-slate-400 dark:text-emerald-400/60 uppercase tracking-wider px-2">
                    <div className="col-span-2">Set</div>
                    <div className="col-span-4">Weight (kg)</div>
                    <div className="col-span-4">Reps</div>
                    <div className="col-span-2 text-center">Done</div>
                  </div>

                  {setsData.map((set, setIdx) => (
                    <div
                      key={setIdx}
                      className={`grid grid-cols-12 gap-2 items-center p-2.5 rounded-2xl transition-all ${
                        set.completed
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                          : 'bg-slate-50 dark:bg-[#071510] border border-slate-200 dark:border-emerald-900/40'
                      }`}
                    >
                      <div className="col-span-2 font-black text-sm text-slate-800 dark:text-emerald-100 pl-1">
                        #{setIdx + 1}
                      </div>

                      <div className="col-span-4">
                        <div className="flex items-center space-x-1">
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={set.weightKg}
                            onChange={(e) => handleSetFieldChange(exercise.id, setIdx, 'weightKg', parseFloat(e.target.value) || 0)}
                            className="w-full bg-white dark:bg-[#0d221a] border border-slate-200 dark:border-emerald-800 rounded-xl px-2.5 py-1.5 text-sm text-slate-900 dark:text-white font-bold focus:outline-none focus:border-emerald-500"
                          />
                          <span className="text-xs text-slate-400 hidden sm:inline">kg</span>
                        </div>
                      </div>

                      <div className="col-span-4">
                        <input
                          type="number"
                          min="1"
                          value={set.reps}
                          onChange={(e) => handleSetFieldChange(exercise.id, setIdx, 'reps', parseInt(e.target.value) || 0)}
                          className="w-full bg-white dark:bg-[#0d221a] border border-slate-200 dark:border-emerald-800 rounded-xl px-2.5 py-1.5 text-sm text-slate-900 dark:text-white font-bold focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="col-span-2 flex justify-center">
                        <button
                          onClick={() => handleSetToggle(exercise.id, setIdx, exercise.restSeconds)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                            set.completed
                              ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/30'
                              : 'bg-slate-200 dark:bg-emerald-950 text-slate-500 dark:text-emerald-400 hover:bg-emerald-100 hover:text-emerald-700'
                          }`}
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => addExtraSet(exercise.id)}
                    className="flex items-center space-x-1.5 text-xs text-slate-600 dark:text-emerald-400 hover:text-emerald-600 px-3.5 py-2 rounded-xl border border-dashed border-slate-300 dark:border-emerald-800 hover:border-emerald-500 transition font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Set</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Previous Logged Workouts History */}
      {loggedWorkouts.length > 0 && (
        <div className="bg-white dark:bg-[#0d221a] border border-emerald-100 dark:border-emerald-900/50 rounded-3xl p-6 shadow-sm mt-8">
          <div className="flex items-center space-x-2 mb-4">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-black text-slate-900 dark:text-emerald-50">Recent Logged Sessions</h3>
          </div>
          <div className="space-y-3">
            {loggedWorkouts.slice(-3).reverse().map((w) => (
              <div key={w.id} className="p-4 bg-slate-50 dark:bg-[#071510] border border-slate-200 dark:border-emerald-900/40 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white text-sm">{w.routineTitle}</h4>
                  <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-emerald-300/60 mt-1 font-medium">
                    <span>{w.date} at {w.completedAt}</span>
                    <span>•</span>
                    <span>{w.durationMinutes} mins</span>
                    <span>•</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{w.exercises.length} exercises logged</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-amber-600 dark:text-amber-400 font-black text-sm">
                    <Flame className="w-4 h-4 fill-current" />
                    <span>~{w.caloriesBurned} kcal</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Burned</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Modal with Embedded YouTube Video & Comprehensive Form Guide */}
      {videoModalExercise && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d221a] text-slate-900 dark:text-emerald-50 border border-emerald-200 dark:border-emerald-900/60 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 px-6 border-b border-slate-100 dark:border-emerald-900/40 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center space-x-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-current" />
                  <span>Interactive Form Animation & Biomechanics Guide</span>
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">{videoModalExercise.name}</h3>
              </div>
              <button
                onClick={() => setVideoModalExercise(null)}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-[#071510] hover:bg-slate-200 dark:hover:bg-emerald-950 text-slate-500 dark:text-emerald-300 flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Interactive Animated Motion Player & GIF Engine */}
            <div className="w-full">
              <ExerciseMotionPlayer exercise={videoModalExercise} />
            </div>

            {/* Form cues & Common Mistakes Tabbed Detail */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Pro Biomechanical Execution Cues:</span>
                </h4>
                <div className="space-y-2">
                  {videoModalExercise.formCues.map((cue, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-sm text-slate-700 dark:text-emerald-200 bg-slate-50 dark:bg-[#071510] p-3 rounded-2xl border border-slate-200 dark:border-emerald-900/40">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{cue}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <Info className="w-4 h-4" />
                  <span>Injury Risks & Common Mistakes:</span>
                </h4>
                <div className="space-y-2">
                  {videoModalExercise.commonMistakes.map((mistake, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-sm text-slate-700 dark:text-rose-200/90 bg-rose-50 dark:bg-rose-950/20 p-3 rounded-2xl border border-rose-200 dark:border-rose-900/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-2" />
                      <span>{mistake}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 bg-slate-50 dark:bg-[#071510] border-t border-slate-100 dark:border-emerald-900/40 flex justify-end">
              <button
                onClick={() => setVideoModalExercise(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-emerald-950 hover:bg-slate-300 dark:hover:bg-emerald-900 text-slate-800 dark:text-emerald-200 text-sm font-bold transition"
              >
                Close Video Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
