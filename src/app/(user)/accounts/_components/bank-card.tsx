"use client";

import { useState } from "react";
import { Landmark, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, PanInfo } from "motion/react";
import { FormattedDate } from "@/components/formatted-date";
import { FormattedNumber } from "@/components/formatted-number";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Account, AccountStatus, AccountStatusLabels } from "@/types/entities/account.type";

interface BankCardProps {
  accounts: Account[];
  selectedAccount: Account;
  onAccountChange: (accountId: string) => void;
}

const bankStyles: Record<string, string> = {
  "بانک ملی": "from-emerald-600 to-teal-700",
  "بانک ملت": "from-red-600 to-rose-700",
  "بانک صادرات": "from-blue-600 to-indigo-700",
  "بانک تجارت": "from-amber-600 to-orange-700",
  default: "from-slate-700 to-slate-800"
};

// Masking & grouping will be rendered per-account using `FormattedNumber`

export function BankCard({ accounts, selectedAccount, onAccountChange }: BankCardProps) {
  const [direction, setDirection] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const currentIndex = accounts.findIndex((acc) => acc.id === selectedAccount.id);

  const gradient = bankStyles[selectedAccount.bankName] ?? bankStyles.default;
  const balance = selectedAccount.balanceSummary?.totalDeposits ?? 0;
  const hasActiveLoan = selectedAccount.status === AccountStatus.BUSY;
  const statusInfo = AccountStatusLabels[selectedAccount.status];

  // Prepare masked card groups (last 8 digits in two groups of 4)
  const rawCard = String(selectedAccount.cardNumber ?? "").replace(/\s/g, "");
  const last8 = rawCard.slice(-8);
  const cardGroups = last8.match(/.{1,4}/g) ?? [];

  const handleSwipe = (offset: number) => {
    const newIndex = currentIndex + offset;
    if (newIndex >= 0 && newIndex < accounts.length) {
      setDirection(offset);
      setIsFlipped(false); // Reset flip when changing accounts
      onAccountChange(accounts[newIndex].id);
    }
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    // Only swipe if not a small drag (could be a click)
    if (Math.abs(info.offset.x) < 10 && Math.abs(info.offset.y) < 10) {
      return; // This is likely a click, not a swipe
    }
    if (info.offset.x > swipeThreshold) {
      handleSwipe(1); // Swipe right (RTL: next account)
    } else if (info.offset.x < -swipeThreshold) {
      handleSwipe(-1); // Swipe left (RTL: previous account)
    }
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    })
  };

  return (
    <div className="space-y-4" dir="rtl">
      <div className="relative mx-auto w-full max-w-xl">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={selectedAccount.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 400, damping: 35 },
              opacity: { duration: 0.15 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            onClick={handleCardClick}
            className="cursor-grab active:cursor-grabbing"
            style={{ perspective: 1000 }}
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
              style={{ transformStyle: "preserve-3d" }}
              className="relative w-full aspect-[1.586/1]"
            >
              {/* Front of Card */}
              <div
                className={cn(
                  "absolute inset-0",
                  "overflow-hidden rounded-3xl",
                  "bg-linear-to-br",
                  gradient,
                  "shadow-[0_20px_50px_-20px_rgba(0,0,0,0.4)]",
                  "ring-1 ring-white/10"
                )}
                style={{ backfaceVisibility: "hidden" }}
              >
                {/* Subtle lighting */}
                <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/15 via-transparent to-transparent" />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />

                <div className="relative flex h-full flex-col justify-between p-5 sm:p-6 text-white">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/15">
                        <Landmark className="size-4" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <FormattedNumber type="normal" value={selectedAccount.name} />

                        <Badge
                          variant="secondary"
                          className="bg-white/10 text-white hover:bg-white/15 ring-1 ring-white/15 w-fit text-xs"
                        >
                          کد حساب: <FormattedNumber type="normal" value={selectedAccount.code} />
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <Badge className="bg-white/10 text-white hover:bg-white/15 ring-1 ring-white/15">
                        {statusInfo.label}
                      </Badge>
                      {selectedAccount.accountType?.name && (
                        <Badge
                          variant="secondary"
                          className="bg-white/10 text-white hover:bg-white/15 ring-1 ring-white/15"
                        >
                          {selectedAccount.accountType.name}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Balance and Card Number Row */}
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <span
                        className="font-mono text-sm font-medium tracking-[0.12em] opacity-90 inline-block"
                        style={{ direction: "ltr", unicodeBidi: "isolate" }}
                      >
                        <span className="opacity-90">•••• ••••</span>
                        {cardGroups.length > 0 && (
                          <span className="mx-2">
                            {cardGroups.map((g, i) => (
                              <span key={i} className={i === 0 ? "" : "ml-2"}>
                                <FormattedNumber type="normal" value={g} />
                              </span>
                            ))}
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="text-end">
                      <div className="text-2xl font-bold leading-none sm:text-3xl">
                        <FormattedNumber type="price" value={balance} />
                      </div>
                    </div>
                  </div>

                  {/* Footer instruction */}
                  <div className="text-center text-xs opacity-60">برای مشاهده اطلاعات بیشتر، روی کارت کلیک کنید</div>
                </div>
              </div>

              {/* Back of Card */}
              <div
                className={cn(
                  "absolute inset-0",
                  "overflow-hidden rounded-3xl",
                  "bg-linear-to-br",
                  gradient,
                  "shadow-[0_20px_50px_-20px_rgba(0,0,0,0.4)]",
                  "ring-1 ring-white/10"
                )}
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                {/* Subtle lighting */}
                <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/15 via-transparent to-transparent" />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />

                <div className="relative flex h-full flex-col justify-between p-6 sm:p-7 md:p-8 text-white">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold">اطلاعات تکمیلی حساب</h3>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="opacity-80">تاریخ ایجاد:</span>
                        <span className="font-medium">
                          <FormattedDate value={selectedAccount.createdAt} format="yyyy/MM/dd" />
                        </span>
                      </div>

                      {selectedAccount.balanceSummary && (
                        <>
                          <div className="flex justify-between items-center pt-2 border-t border-white/10">
                            <span className="opacity-80">کل واریزی‌ها:</span>
                            <span className="font-medium">
                              <FormattedNumber type="price" value={selectedAccount.balanceSummary.totalDeposits} />
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="opacity-80">واریزی‌های حساب:</span>
                            <span className="font-medium">
                              <FormattedNumber
                                type="price"
                                value={selectedAccount.balanceSummary.accountDeposits.amount}
                              />
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="opacity-80">واریزی‌های ماهیانه:</span>
                            <span className="font-medium">
                              <FormattedNumber
                                type="price"
                                value={selectedAccount.balanceSummary.subscriptionFeeDeposits.amount}
                              />
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-center text-xs opacity-60">برای برگشت، روی کارت کلیک کنید</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Dot Indicators */}
        {accounts.length > 1 && (
          <div className="flex items-center justify-center gap-3 mt-4">
            {/* Left Arrow (Previous in RTL) */}
            <button
              onClick={() => handleSwipe(-1)}
              disabled={currentIndex === 0}
              className={cn(
                "flex items-center justify-center size-8 rounded-full transition-all",
                currentIndex === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-muted hover:scale-110"
              )}
              aria-label="حساب قبلی"
            >
              <ChevronRight className="size-5" />
            </button>

            <div className="flex items-center justify-center gap-2">
              {accounts.map((acc, index) => (
                <button
                  key={acc.id}
                  onClick={() => {
                    setDirection(index > currentIndex ? -1 : 1);
                    onAccountChange(acc.id);
                  }}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    index === currentIndex
                      ? "w-6 bg-primary"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                  aria-label={`برو به حساب ${index + 1}`}
                />
              ))}
            </div>

            {/* Right Arrow (Next in RTL) */}
            <button
              onClick={() => handleSwipe(1)}
              disabled={currentIndex === accounts.length - 1}
              className={cn(
                "flex items-center justify-center size-8 rounded-full transition-all",
                currentIndex === accounts.length - 1
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-muted hover:scale-110"
              )}
              aria-label="حساب بعدی"
            >
              <ChevronLeft className="size-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
