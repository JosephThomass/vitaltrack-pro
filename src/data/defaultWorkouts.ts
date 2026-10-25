import { WorkoutRoutine } from '../types';

export const DEFAULT_WORKOUT_ROUTINES: WorkoutRoutine[] = [
  {
    id: 'push-day',
    title: 'Push Power (Chest, Delts & Triceps)',
    category: 'Push',
    description: 'Hypertrophy and strength routine targeting the pectorals, anterior/lateral deltoids, and triceps brachii.',
    durationMinutes: 55,
    level: 'Intermediate',
    exercises: [
      {
        id: 'bench-press',
        name: 'Barbell Flat Bench Press',
        muscleGroup: 'Chest',
        equipment: 'Barbell & Flat Bench',
        defaultSets: 4,
        defaultReps: '8-10',
        restSeconds: 90,
        tempo: '3-0-1-0',
        primaryMuscles: ['Pectoralis Major', 'Anterior Deltoid'],
        secondaryMuscles: ['Triceps Brachii', 'Core'],
        animationType: 'bench_press',
        gifUrl: 'https://images.squarespace-cdn.com/content/v1/5dd8a97ec75b706c9a9df9c4/1601666874409-G5R5W0B130U5H34A7S74/Barbell-bench-press.gif',
        videoUrl: 'https://www.youtube.com/embed/rT7DgCr-3pg',
        videoTitle: 'How To Bench Press For Maximum Chest Growth (Form Guide)',
        formCues: [
          'Retract your scapula and maintain a slight natural arch in the lower back.',
          'Grip the bar slightly wider than shoulder-width with wrists straight.',
          'Lower the bar under control to the mid-chest/sternum level.',
          'Drive through your heels and press the bar upwards in a slight J-curve.'
        ],
        commonMistakes: [
          'Flaring elbows out at 90 degrees (keep elbows at 45-60 degrees to protect shoulders).',
          'Bouncing the bar violently off the sternum.',
          'Lifting buttocks off the bench.'
        ]
      },
      {
        id: 'incline-db-press',
        name: 'Incline Dumbbell Bench Press',
        muscleGroup: 'Chest',
        equipment: 'Dumbbells & Incline Bench (30°)',
        defaultSets: 3,
        defaultReps: '10-12',
        restSeconds: 75,
        tempo: '3-1-1-0',
        primaryMuscles: ['Clavicular Head (Upper Pecs)', 'Anterior Delts'],
        secondaryMuscles: ['Triceps Brachii'],
        animationType: 'incline_press',
        gifUrl: 'https://images.squarespace-cdn.com/content/v1/5dd8a97ec75b706c9a9df9c4/1601667086854-C1C1E6Q2H1A5U4P2S4K5/Incline-dumbbell-bench-press.gif',
        videoUrl: 'https://www.youtube.com/embed/8iPEnn-ltC8',
        videoTitle: 'Incline Dumbbell Press Technique & Clavicular Head Activation',
        formCues: [
          'Set bench angle to 30 degrees (higher angles shift excessive load to front delts).',
          'Tuck elbows slightly and press dumbbells together in a smooth pyramid arch.',
          'Pause for a deep stretch at bottom without over-rotating the shoulders.'
        ],
        commonMistakes: [
          'Setting bench too steep (45° or higher).',
          'Clanging dumbbells together at top which loses muscle tension.'
        ]
      },
      {
        id: 'db-overhead-press',
        name: 'Seated Dumbbell Shoulder Press',
        muscleGroup: 'Shoulders',
        equipment: 'Dumbbells & 80° Bench',
        defaultSets: 3,
        defaultReps: '10-12',
        restSeconds: 75,
        tempo: '3-0-1-0',
        primaryMuscles: ['Anterior & Lateral Deltoids'],
        secondaryMuscles: ['Triceps Brachii', 'Upper Trapezius'],
        animationType: 'overhead_press',
        gifUrl: 'https://images.squarespace-cdn.com/content/v1/5dd8a97ec75b706c9a9df9c4/1601667232311-J5X5U5Y2F3G1Q3Q4U3Y4/Dumbbell-shoulder-press.gif',
        videoUrl: 'https://www.youtube.com/embed/qEwKCR5JCog',
        videoTitle: 'Proper Dumbbell Shoulder Press Form (Safe For Rotator Cuffs)',
        formCues: [
          'Keep core braced and ribs pulled down to avoid hyperextending lumbar spine.',
          'Maintain dumbbells slightly in front of the body in the scapular plane.',
          'Press upwards until arms are extended overhead without locking elbows harshly.'
        ],
        commonMistakes: [
          'Excessive lower back arching due to using overly heavy weights.',
          'Lowering dumbbells halfway (ensure full range of motion down to ear level).'
        ]
      },
      {
        id: 'lateral-raises',
        name: 'Dumbbell Lateral Raises',
        muscleGroup: 'Shoulders',
        equipment: 'Light Dumbbells',
        defaultSets: 4,
        defaultReps: '12-15',
        restSeconds: 60,
        tempo: '2-1-1-1',
        primaryMuscles: ['Lateral Deltoids (Side Delts)'],
        secondaryMuscles: ['Supraspinatus', 'Trapezius'],
        animationType: 'lateral_raise',
        gifUrl: 'https://images.squarespace-cdn.com/content/v1/5dd8a97ec75b706c9a9df9c4/1601667362208-Y6R1F5Q6W3A5V2D3S4C5/Dumbbell-lateral-raise.gif',
        videoUrl: 'https://www.youtube.com/embed/3VcKaXpzqRo',
        videoTitle: 'How To Do Lateral Raises For Broad 3D Delts',
        formCues: [
          'Lean forward 10-15 degrees and lead with your elbows, not your wrists.',
          'Think of pouring water out of a pitcher at peak contraction.',
          'Control the 3-second descent (eccentric) for maximum lateral delt stimulus.'
        ],
        commonMistakes: [
          'Shrugging traps to heave the weight up.',
          'Using momentum and swinging the torso back and forth.'
        ]
      },
      {
        id: 'triceps-rope-pushdown',
        name: 'Cable Triceps Rope Pushdown',
        muscleGroup: 'Arms',
        equipment: 'Cable Machine & Rope Attachment',
        defaultSets: 3,
        defaultReps: '12-15',
        restSeconds: 60,
        tempo: '2-0-1-1',
        primaryMuscles: ['Triceps Brachii (Lateral & Medial Head)'],
        secondaryMuscles: ['Anconeus'],
        animationType: 'tricep_pushdown',
        gifUrl: 'https://images.squarespace-cdn.com/content/v1/5dd8a97ec75b706c9a9df9c4/1601667520412-M5D1G6H3S4A5V2Q2W3X4/Tricep-rope-pushdown.gif',
        videoUrl: 'https://www.youtube.com/embed/2-LAMcpzODU',
        videoTitle: 'Tricep Rope Pushdown Form Guide (Tricep Lateral & Long Head)',
        formCues: [
          'Pin upper arms to the sides of your ribcage and keep elbows stationary.',
          'Extend arms downward and spread the rope apart at the very bottom.',
          'Squeeze triceps hard for a 1-second hold at full lockout.'
        ],
        commonMistakes: [
          'Letting elbows drift forward and backwards like a pendulum.',
          'Leaning too far over the cable and turning it into a press.'
        ]
      }
    ]
  },
  {
    id: 'pull-day',
    title: 'Pull Power (Back, Lats, Rear Delts & Biceps)',
    category: 'Pull',
    description: 'Targeting latissimus dorsi, rhomboids, trapezius, posterior delts, and biceps brachii for a solid V-taper.',
    durationMinutes: 60,
    level: 'Intermediate',
    exercises: [
      {
        id: 'lat-pulldown',
        name: 'Wide-Grip Lat Pulldown',
        muscleGroup: 'Back',
        equipment: 'Cable Pulldown Machine',
        defaultSets: 4,
        defaultReps: '10-12',
        restSeconds: 75,
        tempo: '3-0-1-1',
        primaryMuscles: ['Latissimus Dorsi', 'Teres Major'],
        secondaryMuscles: ['Biceps Brachii', 'Rhomboids'],
        animationType: 'lat_pulldown',
        gifUrl: 'https://images.squarespace-cdn.com/content/v1/5dd8a97ec75b706c9a9df9c4/1601667682914-K1C1A5G2F3D4E5W6Y7U8/Lat-pulldown.gif',
        videoUrl: 'https://www.youtube.com/embed/CAwf7n6Luuc',
        videoTitle: 'How To Lat Pulldown For A Wider Back',
        formCues: [
          'Grip bar 1.5x shoulder width with thumbless or standard overhand grip.',
          'Lean back slightly (10-15°) and initiate pull by depressing the shoulder blades.',
          'Pull bar down smoothly to upper chest while driving elbows towards your back pockets.'
        ],
        commonMistakes: [
          'Swinging the torso wildly backward to yank the weight.',
          'Pulling the bar behind the neck (dangerous for cervical spine).'
        ]
      },
      {
        id: 'bent-over-row',
        name: 'Barbell Bent-Over Row',
        muscleGroup: 'Back',
        equipment: 'Barbell & Weight Plates',
        defaultSets: 4,
        defaultReps: '8-10',
        restSeconds: 90,
        tempo: '3-1-1-0',
        primaryMuscles: ['Latissimus Dorsi', 'Rhomboids', 'Middle Trapezius'],
        secondaryMuscles: ['Posterior Delts', 'Biceps', 'Erector Spinae'],
        animationType: 'row',
        gifUrl: 'https://images.squarespace-cdn.com/content/v1/5dd8a97ec75b706c9a9df9c4/1601667954123-A1B2C3D4E5F6G7H8I9J0/Barbell-bent-over-row.gif',
        videoUrl: 'https://www.youtube.com/embed/FWJR5Ve8gkQ',
        videoTitle: 'Barbell Row Guide: Build Back Thickness & Posture',
        formCues: [
          'Hinge hips backward with knees slightly bent; keep back straight at 45 degrees.',
          'Pull barbell toward lower ribcage / navel.',
          'Contract upper back and pause briefly before extending under control.'
        ],
        commonMistakes: [
          'Rounding the lower back (cat back).',
          'Standing too upright and turning it into a shrug.'
        ]
      },
      {
        id: 'seated-cable-row',
        name: 'Seated Cable Row (Close Grip V-Bar)',
        muscleGroup: 'Back',
        equipment: 'Cable Row Machine & V-Handle',
        defaultSets: 3,
        defaultReps: '10-12',
        restSeconds: 75,
        tempo: '2-0-1-1',
        primaryMuscles: ['Rhomboids', 'Lats', 'Middle Trapezius'],
        secondaryMuscles: ['Biceps Brachii', 'Posterior Deltoids'],
        animationType: 'cable_row',
        gifUrl: 'https://images.squarespace-cdn.com/content/v1/5dd8a97ec75b706c9a9df9c4/1601668102314-Q1W2E3R4T5Y6U7I8O9P0/Seated-cable-row.gif',
        videoUrl: 'https://www.youtube.com/embed/GZbfZ033f74',
        videoTitle: 'Seated Cable Row Form Guide',
        formCues: [
          'Sit tall with chest high and a slight bend in knees.',
          'Pull V-handle to lower abdomen while driving elbows backward.',
          'Allow a gentle stretch forward on the return without losing spinal neutrality.'
        ],
        commonMistakes: [
          'Extreme rocking motion back and forth.',
          'Shrugging shoulders into ears at contraction.'
        ]
      },
      {
        id: 'face-pulls',
        name: 'Cable Face Pulls with Rope',
        muscleGroup: 'Shoulders',
        equipment: 'Cable Machine & Rope',
        defaultSets: 3,
        defaultReps: '15-20',
        restSeconds: 60,
        tempo: '2-1-1-1',
        primaryMuscles: ['Rear Deltoids', 'Rotator Cuff (Infraspinatus)'],
        secondaryMuscles: ['Rhomboids', 'Lower Trapezius'],
        animationType: 'face_pull',
        gifUrl: 'https://images.squarespace-cdn.com/content/v1/5dd8a97ec75b706c9a9df9c4/1601668254129-Z1X2C3V4B5N6M7A8S9D0/Cable-face-pull.gif',
        videoUrl: 'https://www.youtube.com/embed/rep-qVOkqgk',
        videoTitle: 'Face Pulls: The Best Exercise For Posture & Shoulder Health',
        formCues: [
          'Set cable pulley at eye level or slightly higher.',
          'Hold rope with thumbs pointing backward (neutral/overhand grip).',
          'Pull rope toward bridge of nose while externally rotating hands backward like a double bicep pose.'
        ],
        commonMistakes: [
          'Pulling too low down to the neck.',
          'Using too much weight and jerking torso.'
        ]
      },
      {
        id: 'incline-db-curls',
        name: 'Incline Dumbbell Biceps Curls',
        muscleGroup: 'Arms',
        equipment: 'Dumbbells & 45° Incline Bench',
        defaultSets: 3,
        defaultReps: '10-12',
        restSeconds: 60,
        tempo: '3-0-1-1',
        primaryMuscles: ['Biceps Brachii (Long Head)'],
        secondaryMuscles: ['Brachialis', 'Brachioradialis'],
        animationType: 'bicep_curl',
        gifUrl: 'https://images.squarespace-cdn.com/content/v1/5dd8a97ec75b706c9a9df9c4/1601668390112-L1K2J3H4G5F6D7S8A9Q0/Incline-dumbbell-curl.gif',
        videoUrl: 'https://www.youtube.com/embed/soxrZlIl35U',
        videoTitle: 'Incline Dumbbell Curl (Long Head Bicep Peak Stretch)',
        formCues: [
          'Lie back on the 45-degree bench with arms hanging straight down.',
          'Supinate wrists (turn palms up) as you curl the weight up.',
          'Keep elbows pinned pointing to the floor without swinging forward.'
        ],
        commonMistakes: [
          'Letting elbows drift forward to recruit front delts.',
          'Rushing the lowering phase and dropping weights abruptly.'
        ]
      }
    ]
  },
  {
    id: 'legs-abs-day',
    title: 'Legs & Core Foundations (Quads, Hamstrings & Abs)',
    category: 'Legs',
    description: 'Complete lower body and core development for athletic power, testosterone stimulation, and balanced physique.',
    durationMinutes: 60,
    level: 'Intermediate',
    exercises: [
      {
        id: 'barbell-squat',
        name: 'Barbell Back Squat',
        muscleGroup: 'Legs',
        equipment: 'Squat Rack & Barbell',
        defaultSets: 4,
        defaultReps: '8-10',
        restSeconds: 120,
        tempo: '3-1-1-0',
        primaryMuscles: ['Quadriceps', 'Gluteus Maximus'],
        secondaryMuscles: ['Hamstrings', 'Adductors', 'Core'],
        animationType: 'squat',
        gifUrl: 'https://images.squarespace-cdn.com/content/v1/5dd8a97ec75b706c9a9df9c4/1601667821319-P5G6H3J2K1L4M5N6O7P8/Barbell-squat.gif',
        videoUrl: 'https://www.youtube.com/embed/bEv6CCg2BC8',
        videoTitle: 'How To Squat Properly (Depth, Bar Path, Knee Health)',
        formCues: [
          'Rest bar across upper traps (high bar) or across rear delts (low bar).',
          'Take a deep belly breath and brace core (valsalva maneuver).',
          'Break at hips and knees simultaneously; squat until hip crease passes below knee level.',
          'Drive up evenly through midfoot while keeping knees tracking over toes.'
        ],
        commonMistakes: [
          'Knees caving inward (valgus collapse).',
          'Heels coming off the ground.',
          'Rounding the lower spine at bottom (butt wink).'
        ]
      },
      {
        id: 'romanian-deadlift',
        name: 'Dumbbell / Barbell Romanian Deadlift (RDL)',
        muscleGroup: 'Legs',
        equipment: 'Barbell or Heavy Dumbbells',
        defaultSets: 3,
        defaultReps: '10-12',
        restSeconds: 90,
        tempo: '3-1-1-0',
        primaryMuscles: ['Hamstrings (Biceps Femoris)', 'Gluteus Maximus'],
        secondaryMuscles: ['Erector Spinae', 'Forearm Grip'],
        animationType: 'deadlift',
        gifUrl: 'https://images.squarespace-cdn.com/content/v1/5dd8a97ec75b706c9a9df9c4/1601667954123-A1B2C3D4E5F6G7H8I9J0/Romanian-deadlift.gif',
        videoUrl: 'https://www.youtube.com/embed/jey_CzKn3mw',
        videoTitle: 'How To Romanian Deadlift (RDL) For Glutes & Hamstrings',
        formCues: [
          'Maintain a soft knee bend and push hips directly backwards toward the wall.',
          'Keep weight close to shins and spine neutral throughout.',
          'Descend until feeling a deep hamstring stretch, then contract glutes to return to standing.'
        ],
        commonMistakes: [
          'Bending knees too much and turning it into a squat.',
          'Rounding the upper and lower back.'
        ]
      },
      {
        id: 'leg-press',
        name: '45-Degree Leg Press',
        muscleGroup: 'Legs',
        equipment: 'Leg Press Machine',
        defaultSets: 3,
        defaultReps: '12-15',
        restSeconds: 75,
        tempo: '3-0-1-0',
        primaryMuscles: ['Quadriceps (Rectus Femoris & Vastus)'],
        secondaryMuscles: ['Glutes', 'Calves'],
        animationType: 'squat',
        gifUrl: 'https://images.squarespace-cdn.com/content/v1/5dd8a97ec75b706c9a9df9c4/1601668512319-X1Z2C3V4B5N6M7K8J9H0/Leg-press.gif',
        videoUrl: 'https://www.youtube.com/embed/IZxyjW7MPJQ',
        videoTitle: 'Leg Press Form Mistakes & Quad Optimization',
        formCues: [
          'Place feet shoulder-width in center of platform.',
          'Lower sled smoothly until knees form roughly a 90-degree angle without sacrum lifting.',
          'Press through midfoot and stop just shy of bone-on-bone knee lockout.'
        ],
        commonMistakes: [
          'Allowing tailbone to curl off pad (strains lower back).',
          'Aggressively locking knees at the top.'
        ]
      },
      {
        id: 'hanging-knee-raise',
        name: 'Hanging Knee / Leg Raises',
        muscleGroup: 'Core',
        equipment: 'Pull-up Bar / Captains Chair',
        defaultSets: 3,
        defaultReps: '12-15',
        restSeconds: 60,
        tempo: '2-0-1-1',
        primaryMuscles: ['Rectus Abdominis (Lower Abs)'],
        secondaryMuscles: ['Hip Flexors', 'Obliques'],
        animationType: 'leg_raise',
        gifUrl: 'https://images.squarespace-cdn.com/content/v1/5dd8a97ec75b706c9a9df9c4/1601668645129-Q1A2Z3W4S5X6E7D8C9R0/Hanging-knee-raise.gif',
        videoUrl: 'https://www.youtube.com/embed/hdng3Nm1x_E',
        videoTitle: 'Hanging Leg & Knee Raises For Six Pack Abs',
        formCues: [
          'Hang with active shoulders and posterior pelvic tilt.',
          'Roll pelvis upward as you raise knees toward your chest (dont just swing thighs).',
          'Control the descent to eliminate swinging momentum.'
        ],
        commonMistakes: [
          'Swinging the body and using hip flexors rather than rectus abdominis.',
          'Arching lower back on the way down.'
        ]
      }
    ]
  },
  {
    id: 'full-body-circuit',
    title: 'Full Body Express & Athletic Conditioning',
    category: 'Full Body',
    description: 'High efficiency total body session for fat burn, conditioning, and metabolic elevation.',
    durationMinutes: 45,
    level: 'Beginner',
    exercises: [
      {
        id: 'goblet-squat',
        name: 'Dumbbell Goblet Squat',
        muscleGroup: 'Legs',
        equipment: 'Single Heavy Dumbbell or Kettlebell',
        defaultSets: 3,
        defaultReps: '12-15',
        restSeconds: 60,
        tempo: '3-1-1-0',
        primaryMuscles: ['Quadriceps', 'Gluteus Maximus'],
        secondaryMuscles: ['Core', 'Upper Back'],
        animationType: 'squat',
        gifUrl: 'https://images.squarespace-cdn.com/content/v1/5dd8a97ec75b706c9a9df9c4/1601667821319-P5G6H3J2K1L4M5N6O7P8/Barbell-squat.gif',
        videoUrl: 'https://www.youtube.com/embed/MeIiIdhvXT4',
        videoTitle: 'Goblet Squat Masterclass Form & Mobility',
        formCues: [
          'Hold dumbbell vertically against your sternum with both palms cupping the top head.',
          'Squat down between knees while keeping chest tall.',
          'Elbows should track inside your knees at the lowest depth.'
        ],
        commonMistakes: [
          'Holding dumbbell away from chest, fatiguing arms prematurely.',
          'Collapsing torso forward.'
        ]
      },
      {
        id: 'pushups',
        name: 'Standard Strict Push-Ups',
        muscleGroup: 'Chest',
        equipment: 'Bodyweight / Floor Mat',
        defaultSets: 3,
        defaultReps: '15-20',
        restSeconds: 60,
        tempo: '2-0-1-0',
        primaryMuscles: ['Pectoralis Major', 'Core / Abs'],
        secondaryMuscles: ['Triceps Brachii', 'Anterior Deltoids'],
        animationType: 'pushup',
        gifUrl: 'https://images.squarespace-cdn.com/content/v1/5dd8a97ec75b706c9a9df9c4/1601668254129-Z1X2C3V4B5N6M7A8S9D0/Push-up.gif',
        videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4',
        videoTitle: 'The Perfect Push-Up (Step by Step Guide)',
        formCues: [
          'Hands slightly wider than shoulders, fingers pointed forward or slightly outward.',
          'Squeeze glutes and brace core to maintain straight plank line from head to heels.',
          'Lower chest until 2 inches off ground with elbows at 45 degrees.'
        ],
        commonMistakes: [
          'Sagging hips or piking buttocks into the air.',
          'Flaring elbows out sideways.'
        ]
      },
      {
        id: 'plank-hold',
        name: 'Forearm Core Plank Hold',
        muscleGroup: 'Core',
        equipment: 'Mat',
        defaultSets: 3,
        defaultReps: '45-60 sec',
        restSeconds: 45,
        tempo: 'Continuous Iso Tension',
        primaryMuscles: ['Transverse Abdominis', 'Rectus Abdominis'],
        secondaryMuscles: ['Glutes', 'Serratus Anterior'],
        animationType: 'plank',
        gifUrl: 'https://images.squarespace-cdn.com/content/v1/5dd8a97ec75b706c9a9df9c4/1601668645129-Q1A2Z3W4S5X6E7D8C9R0/Plank.gif',
        videoUrl: 'https://www.youtube.com/embed/ASdvN_XEl_c',
        videoTitle: 'How To Plank Correctly For Rock-Hard Abs',
        formCues: [
          'Elbows directly beneath shoulders, forearms parallel.',
          'Engage quadriceps, squeeze glutes, and pull belly button inward.',
          'Maintain neutral neck by looking directly at hands.'
        ],
        commonMistakes: [
          'Letting hips drop or lower back sag.',
          'Holding breath instead of deep diaphragmatic breathing.'
        ]
      }
    ]
  },
  {
    id: 'home-bodyweight-db',
    title: 'Home Full Body Dumbbell & Calisthenics',
    category: 'Full Body',
    location: 'home',
    description: 'High-intensity full-body routine designed for living room or home gym with dumbbells and floor space.',
    durationMinutes: 40,
    level: 'Beginner',
    exercises: [
      {
        id: 'home-pushups',
        name: 'Floor Push-Ups (Chest & Triceps)',
        muscleGroup: 'Chest',
        equipment: 'Bodyweight / Floor Mat',
        defaultSets: 4,
        defaultReps: '12-15',
        restSeconds: 60,
        tempo: '2-0-1-0',
        primaryMuscles: ['Pectoralis Major', 'Triceps'],
        secondaryMuscles: ['Core', 'Anterior Delts'],
        animationType: 'pushup',
        gifUrl: 'https://images.squarespace-cdn.com/content/v1/5dd8a97ec75b706c9a9df9c4/1601668254129-Z1X2C3V4B5N6M7A8S9D0/Push-up.gif',
        videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4',
        videoTitle: 'How To Push Up Properly At Home',
        formCues: [
          'Brace core and glutes into a tight plank line.',
          'Keep elbows angled back at 45 degrees to protect shoulders.',
          'Full lockout at top, lower until chest is 1 inch off floor.'
        ],
        commonMistakes: [
          'Hips sagging down or piking up in the air.',
          'Half reps without touching depth.'
        ]
      },
      {
        id: 'home-db-goblet-squat',
        name: 'Dumbbell Goblet Squat (Quads & Glutes)',
        muscleGroup: 'Legs',
        equipment: 'Single Dumbbell / Kettlebell',
        defaultSets: 4,
        defaultReps: '12-15',
        restSeconds: 60,
        tempo: '3-1-1-0',
        primaryMuscles: ['Quadriceps', 'Gluteus Maximus'],
        secondaryMuscles: ['Calves', 'Core'],
        animationType: 'squat',
        gifUrl: 'https://images.squarespace-cdn.com/content/v1/5dd8a97ec75b706c9a9df9c4/1601667821319-P5G6H3J2K1L4M5N6O7P8/Barbell-squat.gif',
        videoUrl: 'https://www.youtube.com/embed/MeIiIdhvXT4',
        videoTitle: 'Goblet Squat Form: Perfect At-Home Leg Workout',
        formCues: [
          'Hold weight tight against chest with elbows pointing down.',
          'Sit down between hips with knees tracking over toes.',
          'Drive through whole foot to stand tall.'
        ],
        commonMistakes: [
          'Rounding upper back under the load.',
          'Knees collapsing inward.'
        ]
      },
      {
        id: 'home-db-row',
        name: 'Two-Arm Dumbbell Bent-Over Row',
        muscleGroup: 'Back',
        equipment: 'Pair of Dumbbells',
        defaultSets: 4,
        defaultReps: '10-12',
        restSeconds: 60,
        tempo: '3-0-1-1',
        primaryMuscles: ['Latissimus Dorsi', 'Rhomboids'],
        secondaryMuscles: ['Biceps', 'Posterior Deltoids'],
        animationType: 'row',
        gifUrl: 'https://images.squarespace-cdn.com/content/v1/5dd8a97ec75b706c9a9df9c4/1601667954123-A1B2C3D4E5F6G7H8I9J0/Barbell-bent-over-row.gif',
        videoUrl: 'https://www.youtube.com/embed/roCP6wCXPqo',
        videoTitle: 'Dumbbell Row: Build A V-Taper Back At Home',
        formCues: [
          'Hinge hips back at 45 degrees with straight neutral spine.',
          'Pull dumbbells towards your hip pockets driving through elbows.',
          'Squeeze lats and shoulder blades tightly for 1 second at top.'
        ],
        commonMistakes: [
          'Using torso momentum to jerk weights upwards.',
          'Rounding thoracic or lumbar spine.'
        ]
      },
      {
        id: 'home-db-overhead-press',
        name: 'Standing Dumbbell Overhead Press',
        muscleGroup: 'Shoulders',
        equipment: 'Pair of Dumbbells',
        defaultSets: 3,
        defaultReps: '10-12',
        restSeconds: 60,
        tempo: '3-0-1-0',
        primaryMuscles: ['Deltoids (Front & Side)'],
        secondaryMuscles: ['Triceps', 'Core'],
        animationType: 'overhead_press',
        gifUrl: 'https://images.squarespace-cdn.com/content/v1/5dd8a97ec75b706c9a9df9c4/1601667232311-J5X5U5Y2F3G1Q3Q4U3Y4/Dumbbell-shoulder-press.gif',
        videoUrl: 'https://www.youtube.com/embed/2yjwXTZQDDI',
        videoTitle: 'Standing Dumbbell Shoulder Press At Home',
        formCues: [
          'Stand with feet shoulder-width, tighten core and squeeze glutes.',
          'Press dumbbells straight up in line with ears.',
          'Control the eccentric lowering phase for 2 seconds.'
        ],
        commonMistakes: [
          'Overarching lower back to push heavier weight.',
          'Dropping elbows too fast without control.'
        ]
      },
      {
        id: 'home-bicycle-crunch',
        name: 'Bicycle Crunches & Core Burner',
        muscleGroup: 'Core',
        equipment: 'Floor Mat',
        defaultSets: 3,
        defaultReps: '20 reps (10/side)',
        restSeconds: 45,
        tempo: '1-1-1-1 (Rhythmic)',
        primaryMuscles: ['Obliques', 'Rectus Abdominis'],
        secondaryMuscles: ['Hip Flexors'],
        animationType: 'leg_raise',
        gifUrl: 'https://images.squarespace-cdn.com/content/v1/5dd8a97ec75b706c9a9df9c4/1601668645129-Q1A2Z3W4S5X6E7D8C9R0/Hanging-knee-raise.gif',
        videoUrl: 'https://www.youtube.com/embed/9FGilxCbdz8',
        videoTitle: 'Bicycle Crunches: Burn Belly Fat & Sculpt Abs',
        formCues: [
          'Interlace fingers lightly behind head; do not pull on your neck.',
          'Rotate opposite elbow towards opposite knee with deliberate control.',
          'Exhale sharply on each rotational contraction.'
        ],
        commonMistakes: [
          'Jerking neck with hands.',
          'Rushing reps using momentum instead of core tension.'
        ]
      }
    ]
  }
];
