import type { KeyboardEvent } from "react";
import { FormattedNumber } from "@/components/formatted-number";
import { Check } from "@/components/icons";
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
        "group cursor-pointer transition-all duration-200 overflow-hidden border-2",
        selected ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/40 hover:bg-accent/20"
      )}
    >
      <div className="flex items-start gap-3 px-4 py-3">
        {/* Radio indicator — aligned to top of content */}
        <div
          aria-hidden="true"
          className={cn(
            "mt-0.5 flex shrink-0 items-center justify-center rounded-full border-2 w-5 h-5 transition-all duration-200",
            selected
              ? "border-primary bg-primary text-primary-foreground"
              : "border-muted-foreground/40 group-hover:border-primary/60"
          )}
        >
          {selected && <Check className="w-3 h-3" />}
        </div>

        {/* Main content */}
        <div className="flex flex-1 min-w-0 flex-col gap-1.5">
          {/* Row 1: name + badge */}
          <div className="flex items-center justify-between gap-2">
            <span
              className={cn(
                "text-sm font-semibold leading-tight truncate",
                selected ? "text-primary" : "text-foreground"
              )}
              title={account.name}
            >
              {account.name}
            </span>
            <Badge variant={statusMeta.badgeVariant} className="shrink-0 px-2 py-0.5 text-[10px]">
              {statusMeta.label}
            </Badge>
          </div>

          {/* Row 2: bank · last4  +  balance */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground truncate">
              {account.bankName} · ****{account.cardNumber.slice(-4)}
            </span>
            <span className={cn("shrink-0 flex flex-col items-end", selected ? "text-primary" : "text-foreground")}>
              <span className="text-[10px] text-muted-foreground">موجودی</span>
              <span className="text-sm font-bold tabular-nums">
                <FormattedNumber type="price" value={Number(account.balanceSummary?.totalDeposits) || 0} />
              </span>
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default AccountCardSelectable;
