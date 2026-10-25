import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Zap, 
  Film, 
  Video, 
  Sparkles, 
  ShieldAlert, 
  Activity, 
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { Exercise } from '../types';

interface ExerciseMotionPlayerProps {
  exercise: Exercise;
  autoPlay?: boolean;
}

export const ExerciseMotionPlayer: React.FC<ExerciseMotionPlayerProps> = ({
  exercise,
  autoPlay = true,
}) => {
  const [activeTab, setActiveTab] = useState<'animation' | 'gif' | 'video'>('animation');
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [speed, setSpeed] = useState<number>(1.0); // 0.5, 1.0, 1.5
  const [animProgress, setAnimProgress] = useState<number>(0); // 0 to 1
  const [repCount, setRepCount] = useState<number>(1);
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);

  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Normal rep cycle takes ~3.5 seconds (2s down, 0.5s pause, 1s up)
  const BASE_CYCLE_MS = 3200;

  useEffect(() => {
    if (!isPlaying) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      lastTimeRef.current = null;
      return;
    }

    const animate = (time: number) => {
      if (lastTimeRef.current != null) {
        const delta = (time - lastTimeRef.current) * speed;
        setAnimProgress((prev) => {
          const next = prev + delta / BASE_CYCLE_MS;
          if (next >= 1) {
            setRepCount((r) => (r >= 99 ? 1 : r + 1));
            return next % 1;
          }
          return next;
        });
      }
      lastTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, speed]);

  // Derive phase from progress:
  // 0.0 - 0.5: Eccentric (Lowering / Lengthening)
  // 0.5 - 0.6: Bottom Stretch / Turnaround
  // 0.6 - 0.9: Concentric (Lifting / Contracting)
  // 0.9 - 1.0: Peak Squeeze / Reset
  let phaseName = 'Eccentric (Lowering)';
  let phaseColor = 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800';
  let phaseDesc = 'Controlled descent — build muscle tension and stretch the muscle';
  let motionPercent = 0; // 0 to 1 representing position (0=top, 1=bottom)

  if (animProgress < 0.5) {
    // Going from 0 to 1
    motionPercent = animProgress / 0.5;
    phaseName = 'Eccentric (Lowering)';
    phaseColor = 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800';
    phaseDesc = 'Control descent (2-3s) without bouncing';
  } else if (animProgress < 0.6) {
    motionPercent = 1;
    phaseName = 'Pause & Stretch';
    phaseColor = 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 border-cyan-300 dark:border-cyan-800';
    phaseDesc = 'Momentum eliminated — deep safe stretch';
  } else if (animProgress < 0.9) {
    // Going from 1 back to 0
    motionPercent = 1 - (animProgress - 0.6) / 0.3;
    phaseName = 'Concentric (Power Lift)';
    phaseColor = 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800';
    phaseDesc = 'Explosive drive through working muscles';
  } else {
    motionPercent = 0;
    phaseName = 'Peak Squeeze & Lock';
    phaseColor = 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 border-purple-300 dark:border-purple-800';
    phaseDesc = 'Hard 1-second muscle contraction';
  }

  // Smooth sinusoidal ease for visual natural movement
  const easedY = Math.sin(motionPercent * (Math.PI / 2));

  // Determine specific exercise motion key
  const exId = exercise.id.toLowerCase();
  const muscle = exercise.muscleGroup;

  // Render SVG Biomechanical Motion Visualizer based on exercise category
  const renderBiomechanicalVisualizer = () => {
    // 1. BENCH PRESS & PUSHUPS
    if (exId.includes('bench') || exId.includes('pushup') || exId.includes('press') && muscle === 'Chest') {
      const barY = 120 + easedY * 65; // Bar moves from y=120 down to y=185
      const pecGlow = 0.3 + (1 - motionPercent) * 0.7; // Brighter at top press
      const elbowX = 140 - (1 - easedY) * 20;

      return (
        <svg viewBox="0 0 400 280" className="w-full h-full select-none">
          {/* Bench frame */}
          <rect x="70" y="210" width="260" height="14" rx="4" fill="#334155" />
          <rect x="110" y="224" width="16" height="40" fill="#1e293b" />
          <rect x="274" y="224" width="16" height="40" fill="#1e293b" />
          {/* Bench pad */}
          <rect x="80" y="196" width="240" height="16" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.4" />

          {/* Lifter Body Torso (Lying flat on bench) */}
          <ellipse cx="200" cy="190" rx="70" ry="14" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          {/* Head & Neck */}
          <circle cx="100" cy="188" r="16" fill="#334155" />
          
          {/* Chest Pectoralis Major (Target Muscle Glowing in Vert Theme) */}
          <ellipse 
            cx="195" 
            cy="186" 
            rx="38" 
            ry="11" 
            fill="#10b981" 
            fillOpacity={pecGlow}
            stroke="#34d399"
            strokeWidth={2}
            className="transition-all duration-150"
          />
          <text x="195" y="190" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold" opacity={pecGlow > 0.6 ? 1 : 0.6}>
            CHEST {motionPercent < 0.2 ? 'MAX CONTRACTION' : 'STRETCH'}
          </text>

          {/* Left & Right Arms (Shoulder to Elbow, Elbow to Wrist/Bar) */}
          {/* Upper Arm */}
          <line x1="160" y1="188" x2={elbowX} y2={188 + easedY * 18} stroke="#64748b" strokeWidth="8" strokeLinecap="round" />
          {/* Forearm extending to Bar */}
          <line x1={elbowX} y1={188 + easedY * 18} x2="160" y2={barY} stroke="#94a3b8" strokeWidth="7" strokeLinecap="round" />

          {/* Right Arm */}
          <line x1="240" y1="188" x2={400 - elbowX} y2={188 + easedY * 18} stroke="#64748b" strokeWidth="8" strokeLinecap="round" />
          <line x1={400 - elbowX} y1={188 + easedY * 18} x2="240" y2={barY} stroke="#94a3b8" strokeWidth="7" strokeLinecap="round" />

          {/* Barbell Path Indicator (Vertical dotted line) */}
          <line x1="200" y1="110" x2="200" y2="195" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />

          {/* Barbell Bar */}
          <rect x="50" y={barY - 4} width="300" height="8" rx="3" fill="#e2e8f0" stroke="#475569" strokeWidth="1" />
          {/* Weight Plates */}
          <rect x="56" y={barY - 32} width="14" height="64" rx="4" fill="#047857" stroke="#10b981" strokeWidth="1.5" />
          <rect x="72" y={barY - 26} width="10" height="52" rx="3" fill="#059669" />
          <rect x="330" y={barY - 32} width="14" height="64" rx="4" fill="#047857" stroke="#10b981" strokeWidth="1.5" />
          <rect x="318" y={barY - 26} width="10" height="52" rx="3" fill="#059669" />

          {/* Hands gripping bar */}
          <circle cx="160" cy={barY} r="7" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
          <circle cx="240" cy={barY} r="7" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />

          {/* Angle / Biomechanics HUD callout */}
          <g transform={`translate(280, ${barY - 15})`}>
            <rect x="0" y="0" width="105" height="24" rx="6" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
            <text x="52" y="16" textAnchor="middle" fill="#a7f3d0" fontSize="10" fontWeight="bold">
              {animProgress < 0.5 ? '↓ 45° Elbow Tuck' : '↑ J-Curve Press'}
            </text>
          </g>
        </svg>
      );
    }

    // 2. SQUATS & LEGS (Barbell Squat, Goblet Squat, Leg Press)
    if (exId.includes('squat') || exId.includes('leg-press') || muscle === 'Legs') {
      const hipY = 135 + easedY * 55; // Hips drop down
      const kneeX = 185 + easedY * 18; // Knees track forward over midfoot
      const kneeY = 175 + easedY * 15;
      const barY = 70 + easedY * 55;
      const quadGlow = 0.3 + (1 - motionPercent) * 0.7;

      return (
        <svg viewBox="0 0 400 280" className="w-full h-full select-none">
          {/* Gym Floor */}
          <line x1="40" y1="240" x2="360" y2="240" stroke="#334155" strokeWidth="3" />
          {/* Midfoot balance line */}
          <line x1="200" y1="40" x2="200" y2="240" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />

          {/* Torso & Head */}
          <circle cx={200 - easedY * 10} cy={barY - 16} r="15" fill="#475569" />
          {/* Spine (slight forward lean as depth increases) */}
          <line x1={200 - easedY * 8} y1={barY} x2={190 - easedY * 15} y2={hipY} stroke="#64748b" strokeWidth="16" strokeLinecap="round" />

          {/* Quadriceps (Thigh) - Glowing Target Muscle */}
          <line 
            x1={190 - easedY * 15} 
            y1={hipY} 
            x2={kneeX} 
            y2={kneeY} 
            stroke="#10b981" 
            strokeWidth="18" 
            strokeLinecap="round"
            opacity={quadGlow}
          />
          {/* Hamstring / Shin to Foot */}
          <line x1={kneeX} y1={kneeY} x2="195" y2="236" stroke="#475569" strokeWidth="12" strokeLinecap="round" />
          {/* Foot on floor */}
          <rect x="175" y="234" width="45" height="8" rx="3" fill="#0f172a" />

          {/* Barbell across upper traps */}
          <rect x="70" y={barY - 4} width="260" height="8" rx="3" fill="#e2e8f0" stroke="#475569" />
          {/* Weight plates */}
          <rect x="75" y={barY - 34} width="16" height="68" rx="4" fill="#047857" stroke="#10b981" strokeWidth="1.5" />
          <rect x="93" y={barY - 28} width="12" height="56" rx="3" fill="#059669" />
          <rect x="309" y={barY - 34} width="16" height="68" rx="4" fill="#047857" stroke="#10b981" strokeWidth="1.5" />
          <rect x="295" y={barY - 28} width="12" height="56" rx="3" fill="#059669" />

          {/* Hands holding bar */}
          <circle cx="160" cy={barY} r="6" fill="#fbbf24" />
          <circle cx="240" cy={barY} r="6" fill="#fbbf24" />

          {/* Depth Indicator Pill */}
          <g transform={`translate(250, ${hipY - 12})`}>
            <rect x="0" y="0" width="130" height="26" rx="8" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
            <text x="65" y="17" textAnchor="middle" fill="#a7f3d0" fontSize="10" fontWeight="bold">
              {easedY > 0.8 ? '✓ Depth: Below Parallel' : 'Squat Depth Path'}
            </text>
          </g>
        </svg>
      );
    }

    // 3. SHOULDER PRESS & LATERAL RAISES
    if (exId.includes('shoulder') || exId.includes('lateral') || exId.includes('overhead') || muscle === 'Shoulders') {
      const dbY = exId.includes('lateral') 
        ? 210 - (1 - easedY) * 90 // Lateral raise: arms raise to side y=120
        : 155 - (1 - easedY) * 75; // Shoulder press: overhead
      const deltGlow = 0.3 + (1 - motionPercent) * 0.7;

      return (
        <svg viewBox="0 0 400 280" className="w-full h-full select-none">
          <line x1="60" y1="250" x2="340" y2="250" stroke="#334155" strokeWidth="2" />
          {/* Torso */}
          <ellipse cx="200" cy="180" rx="35" ry="50" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          {/* Head */}
          <circle cx="200" cy="105" r="18" fill="#475569" />

          {/* Left & Right Deltoids (Target Muscle) */}
          <circle cx="155" cy="142" r="14" fill="#10b981" fillOpacity={deltGlow} stroke="#34d399" strokeWidth="2" />
          <circle cx="245" cy="142" r="14" fill="#10b981" fillOpacity={deltGlow} stroke="#34d399" strokeWidth="2" />

          {/* Arms holding Dumbbells */}
          {exId.includes('lateral') ? (
            <>
              {/* Left Arm raised out */}
              <line x1="155" y1="142" x2="90" y2={dbY} stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
              {/* Right Arm raised out */}
              <line x1="245" y1="142" x2="310" y2={dbY} stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
              {/* Dumbbells */}
              <rect x="75" y={dbY - 14} width="30" height="28" rx="4" fill="#047857" stroke="#10b981" strokeWidth="1.5" />
              <rect x="295" y={dbY - 14} width="30" height="28" rx="4" fill="#047857" stroke="#10b981" strokeWidth="1.5" />
            </>
          ) : (
            <>
              {/* Overhead Press Arms */}
              <line x1="155" y1="142" x2="140" y2={dbY + 25} stroke="#64748b" strokeWidth="8" strokeLinecap="round" />
              <line x1="140" y1={dbY + 25} x2="145" y2={dbY} stroke="#94a3b8" strokeWidth="7" strokeLinecap="round" />
              <line x1="245" y1="142" x2="260" y2={dbY + 25} stroke="#64748b" strokeWidth="8" strokeLinecap="round" />
              <line x1="260" y1={dbY + 25} x2="255" y2={dbY} stroke="#94a3b8" strokeWidth="7" strokeLinecap="round" />
              {/* Dumbbells overhead */}
              <rect x="125" y={dbY - 10} width="40" height="20" rx="4" fill="#047857" stroke="#10b981" strokeWidth="1.5" />
              <rect x="235" y={dbY - 10} width="40" height="20" rx="4" fill="#047857" stroke="#10b981" strokeWidth="1.5" />
            </>
          )}

          {/* Muscle Callout Badge */}
          <g transform="translate(140, 225)">
            <rect x="0" y="0" width="120" height="24" rx="6" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
            <text x="60" y="16" textAnchor="middle" fill="#a7f3d0" fontSize="10" fontWeight="bold">
              LATERAL & FRONT DELTS
            </text>
          </g>
        </svg>
      );
    }

    // 4. BACK & PULL (Lat Pulldown, Rows)
    if (exId.includes('lat') || exId.includes('row') || muscle === 'Back') {
      const barY = 50 + (1 - easedY) * 75; // Lat pulldown bar moves down
      const latGlow = 0.3 + (1 - motionPercent) * 0.7;

      return (
        <svg viewBox="0 0 400 280" className="w-full h-full select-none">
          {/* Pulley Cable Top Machine */}
          <rect x="185" y="10" width="30" height="15" rx="3" fill="#334155" />
          <line x1="200" y1="25" x2="200" y2={barY} stroke="#64748b" strokeWidth="2.5" />

          {/* Seated Seat */}
          <rect x="160" y="220" width="80" height="12" rx="3" fill="#1e293b" />
          <rect x="194" y="232" width="12" height="35" fill="#334155" />

          {/* Torso Rear View */}
          <path 
            d="M 160 140 Q 200 130 240 140 L 225 210 Q 200 215 175 210 Z" 
            fill="#1e293b" 
            stroke="#334155" 
            strokeWidth="2" 
          />
          {/* Head */}
          <circle cx="200" cy="115" r="16" fill="#475569" />

          {/* Lats (V-Taper Target Muscles Glowing in Vert Theme) */}
          <path 
            d="M 160 142 Q 185 170 176 205 L 188 205 Q 192 165 175 142 Z" 
            fill="#10b981" 
            fillOpacity={latGlow}
            stroke="#34d399"
            strokeWidth="1.5"
          />
          <path 
            d="M 240 142 Q 215 170 224 205 L 212 205 Q 208 165 225 142 Z" 
            fill="#10b981" 
            fillOpacity={latGlow}
            stroke="#34d399"
            strokeWidth="1.5"
          />

          {/* Arms pulling Bar down */}
          <line x1="160" y1="140" x2="135" y2={barY + 12} stroke="#64748b" strokeWidth="8" strokeLinecap="round" />
          <line x1="240" y1="140" x2="265" y2={barY + 12} stroke="#64748b" strokeWidth="8" strokeLinecap="round" />

          {/* Lat Pulldown Bar */}
          <path 
            d={`M 90 ${barY + 14} Q 200 ${barY - 6} 310 ${barY + 14}`} 
            stroke="#e2e8f0" 
            strokeWidth="6" 
            fill="none" 
            strokeLinecap="round" 
          />
          {/* Hands gripping bar */}
          <circle cx="120" cy={barY + 8} r="6" fill="#fbbf24" />
          <circle cx="280" cy={barY + 8} r="6" fill="#fbbf24" />

          {/* Form Cue HUD */}
          <g transform="translate(130, 240)">
            <rect x="0" y="0" width="140" height="22" rx="6" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
            <text x="70" y="15" textAnchor="middle" fill="#a7f3d0" fontSize="10" fontWeight="bold">
              {animProgress > 0.5 ? '✓ Elbows Driven to Pockets' : 'Full Lat Stretch at Top'}
            </text>
          </g>
        </svg>
      );
    }

    // 5. ARMS (Bicep Curls & Tricep Pushdown)
    if (exId.includes('curl') || exId.includes('tricep') || muscle === 'Arms') {
      const isTriceps = exId.includes('tricep');
      const armAngle = isTriceps 
        ? 90 + (1 - easedY) * 75 // Triceps pushes down to 165°
        : 165 - (1 - easedY) * 85; // Bicep curls up to 80°
      const armGlow = 0.3 + (1 - motionPercent) * 0.7;

      return (
        <svg viewBox="0 0 400 280" className="w-full h-full select-none">
          <line x1="60" y1="250" x2="340" y2="250" stroke="#334155" strokeWidth="2" />
          {/* Standing Torso */}
          <ellipse cx="180" cy="155" rx="30" ry="50" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          <circle cx="180" cy="85" r="16" fill="#475569" />

          {/* Upper Arm (Stationary against ribcage!) */}
          <line x1="180" y1="125" x2="180" y2="175" stroke="#475569" strokeWidth="12" strokeLinecap="round" />

          {/* Bicep or Tricep Target Muscle Glowing */}
          <ellipse 
            cx={isTriceps ? 172 : 188} 
            cy="150" 
            rx="9" 
            ry="18" 
            fill="#10b981" 
            fillOpacity={armGlow}
            stroke="#34d399"
            strokeWidth="1.5"
          />

          {/* Forearm pivoting at elbow (x=180, y=175) */}
          {(() => {
            const rad = (armAngle * Math.PI) / 180;
            const handX = 180 + Math.sin(rad) * 45;
            const handY = 175 + Math.cos(rad) * 45;

            return (
              <>
                <line x1="180" y1="175" x2={handX} y2={handY} stroke="#94a3b8" strokeWidth="9" strokeLinecap="round" />
                {/* Weight / Handle */}
                <circle cx={handX} cy={handY} r="9" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
                <rect x={handX - 6} y={handY - 14} width="12" height="28" rx="3" fill="#047857" stroke="#10b981" strokeWidth="1" />
              </>
            );
          })()}

          {/* Elbow Pin Guide Circle */}
          <circle cx="180" cy="175" r="5" fill="#10b981" />
          <text x="180" y="195" textAnchor="middle" fill="#6ee7b7" fontSize="9" fontWeight="bold">
            ELBOW PINNED
          </text>
        </svg>
      );
    }

    // 6. DEFAULT / GENERAL KINETIC FLOW VISUALIZER
    return (
      <svg viewBox="0 0 400 280" className="w-full h-full select-none">
        <circle cx="200" cy="140" r={60 + easedY * 20} fill="#10b981" fillOpacity="0.15" stroke="#10b981" strokeWidth="2" strokeDasharray="6 4" />
        <circle cx="200" cy="140" r="35" fill="#064e3b" stroke="#34d399" strokeWidth="3" />
        <text x="200" y="145" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="black">
          {muscle.toUpperCase()}
        </text>
        <g transform="translate(130, 220)">
          <rect x="0" y="0" width="140" height="24" rx="6" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
          <text x="70" y="16" textAnchor="middle" fill="#a7f3d0" fontSize="10" fontWeight="bold">
            BIOMECHANICAL FLOW
          </text>
        </g>
      </svg>
    );
  };

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden border border-emerald-900/60 shadow-2xl flex flex-col">
      {/* Top Tab Bar: ⚡ Instant Animation vs 🎞️ Motion GIF vs 🎥 Full YouTube */}
      <div className="flex items-center justify-between bg-slate-950 p-2.5 border-b border-emerald-950 px-4">
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setActiveTab('animation')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'animation'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>⚡ Form Animation Loop</span>
          </button>

          <button
            onClick={() => setActiveTab('gif')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'gif'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>🎞️ Quick GIF Demo</span>
          </button>

          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'video'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-rose-400" />
            <span>🎥 YouTube Deep Dive</span>
          </button>
        </div>

        {/* Rep Counter Simulator */}
        {activeTab === 'animation' && (
          <div className="hidden sm:flex items-center space-x-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-xs text-slate-300">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Rep:</span>
            <span className="font-black text-emerald-400">{repCount}</span>
          </div>
        )}
      </div>

      {/* Main Visual Display Area */}
      <div className="relative aspect-video w-full bg-[#081310] flex items-center justify-center overflow-hidden">
        {/* TAB 1: 2D Biomechanical Form Animation (Instant, zero lag, continuous loop) */}
        {activeTab === 'animation' && (
          <div className="relative w-full h-full flex flex-col justify-between">
            {/* Real-Time Phase Indicator HUD Overlay */}
            <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-2">
              <div className={`px-2.5 py-1 rounded-lg border text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 backdrop-blur-md shadow-lg ${phaseColor}`}>
                <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                <span>{phaseName}</span>
              </div>
              <span className="text-[11px] text-emerald-200/80 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md hidden sm:inline">
                {phaseDesc}
              </span>
            </div>

            {/* Tempo Badge */}
            <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-emerald-900/60 text-right">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Hypertrophy Tempo</span>
              <span className="font-mono font-black text-xs text-emerald-300">{exercise.tempo || '3-0-1-0'}</span>
            </div>

            {/* The Animated SVG Lifter Biomechanics Visualizer */}
            <div className="w-full h-full flex items-center justify-center">
              {renderBiomechanicalVisualizer()}
            </div>

            {/* Bottom Floating Playback Controls Bar */}
            <div className="absolute bottom-3 left-3 right-3 z-20 bg-slate-950/80 backdrop-blur-md p-2 px-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
              {/* Play / Pause & Reset */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-8 h-8 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center transition font-bold"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
                <button
                  onClick={() => {
                    setAnimProgress(0);
                    setRepCount(1);
                  }}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
                  title="Restart Loop"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Progress Slider (Scrubber) */}
              <div className="flex-1 flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={animProgress}
                  onChange={(e) => {
                    setIsPlaying(false);
                    setAnimProgress(parseFloat(e.target.value));
                  }}
                  className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>

              {/* Speed Buttons: 0.5x, 1x, 1.5x */}
              <div className="flex items-center space-x-1 text-xs">
                {[0.5, 1.0, 1.5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`px-2 py-0.5 rounded-md font-bold transition text-[11px] ${
                      speed === s
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GIF Demonstration (Looping real exercise GIF) */}
        {activeTab === 'gif' && (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-black">
            {exercise.gifUrl ? (
              <img
                src={exercise.gifUrl}
                alt={`${exercise.name} animated form demonstration loop`}
                className="w-full h-full object-contain"
                loading="eager"
              />
            ) : (
              <div className="text-center p-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                  <Film className="w-6 h-6" />
                </div>
                <h4 className="text-white font-bold text-sm">Visual Form Loop Active</h4>
                <p className="text-xs text-slate-400 max-w-sm">
                  Switch to the <strong className="text-emerald-400">⚡ Form Animation</strong> tab for full interactive angle tracking, speed controls, and muscle activation glow.
                </p>
                <button
                  onClick={() => setActiveTab('animation')}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
                >
                  Open 2D Animation Loop
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Full YouTube Deep Dive */}
        {activeTab === 'video' && (
          <iframe
            src={`${exercise.videoUrl}?autoplay=1&rel=0&modestbranding=1`}
            title={exercise.videoTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        )}
      </div>

      {/* Muscle Focus Bar */}
      <div className="bg-slate-950 p-3 px-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Target Muscle:</span>
          <span className="font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-0.5 rounded-full">
            {exercise.muscleGroup}
          </span>
          <span className="text-slate-400 text-xs hidden sm:inline">
            Equipment: <strong className="text-white">{exercise.equipment}</strong>
          </span>
        </div>

        <div className="flex items-center space-x-3 text-slate-400">
          <span>Target: <strong className="text-white">{exercise.defaultSets} sets × {exercise.defaultReps} reps</strong></span>
          <span>Rest: <strong className="text-white">{exercise.restSeconds}s</strong></span>
        </div>
      </div>
    </div>
  );
};
