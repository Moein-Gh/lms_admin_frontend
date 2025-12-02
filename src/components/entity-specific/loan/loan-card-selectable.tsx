import { HandCoins, Check } from "lucide-react";
import { FormattedDate } from "@/components/formatted-date";
import { FormattedNumber } from "@/components/formatted-number";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Loan } from "@/types/entities/loan.type";

type LoanCardProps = {
  readonly loan: Loan;
  readonly selected?: boolean;
  readonly onSelect?: (loan: Loan) => void;
};

export function LoanCardSelectable({ loan, selected, onSelect }: LoanCardProps) {
  const typeName = loan.loanType?.name ?? "-";

  return (
    <Card
      key={loan.id}
      className={cn(
        "group cursor-pointer transition-all border",
        "hover:border-primary/50 hover:bg-accent/50",
        selected ? "border-primary bg-primary/5" : "border-border"
      )}
      onClick={() => onSelect?.(loan)}
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
            <HandCoins className={cn("w-5 h-5 shrink-0", selected ? "text-primary" : "text-muted-foreground")} />
            <div className="min-w-0">
              <div className={cn("font-semibold truncate", selected && "text-primary")}>
                {loan.name || `کد: ${loan.code}`}
              </div>
              <div className="text-sm text-muted-foreground">#{loan.code}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="flex flex-col items-end text-sm text-muted-foreground">
              <div>
                <span className="text-sm">مبلغ:</span>
                <span className="mr-1">
                  <FormattedNumber type="price" value={loan.amount} />
                </span>
              </div>
              <div className="flex items-center gap-1">
                <FormattedDate value={loan.startDate} />
              </div>
            </div>

            <Badge className="text-[11px] px-2 py-0">{typeName}</Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default LoanCardSelectable;
