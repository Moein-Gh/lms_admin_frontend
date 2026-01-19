import { CalendarClock } from "lucide-react";

import { ReportMenuCard } from "./_components/report-menu-card";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">گزارش‌ها</h1>
        <p className="text-muted-foreground">گزارش‌های مختلف را مشاهده کنید</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ReportMenuCard
          title="پیش‌بینی اقساط"
          description="پیش‌بینی اقساط ماه جاری، ماه بعد و سه ماه آینده"
          icon={CalendarClock}
          href="/dashboard/reports/installments"
        />
      </div>
    </div>
  );
}
