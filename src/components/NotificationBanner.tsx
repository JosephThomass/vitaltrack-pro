import React from 'react';
import { Bell, X, Check, Utensils, Pill, Droplet, Dumbbell } from 'lucide-react';
import { AppNotification } from '../utils/notifications';

interface NotificationBannerProps {
  notifications: AppNotification[];
  onDismiss: (id: string) => void;
  onAction?: (notification: AppNotification) => void;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  notifications,
  onDismiss,
  onAction,
}) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm w-full space-y-2 pointer-events-none">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className="pointer-events-auto bg-slate-900 border-2 border-emerald-500/80 rounded-2xl p-4 shadow-2xl flex items-start space-x-3 animate-slide-in backdrop-blur-md"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
            {notif.category === 'meal' && <Utensils className="w-5 h-5 text-amber-400" />}
            {notif.category === 'medication' && <Pill className="w-5 h-5 text-purple-400" />}
            {notif.category === 'water' && <Droplet className="w-5 h-5 text-cyan-400" />}
            {notif.category === 'workout' && <Dumbbell className="w-5 h-5 text-emerald-400" />}
            {notif.category === 'general' && <Bell className="w-5 h-5 text-emerald-400" />}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">{notif.title}</h4>
              <span className="text-[10px] text-slate-500">{notif.timestamp}</span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-snug">{notif.body}</p>

            {onAction && (
              <button
                onClick={() => {
                  onAction(notif);
                  onDismiss(notif.id);
                }}
                className="mt-2 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark Completed</span>
              </button>
            )}
          </div>

          <button
            onClick={() => onDismiss(notif.id)}
            className="text-slate-500 hover:text-slate-300 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
