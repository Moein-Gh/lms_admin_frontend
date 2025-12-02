import { Calendar, Check } from "lucide-react";
import { FormattedDate } from "@/components/formatted-date";
import { FormattedNumber } from "@/components/formatted-number";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SubscriptionFee } from "@/types/entities/subscription-fee.type";

type SubscriptionFeeCardProps = {
  readonly fee: SubscriptionFee;
  readonly selected?: boolean;
  readonly onSelect?: (fee: SubscriptionFee) => void;
};

export function SubscriptionFeeCardSelectable({ fee, selected, onSelect }: SubscriptionFeeCardProps) {
  return (
    <Card
      key={fee.id}
      className={cn(
        "group cursor-pointer transition-all border",
        "hover:border-primary/50 hover:bg-accent/50",
        selected ? "border-primary bg-primary/5" : "border-border"
      )}
      onClick={() => onSelect?.(fee)}
    >
      <div className="flex items-center gap-4 p-4">
        <div
          className={cn(
            "flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all shrink-0",
            selected
              ? "bg-primary border-primary text-primary-foreground"
              : "border-muted-foreground/40 group-hover:border-primary/50"
          )}
        >
          {selected && <Check className="w-3 h-3" />}
        </div>

        <div className="flex-1 min-w-0 flex items-center justify-between gap-4 flex-row-reverse">
          <div className="flex items-center gap-3 min-w-0">
            <Calendar className={cn("w-5 h-5 shrink-0", selected ? "text-primary" : "text-muted-foreground")} />
            <div className="min-w-0">
              <div className={cn("font-semibold truncate", selected && "text-primary")}>
                {fee.code ? `کد: ${fee.code}` : `ماهیانه ${fee.id}`}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="flex flex-col items-start text-sm text-muted-foreground">
              <div className="text-sm font-semibold text-foreground">
                <FormattedDate value={fee.dueDate ?? fee.periodStart} />
              </div>
              <div className="text-xs text-muted-foreground">
                <span className="text-xs">مبلغ:</span>
                <span className="mr-1">
                  <FormattedNumber type="price" value={fee.amount} />
                </span>
              </div>
            </div>

            <Badge className="text-[11px] px-2 py-0">ماهیانه</Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default SubscriptionFeeCardSelectable;
