"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, User, Shield } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/admin/use-current-user";
import { cn } from "@/lib/utils";
import { useNotificationsStore } from "@/stores/notifications/notifications-provider";
import { RoleAssignmentStatus } from "@/types/entities/role-assignment.type";
import { TimeDisplay } from "./time-display";

export function DashboardHeader() {
  const { data: user } = useAuth();
  const router = useRouter();
  const [showName, setShowName] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  const hasAdminRole = user?.roleAssignments?.some((assignment) => {
    return assignment.role?.key === "admin" && assignment.status === RoleAssignmentStatus.ACTIVE;
  });

  const hasUnreadPushNotifications = useNotificationsStore((s) => {
    return s.hasUnreadPushNotifications;
  });

  // Switch from name to time after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowName(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // time is handled by the TimeDisplay child to avoid re-rendering the whole header every second

  return (
    <div
      className={cn(
        "sticky top-0 z-10 -mx-4 -mt-4 px-4 pt-4 transition-all duration-200 md:-mx-6 md:-mt-6 md:px-6 md:pt-6",
        isScrolled && "border-b bg-background/80 shadow-sm backdrop-blur-md"
      )}
    >
      <div className="flex items-center justify-between gap-4 pb-3 md:pb-4">
        {/* Welcome / Time (isolated) */}
        <TimeDisplay showName={showName} userName={user?.identity.name} />

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Admin Dashboard Button - Mobile Hidden */}
          {hasAdminRole && (
            <Button size="icon" variant="outline" onClick={() => router.push("/admin")} className=" gap-2 md:flex">
              <Shield className="size-5" />
            </Button>
          )}

          {/* Notification Button */}
          <Button
            variant="outline"
            size="icon"
            className={cn("relative", hasUnreadPushNotifications && "border-2 border-primary")}
            onClick={() => router.push("/messages")}
          >
            <Bell className="size-5" />
            <span className="sr-only">اعلان‌ها</span>
          </Button>

          {/* Profile Button */}
          <Button variant="outline" size="icon" className={cn("relative")} onClick={() => router.push("/profile")}>
            <User className="size-5" />
            <span className="sr-only">پروفایل</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
