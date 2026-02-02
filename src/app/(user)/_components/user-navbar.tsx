"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoreVertical, User, Moon, Sun, Bell, Home, Wallet, HandCoins } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { MobileNavbarLogout } from "@/components/mobile-navbar-logout";
import { NavItem } from "@/components/nav-item";
import { useMe } from "@/hooks/use-user";
import { formatPersianDate } from "@/lib/date-service";
import { updateThemeMode } from "@/lib/theme-utils";
import { setValueToCookie } from "@/server/server-actions";
import { useNotificationsStore } from "@/stores/notifications/notifications-provider";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

const userNavItems = [
  {
    title: "داشبورد",
    url: "/",
    icon: Home
  },
  {
    title: "حساب‌ها",
    url: "/accounts",
    icon: Wallet
  },
  {
    title: "وام‌ها",
    url: "/loans",
    icon: HandCoins
  }
];

export function UserNavbar() {
  const pathname = usePathname();
  const { data: user } = useMe();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const themeMode = usePreferencesStore((s) => s.themeMode);
  const setThemeMode = usePreferencesStore((s) => s.setThemeMode);
  const hasUnreadPushNotifications = useNotificationsStore((s) => s.hasUnreadPushNotifications);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const moreButtonRef = useRef<HTMLButtonElement | null>(null);

  const rawAssignments = user?.roleAssignments ?? user?.roleAssignments ?? [];
  const roles = rawAssignments.map((ra) => ra.role?.name).filter(Boolean);
  const roleText = roles.length ? roles.join("، ") : "کاربر";

  useEffect(() => {
    if (isExpanded) {
      const scrollY = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.dataset.scrollY = scrollY.toString();
    } else {
      const scrollY = document.body.dataset.scrollY;
      document.body.style.overflow = "";
      delete document.body.dataset.scrollY;
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY));
      }
    }
    return () => {
      document.body.style.overflow = "";
      delete document.body.dataset.scrollY;
    };
  }, [isExpanded]);

  // Close expanded panel when clicking/tapping outside of it (ignore clicks on the More button)
  useEffect(() => {
    if (!isExpanded) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (panelRef.current && panelRef.current.contains(target)) return;
      if (moreButtonRef.current && moreButtonRef.current.contains(target)) return;
      setIsExpanded(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
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
    <div className="fixed inset-x-0 bottom-0 z-50 md:inset-x-auto md:bottom-7 md:left-1/2 md:-translate-x-1/2">
      <div className="mx-4 pb-7 md:mx-0 md:pb-0">
        <div className="z-50 flex w-full flex-col items-start flex-1 min-w-0">
          {/* Expanded options panel */}
          <AnimatePresence mode="wait">
            {isExpanded && (
              <motion.div
                ref={panelRef}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="mb-2 w-full overflow-hidden rounded-3xl border border-border/40 bg-navbar-bg shadow-nice shadow-black/20 backdrop-blur-sm dark:border-border/20 dark:shadow-black/50"
              >
                <div className="flex flex-col gap-3 p-4">
                  {/* User Info Banner */}
                  <div className="rounded-2xl border border-primary/20 bg-linear-to-br from-primary/10 via-primary/5 to-transparent p-4 shadow-sm">
                    <div className="relative flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base font-bold leading-tight text-background">
                          {user?.identity.name ?? "کاربر"}
                        </h3>
                        <p className="text-xs text-muted-backgroundn">{roleText}</p>
                      </div>
                      <div className="shrink-0 text-left">
                        <p className="text-sm font-semibold text-background">
                          {formatPersianDate(new Date(), "HH:mm")}
                        </p>
                        <p className="text-xs font-medium text-muted-background">
                          {formatPersianDate(new Date(), "dd MMMM")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="flex items-center gap-2">
                    {/* Profile */}
                    <Link href="/profile" onClick={() => setIsExpanded(false)} className="flex-1">
                      <div className="flex aspect-square w-full items-center justify-center rounded-xl border border-border/50 bg-card/50 transition-colors hover:border-primary/50 hover:bg-card">
                        <User className="size-5 text-foreground" />
                      </div>
                    </Link>

                    {/* Messages */}
                    <Link href="/messages" onClick={() => setIsExpanded(false)} className="flex-1">
                      <div className="relative flex aspect-square w-full items-center justify-center rounded-xl border border-border/50 bg-card/50 transition-colors hover:border-primary/50 hover:bg-card">
                        <Bell className="size-5 text-foreground" />
                        {hasUnreadPushNotifications && (
                          <span className="absolute left-1 top-1 flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                          </span>
                        )}
                      </div>
                    </Link>

                    {/* Theme Switcher */}
                    <button onClick={handleThemeToggle} className="flex-1">
                      <div className="flex aspect-square w-full items-center justify-center rounded-xl border border-border/50 bg-card/50 transition-colors hover:border-primary/50 hover:bg-card">
                        {themeMode === "dark" ? (
                          <Sun className="size-5 text-primary" />
                        ) : (
                          <Moon className="size-5 text-primary" />
                        )}
                      </div>
                    </button>

                    {/* Logout */}
                    <MobileNavbarLogout onLogoutStart={() => setIsExpanded(false)} />
                  </div>
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
            className="flex h-16 md:h-20 w-full items-center justify-between gap-1 rounded-[1.75rem] bg-navbar-bg px-3 shadow-md shadow-black/15 backdrop-blur-sm dark:bg-navbar-bg dark:shadow-white/10 md:min-w-96"
            style={{ color: "var(--color-navbar-text)" }}
          >
            {/* Floating active indicator */}
            <div className="absolute inset-0 rounded-[1.75rem] pointer-events-none" />

            {userNavItems.map((item, index) => {
              const isActive =
                !isExpanded && (pathname === item.url || (item.url !== "/" && pathname.startsWith(`${item.url}/`)));
              const Icon = item.icon;

              return (
                <NavItem
                  key={item.url}
                  href={item.url}
                  icon={Icon}
                  title={item.title}
                  isActive={isActive}
                  index={index}
                  onClick={() => setIsExpanded(false)}
                />
              );
            })}

            {/* More button */}
            <button
              ref={moreButtonRef}
              onClick={() => setIsExpanded(!isExpanded)}
              onMouseEnter={() => setHoveredIndex(userNavItems.length)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative flex flex-1 min-w-0 items-center justify-center transition-opacity duration-200 hover:opacity-100"
              style={{ opacity: isExpanded ? 1 : 0.7 }}
            >
              <div className="relative flex w-full max-w-14 md:max-w-none aspect-square md:aspect-auto items-center justify-center">
                <div className="relative flex w-full h-full flex-col items-center justify-center gap-1">
                  <div
                    style={{
                      transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease-out"
                    }}
                  >
                    <MoreVertical className="size-6" />
                  </div>

                  {/* Label */}
                  <span className="text-xs font-medium whitespace-nowrap">بیشتر</span>

                  {/* Active indicator pill */}
                  {isExpanded && (
                    <motion.div
                      layoutId="navbar-active-indicator"
                      className="absolute -bottom-1.5 md:-bottom-2 h-0.5 w-8 rounded-full"
                      style={{ backgroundColor: "currentColor" }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    />
                  )}

                  {/* Unread notification indicator on three dots */}
                  {hasUnreadPushNotifications && !isExpanded && (
                    <span className="absolute left-1 top-1 flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                    </span>
                  )}
                </div>
              </div>
            </button>
          </motion.nav>

          {/* Backdrop overlay */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsExpanded(false)}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden"
                style={{ zIndex: -1 }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
