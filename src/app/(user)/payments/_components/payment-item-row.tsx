import Link from "next/link";
import { BadgeCheck, BadgeX, Calendar, Coins } from "lucide-react";
import { motion } from "motion/react";

import { FormattedNumber } from "@/components/formatted-number";
import { formatPersianDate, DATE_FORMATS } from "@/lib/date-service";
import { cn } from "@/lib/utils";
import { PaymentStatus, PaymentType, type PaymentItemDto } from "@/types/entities/payment.type";

type PaymentItemRowProps = {
  item: PaymentItemDto;
};

export function PaymentItemRow({ item }: PaymentItemRowProps) {
  const isPaid = item.status === PaymentStatus.PAID;
  const isInstallment = item.type === PaymentType.INSTALLMENT;
  const title = isInstallment ? item.loanName : item.accountName;

  const getTargetLink = () => {
    if (isInstallment && item.loanId) {
      return `/admin/loans/${item.loanId}`;
    }
    if (!isInstallment && item.accountId) {
      return `/admin/accounts/${item.accountId}`;
    }
    if (item.transactionId) {
      return `/admin/transactions/${item.transactionId}`;
    }
    return null;
  };

  const targetLink = getTargetLink();

  const content = (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      data-paid={isPaid}
      className={cn(
        "rounded-xl border-2 border-border/50 bg-card p-3 transition-all sm:p-4",
        "hover:border-primary/30",
        "data-[paid=true]:opacity-70 data-[paid=true]:hover:opacity-90"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{title}</p>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Coins className="size-3.5 shrink-0" />
            <span className="truncate">{isInstallment ? `قسط ${item.installmentNumber}` : "ماهیانه"}</span>
          </div>
        </div>

        <div className="shrink-0 text-end">
          <p className="text-[10px] text-muted-foreground">مبلغ</p>
          <p className="mt-0.5 font-bold text-base tabular-nums">
            <FormattedNumber type="price" value={item.amount} />
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-accent/50 px-2 py-1 text-muted-foreground">
            <Calendar className="size-3.5" />
            <span>
              سررسید:{" "}
              <span className="tabular-nums font-medium">{formatPersianDate(item.dueDate, DATE_FORMATS.SHORT)}</span>
            </span>
          </span>

          {item.paymentDate && (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-accent/50 px-2 py-1 text-muted-foreground">
              <Calendar className="size-3.5" />
              <span>
                پرداخت:{" "}
                <span className="tabular-nums font-medium">
                  {formatPersianDate(item.paymentDate, DATE_FORMATS.SHORT)}
                </span>
              </span>
            </span>
          )}
        </div>

        <div
          aria-label={isPaid ? "پرداخت شده" : "پرداخت نشده"}
          className={cn(
            "inline-flex size-9 items-center justify-center rounded-lg shrink-0",
            isPaid
              ? "bg-green-500/10 text-green-700 dark:text-green-400"
              : "bg-orange-500/10 text-orange-700 dark:text-orange-400"
          )}
        >
          {isPaid ? <BadgeCheck className="size-5" /> : <BadgeX className="size-5" />}
        </div>
      </div>
    </motion.div>
  );

  if (targetLink) {
    return (
      <Link href={targetLink} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
