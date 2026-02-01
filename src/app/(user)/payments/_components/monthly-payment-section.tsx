"use client";

import { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { FormattedNumber } from "@/components/formatted-number";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { PaymentStatus, type MonthlyPaymentDto } from "@/types/entities/payment.type";

import { PaymentItemRow } from "./payment-item-row";

type MonthlyPaymentSectionProps = {
  month: MonthlyPaymentDto;
};

export function MonthlyPaymentSection({ month }: MonthlyPaymentSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const paidCount = month.items.filter((item) => item.status === PaymentStatus.PAID).length;
  const unpaidCount = month.items.filter((item) => item.status === PaymentStatus.NOT_PAID).length;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
        <Card className="overflow-hidden border-border/60">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors p-4 sm:p-5">
              <div className="flex items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="bg-primary/10 text-primary rounded-lg p-2.5 shrink-0">
                    <Calendar className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base mb-0 shrink-0">{month.monthName}</h3>
                      <div className="text-muted-foreground shrink-0">
                        <FormattedNumber type="normal" value={month.year} />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs mt-2">
                      <span className="text-muted-foreground">{month.items.length} مورد</span>
                      {paidCount > 0 && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-green-500/10 text-green-700 dark:text-green-400">
                          ✓ <FormattedNumber type="normal" value={paidCount} /> پرداخت شده
                        </span>
                      )}
                      {unpaidCount > 0 && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-orange-500/10 text-orange-700 dark:text-orange-400">
                          <FormattedNumber type="normal" value={unpaidCount} /> باقیمانده!
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-end">
                    <p className="text-[10px] text-muted-foreground mb-1">مجموع</p>
                    <p className="font-bold text-base tabular-nums">
                      <FormattedNumber type="price" value={month.total} />
                    </p>
                  </div>
                  <ChevronDown
                    className={cn("size-5 text-muted-foreground transition-transform shrink-0", isOpen && "rotate-180")}
                  />
                </div>
              </div>
            </CardHeader>
          </CollapsibleTrigger>

          <AnimatePresence initial={false}>
            {isOpen && (
              <CollapsibleContent forceMount asChild>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <Separator />
                  <CardContent className="p-4 space-y-3 bg-accent/30">
                    {month.items.map((item) => (
                      <PaymentItemRow key={item.id} item={item} />
                    ))}
                  </CardContent>
                </motion.div>
              </CollapsibleContent>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </Collapsible>
  );
}
