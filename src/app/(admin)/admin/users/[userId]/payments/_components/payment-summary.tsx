import { FormattedNumber } from "@/components/formatted-number";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SummaryItemProps = {
  label: string;
  value: string;
  variant?: "default" | "success" | "warning";
  className?: string;
};

function SummaryItem({ label, value, variant = "default", className }: SummaryItemProps) {
  let borderColor = "border-primary/20 bg-primary/5";
  let textColor = "text-foreground";

  if (variant === "success") {
    borderColor = "border-green-500/20 bg-green-500/5";
    textColor = "text-green-700 dark:text-green-400";
  } else if (variant === "warning") {
    borderColor = "border-orange-500/20 bg-orange-500/5";
    textColor = "text-orange-700 dark:text-orange-400";
  }

  return (
    <div className={cn("w-full sm:flex-1", className)}>
      <Card className={cn("border-2", borderColor)}>
        <CardContent className="p-3 sm:p-4">
          <p className="text-xs text-muted-foreground mb-1.5">{label}</p>
          <p className={cn("font-bold text-lg sm:text-xl tabular-nums", textColor)}>
            <FormattedNumber type="price" value={value} />
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

type PaymentSummaryProps = {
  grandTotal: string;
  totalPaid: string;
  totalUnpaid: string;
};

export function PaymentSummary({ grandTotal, totalPaid, totalUnpaid }: PaymentSummaryProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
      <SummaryItem label="مجموع کل" value={grandTotal} variant="default" className="col-span-2 sm:col-span-1" />
      <SummaryItem label="پرداخت شده" value={totalPaid} variant="success" />
      <SummaryItem label="پرداخت نشده" value={totalUnpaid} variant="warning" />
    </div>
  );
}
