"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Home, Wallet, HandCoins, UserCircle, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

import { NavItem } from "@/components/nav-item";

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
  },
  {
    title: "پروفایل",
    url: "/profile",
    icon: UserCircle
  }
];

export function UserNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [hasHistory, setHasHistory] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const checkHistory = () => {
      setHasHistory(window.history.length > 1);
    };

    checkHistory();
    window.addEventListener("popstate", checkHistory);
    return () => window.removeEventListener("popstate", checkHistory);
  }, []);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
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
  }, [lastScrollY]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 md:inset-x-auto md:bottom-7 md:left-1/2 md:-translate-x-1/2">
      <div className="mx-4 pb-7 md:mx-0 md:pb-0">
        <motion.nav
          animate={{
            y: isVisible ? 0 : 100,
            opacity: isVisible ? 1 : 0
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex h-16 md:h-20 w-full items-center justify-between gap-1 rounded-[1.75rem] bg-navbar-bg px-3 shadow-md shadow-black/15 backdrop-blur-sm dark:bg-navbar-bg dark:shadow-white/10 md:min-w-96"
          style={{ color: "var(--color-navbar-text)" }}
        >
          {/* Floating active indicator */}
          <div className="absolute inset-0 rounded-[1.75rem] pointer-events-none" />

          {userNavItems.map((item, index) => {
            const isActive = pathname === item.url;
            const Icon = item.icon;

            return (
              <NavItem
                key={item.url}
                href={item.url}
                icon={Icon}
                title={item.title}
                isActive={isActive}
                index={index}
                onClick={() => {}}
              />
            );
          })}

          {/* Back Button */}
          {hasHistory && (
            <>
              <div className="h-10 w-px shrink-0 bg-border" />
              <button
                onClick={() => router.back()}
                className="group relative flex flex-1 min-w-0 items-center justify-center transition-opacity duration-200 opacity-70 hover:opacity-100"
              >
                <div className="relative flex w-full max-w-14 aspect-square items-center justify-center">
                  <ArrowLeft className="size-5.5" />
                </div>
              </button>
            </>
          )}
        </motion.nav>
      </div>
    </div>
  );
}
