import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type EntitySummarySectionHeaderProps = {
  readonly title: string;
  readonly subtitle?: string;
  readonly icon: ReactNode;
  readonly action?: ReactNode;
  readonly className?: string;
};

export function EntitySummarySectionHeader({
  title,
  subtitle,
  icon,
  action,
  className
}: EntitySummarySectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center gap-1.5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</div>
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          {subtitle && <p className="text-[10px] text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex items-center gap-1.5">{action}</div>}
    </div>
  );
}
