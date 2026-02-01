import { Calendar } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function EmptyPaymentsState() {
  return (
    <Card>
      <CardContent className="p-8 sm:p-12 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-muted mb-4">
          <Calendar className="size-7 sm:size-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-base sm:text-lg mb-2">پرداختی یافت نشد</h3>
        <p className="text-sm text-muted-foreground">هیچ پرداخت آینده یا گذشته‌ای برای این کاربر ثبت نشده است.</p>
      </CardContent>
    </Card>
  );
}
