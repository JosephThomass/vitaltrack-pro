import { 
  LoggedWorkout, 
  MealSlot, 
  MedicineOrSupplement, 
  OtherActivity, 
  UserProfile, 
  WaterLog 
} from '../types';

export interface UserAccountData {
  phoneNumber: string;
  registeredAt: string;
  lastLoginAt: string;
  profile: UserProfile;
  mealSlots: MealSlot[];
  loggedWorkouts: LoggedWorkout[];
  meds: MedicineOrSupplement[];
  waterLogs: WaterLog[];
  activities: OtherActivity[];
}

const DB_KEY = 'vitaltrack_user_database_v2';
const CURRENT_PHONE_KEY = 'vitaltrack_current_phone_v2';

export const userDatabase = {
  // Normalize phone number for consistent keying
  normalizePhone(phone: string): string {
    if (!phone) return '';
    return phone.replace(/[^0-9]/g, '');
  },

  getAll(): Record<string, UserAccountData> {
    try {
      const data = localStorage.getItem(DB_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  listUsers(): UserAccountData[] {
    const db = this.getAll();
    return Object.values(db).sort((a, b) => 
      new Date(b.lastLoginAt || b.registeredAt).getTime() - new Date(a.lastLoginAt || a.registeredAt).getTime()
    );
  },

  hasUser(phone: string): boolean {
    const key = this.normalizePhone(phone);
    if (!key) return false;
    const db = this.getAll();
    return Boolean(db[key]);
  },

  getUser(phone: string): UserAccountData | null {
    const key = this.normalizePhone(phone);
    if (!key) return null;
    const db = this.getAll();
    return db[key] || null;
  },

  saveUser(userData: UserAccountData): void {
    const key = this.normalizePhone(userData.phoneNumber);
    if (!key) return;
    const db = this.getAll();
    db[key] = {
      ...userData,
      lastLoginAt: new Date().toISOString(),
    };
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    localStorage.setItem(CURRENT_PHONE_KEY, key);
  },

  updateUserData(phone: string, updates: Partial<UserAccountData>): void {
    const key = this.normalizePhone(phone);
    if (!key) return;
    const db = this.getAll();
    if (db[key]) {
      db[key] = {
        ...db[key],
        ...updates,
        lastLoginAt: new Date().toISOString(),
      };
      localStorage.setItem(DB_KEY, JSON.stringify(db));
    }
  },

  getCurrentPhone(): string | null {
    return localStorage.getItem(CURRENT_PHONE_KEY);
  },

  setCurrentPhone(phone: string): void {
    const key = this.normalizePhone(phone);
    localStorage.setItem(CURRENT_PHONE_KEY, key);
  },

  clearCurrentSession(): void {
    localStorage.removeItem(CURRENT_PHONE_KEY);
  }
};
