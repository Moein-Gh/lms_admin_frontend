import { CalendarCheckIcon, Check } from "lucide-react";
import { FormattedDate } from "@/components/formatted-date";
import { FormattedNumber } from "@/components/formatted-number";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Installment } from "@/types/entities/installment.type";

type InstallmentCardProps = {
  readonly installment: Installment;
  readonly selected?: boolean;
  readonly onSelect?: (installment: Installment) => void;
};

export function InstallmentCardSelectable({ installment, selected, onSelect }: InstallmentCardProps) {
  return (
    <Card
      key={installment.id}
      className={cn(
        "group cursor-pointer transition-all border",
        "hover:border-primary/50 hover:bg-accent/50",
        selected ? "border-primary bg-primary/5" : "border-border"
      )}
      onClick={() => onSelect?.(installment)}
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

        <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <CalendarCheckIcon
              className={cn("w-5 h-5 shrink-0", selected ? "text-primary" : "text-muted-foreground")}
            />
            <div className="min-w-0">
              <div className={cn("font-semibold truncate", selected && "text-primary")}>
                قسط {installment.installmentNumber}
              </div>
              <div className="text-sm text-muted-foreground">#{installment.code}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="flex flex-col items-end text-sm text-muted-foreground">
              <div>
                <span className="text-sm">مبلغ:</span>
                <span className="mr-1">
                  <FormattedNumber type="price" value={installment.amount} />
                </span>
              </div>
              <div className="flex items-center gap-1">
                <FormattedDate value={installment.dueDate} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default InstallmentCardSelectable;
