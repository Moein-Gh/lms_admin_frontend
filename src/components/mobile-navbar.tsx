"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MoreVertical, User, Moon, Sun, Settings, ArrowLeft, Bell, Home as HomeIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { MobileNavbarLogout } from "@/components/mobile-navbar-logout";
import { useMe } from "@/hooks/admin/use-user";
import { formatPersianDate } from "@/lib/date-service";
import { updateThemeMode } from "@/lib/theme-utils";
import { cn } from "@/lib/utils";
import { navbarItems, additionalNavbarItems } from "@/navigation/navbar/navbar-items";
import { setValueToCookie } from "@/server/server-actions";
import { useNotificationsStore } from "@/stores/notifications/notifications-provider";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";
import { RoleAssignmentStatus } from "@/types/entities/role-assignment.type";

export function MobileNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user } = useMe();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasHistory, setHasHistory] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const themeMode = usePreferencesStore((s) => s.themeMode);
  const setThemeMode = usePreferencesStore((s) => s.setThemeMode);
  const hasUnreadPushNotifications = useNotificationsStore((s) => s.hasUnreadPushNotifications);

  useEffect(() => {
    const checkHistory = () => {
      setHasHistory(window.history.length > 1);
    };

    checkHistory();
    window.addEventListener("popstate", checkHistory);
    return () => window.removeEventListener("popstate", checkHistory);
  }, []);

  useEffect(() => {
    if (isExpanded) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [isExpanded]);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      // Don't hide navbar when expanded panel is open
      if (isExpanded) return;

      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);

      // Show navbar after 2 seconds of no scrolling
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [lastScrollY, isExpanded]);

  const handleThemeToggle = async () => {
    const newTheme = themeMode === "dark" ? "light" : "dark";
    updateThemeMode(newTheme);
    setThemeMode(newTheme);
    await setValueToCookie("theme_mode", newTheme);
  };

  return (
    <div className="z-50 flex w-full flex-col items-start flex-1 min-w-0">
      {/* Expanded options panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mb-2 w-full overflow-hidden rounded-3xl border border-border/40 bg-navbar-bg shadow-nice shadow-black/20 backdrop-blur-sm dark:border-border/20 dark:shadow-black/50"
          >
            <div className="flex flex-col gap-3 p-4">
              {/* User Info Banner */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.02 }}
                className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4 shadow-sm"
              >
                <div className="relative flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-bold leading-tight">{user?.identity?.name ?? "کاربر"}</h3>
                  </div>
                  <div className="shrink-0 text-left">
                    <p className="text-sm font-semibold">{formatPersianDate(new Date(), "HH:mm")}</p>
                    <p className="text-xs font-medium text-muted-foreground">
                      {formatPersianDate(new Date(), "dd MMMM")}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons Row */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="flex items-center gap-2"
              >
                {/* Profile */}
                <Link href="/admin/profile" onClick={() => setIsExpanded(false)} className="flex-1">
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    className="flex aspect-square w-full items-center justify-center rounded-xl border border-border/50 bg-card/50 transition-colors hover:border-primary/50 hover:bg-card"
                  >
                    <User className="size-5 text-foreground" />
                  </motion.div>
                </Link>

                {/* If user is an account-holder, show quick link to user dashboard/profile */}
                {user?.roleAssignments?.some(
                  (a) => a.role?.key === "account-holder" && a.status === RoleAssignmentStatus.ACTIVE
                ) && (
                  <Link href="/" onClick={() => setIsExpanded(false)} className="flex-1">
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.05 }}
                      className="flex aspect-square w-full items-center justify-center rounded-xl border border-border/50 bg-card/50 transition-colors hover:border-primary/50 hover:bg-card"
                    >
                      <HomeIcon className="size-5 text-foreground" />
                    </motion.div>
                  </Link>
                )}

                {/* Messages */}
                <Link href="/admin/messages" onClick={() => setIsExpanded(false)} className="flex-1">
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    className="relative flex aspect-square w-full items-center justify-center rounded-xl border border-border/50 bg-card/50 transition-colors hover:border-primary/50 hover:bg-card"
                  >
                    <Bell className="size-5 text-foreground" />
                    {hasUnreadPushNotifications && (
                      <span className="absolute left-1 top-1 flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                      </span>
                    )}
                  </motion.div>
                </Link>

                {/* Settings */}
                <Link href="/admin/settings" onClick={() => setIsExpanded(false)} className="flex-1">
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.3 }}
                    className="flex aspect-square w-full items-center justify-center rounded-xl border border-border/50 bg-card/50 transition-colors hover:border-primary/50 hover:bg-card"
                  >
                    <Settings className="size-5 text-foreground" />
                  </motion.div>
                </Link>

                {/* Theme Switcher */}
                <button onClick={handleThemeToggle} className="flex-1">
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className="flex aspect-square w-full items-center justify-center rounded-xl border border-border/50 bg-card/50 transition-colors hover:border-primary/50 hover:bg-card"
                  >
                    {themeMode === "dark" ? (
                      <Sun className="size-5 text-primary" />
                    ) : (
                      <Moon className="size-5 text-primary" />
                    )}
                  </motion.div>
                </button>

                {/* Logout */}
                <MobileNavbarLogout onLogoutStart={() => setIsExpanded(false)} />
              </motion.div>

              {/* Additional Menu Items - Compact Grid */}
              {additionalNavbarItems.length > 0 && (
                <div className="flex flex-col gap-2">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="px-1 text-[10px] font-medium uppercase tracking-wider text-navbar-text"
                  >
                    دسترسی سریع
                  </motion.div>
                  <div className="grid grid-cols-4 gap-2">
                    {additionalNavbarItems.map((item, index) => (
                      <motion.div
                        key={item.url}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 + index * 0.04 }}
                      >
                        <Link
                          href={item.url}
                          onClick={() => setIsExpanded(false)}
                          className="group relative flex flex-col items-center gap-1.5 rounded-xl border border-border/40 bg-card/30 p-3 transition-all hover:border-primary/50 hover:bg-card/60 active:scale-95"
                        >
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20"
                          >
                            <item.icon className="size-4.5" />
                          </motion.div>
                          <span className="line-clamp-2 text-center text-[10px] font-medium leading-tight">
                            {item.title}
                          </span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main navbar */}
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{
          y: isVisible ? 0 : 100,
          opacity: isVisible ? 1 : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex h-16 w-full items-center justify-between gap-1 rounded-[1.75rem]  bg-navbar-bg px-3 shadow-md shadow-black/15 backdrop-blur-sm dark:bg-navbar-bg dark:shadow-white/10"
        style={{ color: "var(--color-navbar-text)" }}
      >
        {/* Floating active indicator */}
        <div className="absolute inset-0 rounded-[1.75rem] pointer-events-none" />

        {navbarItems.map((item, index) => {
          const isActive =
            !isExpanded &&
            (pathname === item.url || (item.url !== "/dashboard" && pathname.startsWith(`${item.url}/`)));
          const Icon = item.icon;

          return (
            <Link
              key={item.url}
              href={item.url}
              onClick={() => setIsExpanded(false)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative flex flex-1 min-w-0 items-center justify-center"
            >
              <motion.div
                animate={{
                  scale: hoveredIndex === index || isActive ? 1 : hoveredIndex === null ? 1 : 0.85
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="relative flex w-full max-w-14 aspect-square items-center justify-center"
              >
                {/* Active indicator dot */}
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-indicator"
                    className="absolute -bottom-1 size-1.5 rounded-full"
                    style={{ backgroundColor: "currentColor", boxShadow: "0 0 8px currentColor" }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}

                <motion.div className="relative flex w-full h-full items-center justify-center">
                  <Icon className={cn("size-5.5 transition-colors duration-300 text-current")} />
                </motion.div>
              </motion.div>
            </Link>
          );
        })}

        {/* More button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          onMouseEnter={() => setHoveredIndex(navbarItems.length)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="group relative flex flex-1 min-w-0 items-center justify-center"
        >
          <motion.div
            animate={{
              scale: hoveredIndex === navbarItems.length || isExpanded ? 1 : hoveredIndex === null ? 1 : 0.85
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="relative flex w-full max-w-14 aspect-square items-center justify-center"
          >
            {/* Dot indicator (no square) */}
            {isExpanded && (
              <motion.div
                layoutId="navbar-active-indicator"
                className="absolute -bottom-1 size-1.5 rounded-full"
                style={{ backgroundColor: "currentColor", boxShadow: "0 0 8px currentColor" }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}

            <motion.div className="relative flex w-full h-full items-center justify-center">
              <motion.div
                animate={{
                  rotate: isExpanded ? 90 : 0
                }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <MoreVertical className={cn("size-5.5 transition-colors duration-300 text-current")} />
              </motion.div>

              {/* Unread notification indicator on three dots */}
              {hasUnreadPushNotifications && !isExpanded && (
                <span className="absolute left-1 top-1 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
              )}
            </motion.div>

            {/* removed square/ripple overlays for minimal UI */}
          </motion.div>
        </button>

        {/* Back Button */}
        {hasHistory && (
          <>
            <div className="h-10 w-px shrink-0 bg-border" />
            <button
              onClick={() => router.back()}
              onMouseEnter={() => setHoveredIndex(navbarItems.length + 1)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative flex flex-1 min-w-0 items-center justify-center"
            >
              <motion.div
                animate={{
                  scale: hoveredIndex === navbarItems.length + 1 ? 1 : hoveredIndex === null ? 1 : 0.85
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="relative flex w-full max-w-14 aspect-square items-center justify-center"
              >
                {/* Hover effect */}
                <motion.div
                  animate={{
                    scale: hoveredIndex === navbarItems.length + 1 ? 1 : 0,
                    opacity: hoveredIndex === navbarItems.length + 1 ? 1 : 0
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 rounded-2xl bg-muted/50"
                />

                <motion.div className="relative flex w-full h-full items-center justify-center">
                  <ArrowLeft className="size-5.5 transition-colors duration-300 text-current" />
                </motion.div>

                {/* Ripple effect on tap */}
                <motion.div
                  className="pointer-events-none absolute inset-0 rounded-2xl"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileTap={{ scale: 1.5, opacity: [0, 0.3, 0] }}
                  transition={{ duration: 0.4 }}
                />
              </motion.div>
            </button>
          </>
        )}
      </motion.nav>

      {/* Backdrop overlay */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
            className="fixed inset-0 -z-10 bg-black/20 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
