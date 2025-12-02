import { Calendar, Check, IdCard } from "lucide-react";
import { FormattedDate } from "@/components/formatted-date";
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

  return (
    <Card
      key={account.id}
      className={cn(
        "group cursor-pointer transition-all border",
        "hover:border-primary/50 hover:bg-accent/50",
        selected ? "border-primary bg-primary/5" : "border-border"
      )}
      onClick={() => onSelect?.(account)}
    >
      <div className="flex items-center gap-3 p-3">
        {/* Selection indicator */}
        <div
          className={cn(
            "flex items-center justify-center w-4 h-4 rounded-full border-2 transition-all shrink-0",
            selected
              ? "bg-primary border-primary text-primary-foreground"
              : "border-muted-foreground/40 group-hover:border-primary/50"
          )}
        >
          {selected && <Check className="w-2.5 h-2.5" />}
        </div>

        {/* Account info */}
        <div className="flex-1 min-w-0 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <IdCard className={cn("w-4 h-4 shrink-0", selected ? "text-primary" : "text-muted-foreground")} />
            <span className={cn("font-medium truncate", selected && "text-primary")}>
              {account.name || `حساب ${account.code}`}
            </span>
            <span className="text-xs text-muted-foreground shrink-0">#{account.code}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <FormattedDate value={account.createdAt} />
            </div>
            <Badge variant={statusMeta.badgeVariant} className="text-[10px] px-1.5 py-0">
              {statusMeta.label}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default AccountCardSelectable;
