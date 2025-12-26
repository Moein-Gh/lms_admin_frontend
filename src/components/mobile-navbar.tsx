"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MoreHorizontal, User, Moon, Sun, Settings, ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { MobileNavbarLogout } from "@/components/mobile-navbar-logout";
import { useMe } from "@/hooks/use-user";
import { updateThemeMode } from "@/lib/theme-utils";
import { cn } from "@/lib/utils";
import { navbarItems, additionalNavbarItems } from "@/navigation/navbar/navbar-items";
import { setValueToCookie } from "@/server/server-actions";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";
import { NavItem } from "./nav-item";

export function MobileNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user } = useMe();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasHistory, setHasHistory] = useState(false);
  const themeMode = usePreferencesStore((s) => s.themeMode);
  const setThemeMode = usePreferencesStore((s) => s.setThemeMode);

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
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isExpanded]);

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
              {/* Top Row: Profile, Settings, Theme */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="flex items-center gap-2"
              >
                {/* Profile */}
                <Link
                  href="/dashboard/profile"
                  onClick={() => setIsExpanded(false)}
                  className="group flex flex-[2] items-center gap-2.5 rounded-xl border border-border/50 bg-card/50 p-2.5 transition-all hover:border-primary/50 hover:bg-card active:scale-98"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                    <User className="size-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-xs font-semibold">{user?.identity?.name ?? "کاربر"}</h3>
                    <p className="truncate text-[10px] text-muted-foreground">مشاهده پروفایل</p>
                  </div>
                </Link>

                {/* Settings Button */}
                <Link href="/dashboard/settings" onClick={() => setIsExpanded(false)}>
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.3 }}
                    className="flex size-[52px] shrink-0 items-center justify-center rounded-xl border border-border/50 bg-card/50 transition-colors hover:border-primary/50 hover:bg-card"
                  >
                    <Settings className="size-4.5 text-foreground" />
                  </motion.div>
                </Link>

                {/* Theme Switcher */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleThemeToggle}
                  className="flex size-[52px] shrink-0 items-center justify-center rounded-xl border border-border/50 bg-card/50 transition-colors hover:border-primary/50 hover:bg-card"
                >
                  <div className="flex items-center justify-center">
                    {themeMode === "dark" ? (
                      <Sun className="size-4.5 text-primary" />
                    ) : (
                      <Moon className="size-4.5 text-primary" />
                    )}
                  </div>
                </motion.button>

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
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
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
            <NavItem
              key={item.url}
              href={item.url}
              icon={Icon}
              isActive={isActive}
              index={index}
              hoveredIndex={hoveredIndex}
              onClick={() => setIsExpanded(false)}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
            />
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
                <MoreHorizontal className={cn("size-5.5 transition-colors duration-300 text-current")} />
              </motion.div>
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
