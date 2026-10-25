import { soundManager } from './audio';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  category: 'meal' | 'medication' | 'water' | 'workout' | 'general';
  timestamp: string;
  actionUrl?: string;
  read: boolean;
}

class NotificationService {
  private hasPermission = false;

  constructor() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.hasPermission = Notification.permission === 'granted';
    }
  }

  async requestPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.hasPermission = permission === 'granted';
      return this.hasPermission;
    } catch {
      return false;
    }
  }

  getPermissionStatus(): NotificationPermission | 'unsupported' {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission;
  }

  trigger(
    title: string,
    body: string,
    category: 'meal' | 'medication' | 'water' | 'workout' | 'general' = 'general',
    playSound = true
  ): AppNotification {
    const notification: AppNotification = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title,
      body,
      category,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };

    if (playSound) {
      if (category === 'water') {
        soundManager.playWaterDrop();
      } else if (category === 'medication') {
        soundManager.playPillPop();
      } else {
        soundManager.playChime('alert');
      }
    }

    // Attempt system native notification if granted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
        });
      } catch {
        // Fallback gracefully
      }
    }

    return notification;
  }
}

export const notificationService = new NotificationService();
