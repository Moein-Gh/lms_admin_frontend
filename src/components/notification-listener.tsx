"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useNotificationsStore } from "@/stores/notifications/notifications-provider";

export function NotificationListener() {
  const router = useRouter();
  const setHasUnreadPushNotifications = useNotificationsStore((s) => s.setHasUnreadPushNotifications);

  useEffect(() => {
    const handleNotificationUpdate = (event: CustomEvent<{ hasUnreadPushNotifications: boolean }>) => {
      const { hasUnreadPushNotifications } = event.detail;

      setHasUnreadPushNotifications(hasUnreadPushNotifications);

      // Show toast if there are unread notifications
      if (hasUnreadPushNotifications) {
        toast.info("پیام جدید دارید!", {
          description: "پیام‌های خوانده نشده در انتظار شماست",
          action: {
            label: "مشاهده",
            onClick: () => router.push("/admin/messages")
          },
          duration: 6000
        });
      }
    };

    window.addEventListener("auth-notification-update", handleNotificationUpdate as EventListener);

    return () => {
      window.removeEventListener("auth-notification-update", handleNotificationUpdate as EventListener);
    };
  }, [setHasUnreadPushNotifications, router]);

  return null;
}
