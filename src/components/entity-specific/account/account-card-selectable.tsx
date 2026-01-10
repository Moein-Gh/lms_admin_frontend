import type { KeyboardEvent } from "react";
import { Calendar, Check } from "lucide-react";
import { FormattedDate } from "@/components/formatted-date";
import { FormattedNumber } from "@/components/formatted-number";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AccountStatusLabels, type Account } from "@/types/entities/account.type";

type AccountCardProps = {
  readonly account: Account;
  readonly selected?: boolean;
  readonly onSelect?: (account: Account) => void;
};

export function AccountCardSelectable({ account, selected, onSelect }: AccountCardProps) {
  const statusMeta = AccountStatusLabels[account.status];
  const handleSelect = () => onSelect?.(account);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect();
    }
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      className={cn(
        "group relative cursor-pointer transition-all duration-200 ease-in-out overflow-hidden",
        "border hover:shadow-md",
        selected
          ? "border-primary ring-1 ring-primary bg-primary/5 shadow-sm"
          : "border-border hover:border-primary/30 hover:bg-accent/5"
      )}
    >
      <div className="p-4 flex flex-col gap-4">
        {/* Header: Identity & Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Selection Indicator */}
            <div
              aria-hidden="true"
              className={cn(
                "flex items-center justify-center w-5 h-5 rounded-full border transition-all duration-200 shrink-0",
                selected
                  ? "bg-primary border-primary text-primary-foreground scale-100"
                  : "border-muted-foreground/30 bg-background group-hover:border-primary/50"
              )}
            >
              {selected && <Check className="w-3 h-3" />}
            </div>

            {/* Account Details */}
            <div className="flex flex-col min-w-0">
              <span
                className={cn(
                  "font-semibold text-sm truncate transition-colors",
                  selected ? "text-primary" : "text-foreground"
                )}
                title={account.name || `حساب ${account.code}`}
              >
                {account.name || `حساب ${account.code}`}
              </span>
              <span className="text-xs text-muted-foreground font-mono truncate opacity-80">#{account.code}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {account.bookCode && (
              <span className="inline-flex items-center text-[11px] text-foreground font-medium bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10 shrink-0">
                شماره دفتر: {account.bookCode}
              </span>
            )}
            <Badge variant={statusMeta.badgeVariant} className="px-2 py-0.5 text-[10px] font-medium shadow-none">
              {statusMeta.label}
            </Badge>
          </div>
        </div>

        {/* Footer: Financials & Date */}
        <div className="flex items-end justify-between gap-4 pt-1">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-muted-foreground font-medium">موجودی حساب</span>
            <div className="flex items-baseline gap-1 text-foreground">
              <span className="text-lg font-bold tabular-nums tracking-tight">
                <FormattedNumber type="price" value={Number(account.balanceSummary?.totalDeposits) || 0} />
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-md transition-colors group-hover:bg-muted/80">
            <Calendar className="w-3 h-3 opacity-70" />
            <FormattedDate value={account.createdAt} />
          </div>
        </div>
      </div>
    </Card>
  );
}

export default AccountCardSelectable;
