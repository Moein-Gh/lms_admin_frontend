"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

function formatDateFa(date: Date) {
  const parts = new Intl.DateTimeFormat("fa-IR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  }).formatToParts(date);

  const day = parts.find((p) => p.type === "day")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  const year = parts.find((p) => p.type === "year")?.value ?? "";
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";

  return `${weekday}، ${day} ${month} ${year}`;
}

function formatTimeFa(date: Date) {
  return date.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function TimeDisplay({ showName, userName }: { showName: boolean; userName?: string | null }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-11 md:h-12">
        <AnimatePresence mode="wait">
          {showName ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="space-y-0.5"
            >
              <p className="text-xs text-muted-foreground md:text-sm">خوش آمدید</p>
              <h1 className="text-base font-bold md:text-lg lg:text-xl">{userName}</h1>
            </motion.div>
          ) : (
            <motion.div
              key="datetime"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="space-y-0.5"
              dir="rtl"
            >
              <p className="text-xs text-muted-foreground md:text-sm">{formatDateFa(currentTime)}</p>
              <h1 className="text-base font-bold tabular-nums md:text-lg lg:text-xl">{formatTimeFa(currentTime)}</h1>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
