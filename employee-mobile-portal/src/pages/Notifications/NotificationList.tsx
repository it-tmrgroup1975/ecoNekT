import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Bell, BellOff, CheckCircle2, Clock } from "lucide-react";
import { cn } from "../../lib/utils";
import type { Notification } from "../../types/notification";

export default function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/users/notifications/");
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await api.post(`/users/notifications/${id}/read/`);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
    } catch (err) {
      console.error("Error marking as read", err);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-24 bg-slate-200 rounded-2xl w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">การแจ้งเตือน</h2>
        <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
          {notifications.filter(n => !n.is_read).length} ใหม่
        </span>
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-4">
          <div className="p-6 bg-slate-100 rounded-full">
            <BellOff className="w-10 h-10 opacity-20" />
          </div>
          <p className="text-sm font-medium">ยังไม่มีการแจ้งเตือนในขณะนี้</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.is_read && markAsRead(n.id)}
              className={cn(
                "relative overflow-hidden p-4 rounded-2xl border transition-all active:scale-[0.98]",
                n.is_read 
                  ? "bg-white border-border/50 opacity-70" 
                  : "bg-white border-primary/20 shadow-md shadow-primary/5"
              )}
            >
              {/* Indicator สำหรับข้อความใหม่ */}
              {!n.is_read && (
                <div className="absolute top-0 left-0 h-full w-1.5 bg-primary" />
              )}

              <div className="flex gap-4">
                <div className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                  n.is_read ? "bg-slate-100 text-slate-400" : "bg-primary/10 text-primary"
                )}>
                  {n.is_read ? <CheckCircle2 className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <h3 className={cn("text-sm font-bold", !n.is_read ? "text-foreground" : "text-muted-foreground")}>
                      {n.title}
                    </h3>
                    <div className="flex items-center text-[10px] text-muted-foreground gap-1 uppercase font-medium">
                      <Clock className="w-3 h-3" />
                      {/* แนะนำให้ใช้ date-fns หรือเทียบเท่าในการจัดการเวลา */}
                      {new Date(n.created_at).toLocaleDateString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {n.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}