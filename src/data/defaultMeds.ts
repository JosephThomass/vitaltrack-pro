import { MedicineOrSupplement } from '../types';

export const DEFAULT_MEDICATIONS_AND_SUPPLEMENTS: MedicineOrSupplement[] = [
  {
    id: 'med-minoxidil-am',
    name: 'Minoxidil 5% (Morning Scalp Application)',
    category: 'hair_loss',
    dosage: '1 ml (approx 6 sprays / 1 dropper)',
    scheduledTime: '08:30',
    purpose: 'Vasodilation & DHT follicle defense (hair regrowth)',
    instructions: 'Part hair, apply directly onto dry scalp at crown & hairline. Gently massage for 1 min with clean fingertips. Do not wash hair for at least 4 hours.',
    reminderEnabled: true,
    takenToday: false,
    streakDays: 14,
    frequency: 'twice_daily'
  },
  {
    id: 'med-finasteride',
    name: 'Finasteride 1mg / Hair Nutra-Tablet',
    category: 'hair_loss',
    dosage: '1 tablet (1mg)',
    scheduledTime: '09:30',
    purpose: '5-alpha reductase inhibitor (blocks DHT to protect follicles from miniaturization)',
    instructions: 'Take 1 tablet with a glass of water after breakfast. Consistent daily timing is key for hormonal stability.',
    reminderEnabled: true,
    takenToday: false,
    streakDays: 14,
    frequency: 'daily'
  },
  {
    id: 'med-vit-d3',
    name: 'Vitamin D3 (5000 IU) + K2',
    category: 'supplement',
    dosage: '1 softgel',
    scheduledTime: '09:00',
    purpose: 'Hormonal support, immune function & hair follicle stem cell cycling',
    instructions: 'Take with breakfast containing dietary fats (like eggs or avocado) for optimal absorption.',
    reminderEnabled: true,
    takenToday: false,
    streakDays: 10,
    frequency: 'daily'
  },
  {
    id: 'med-creatine',
    name: 'Creatine Monohydrate (Creapure)',
    category: 'supplement',
    dosage: '5 grams (1 level scoop)',
    scheduledTime: '11:30',
    purpose: 'ATP cellular energy, explosive gym strength, muscle volumization & neuroprotection',
    instructions: 'Dissolve in 300ml of room temperature water or fruit juice. Drink plenty of water throughout the day.',
    reminderEnabled: true,
    takenToday: false,
    streakDays: 21,
    frequency: 'daily'
  },
  {
    id: 'med-omega3',
    name: 'Triple Strength Omega-3 Fish Oil',
    category: 'supplement',
    dosage: '1000mg EPA/DHA',
    scheduledTime: '13:45',
    purpose: 'Joint lubrication, scalp microcirculation & lowering systemic inflammation',
    instructions: 'Take immediately after lunch meal with a large sip of water.',
    reminderEnabled: true,
    takenToday: false,
    streakDays: 9,
    frequency: 'daily'
  },
  {
    id: 'med-whey',
    name: 'Whey Protein Isolate Shake',
    category: 'supplement',
    dosage: '1 scoop (30g protein)',
    scheduledTime: '19:30',
    purpose: 'Rapid post-workout muscle protein synthesis & tissue repair',
    instructions: 'Mix with 250ml chilled water or almond milk. Consume within 45-60 minutes post workout.',
    reminderEnabled: true,
    takenToday: false,
    streakDays: 8,
    frequency: 'daily'
  },
  {
    id: 'med-minoxidil-pm',
    name: 'Minoxidil 5% (Night Scalp Application)',
    category: 'hair_loss',
    dosage: '1 ml',
    scheduledTime: '21:30',
    purpose: 'Overnight follicle absorption & regrowth stimulation',
    instructions: 'Apply 1-2 hours before sleeping so scalp dries fully and does not rub off on pillow.',
    reminderEnabled: true,
    takenToday: false,
    streakDays: 14,
    frequency: 'twice_daily'
  },
  {
    id: 'med-zma',
    name: 'Magnesium Glycinate & Zinc (ZMA)',
    category: 'supplement',
    dosage: '200mg Magnesium + 15mg Zinc',
    scheduledTime: '22:15',
    purpose: 'Deep REM sleep, muscle recovery & natural testosterone synthesis',
    instructions: 'Take 30-45 minutes before bedtime on an empty or light stomach.',
    reminderEnabled: true,
    takenToday: false,
    streakDays: 12,
    frequency: 'daily'
  }
];
