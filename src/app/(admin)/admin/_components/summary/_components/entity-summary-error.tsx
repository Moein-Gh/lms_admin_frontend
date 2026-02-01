import { AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type EntitySummaryErrorProps = {
  readonly message?: string;
  readonly onRetry?: () => void;
  readonly className?: string;
};

export function EntitySummaryError({ message = "خطا در دریافت اطلاعات", onRetry, className }: EntitySummaryErrorProps) {
  return (
    <Card className={cn("py-0", className)}>
      <CardContent className="flex flex-col items-center justify-center gap-2 p-4 text-center">
        <div className="flex size-8 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="size-4" />
        </div>
        <p className="text-xs text-muted-foreground">{message}</p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="h-7 gap-1.5 text-xs">
            <RefreshCw className="size-3" />
            تلاش مجدد
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
