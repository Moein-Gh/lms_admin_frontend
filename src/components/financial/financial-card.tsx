import { TrendingUp } from "lucide-react";

import { Badge } from "../ui/badge";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";

const FinancialCard = () => {
  return (
    <Card className="@container/card h-full flex flex-row md:flex-col items-center md:items-stretch md:justify-between">
      <CardHeader className="flex-1 md:pb-6 pb-3">
        <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-2 md:gap-0">
          <CardDescription className="text-sm">درآمد کل</CardDescription>
          <Badge variant="outline" className="gap-1 text-xs">
            <TrendingUp className="size-3" />
            ۱۲.۵٪+
          </Badge>
        </div>
        <CardTitle className="text-xl md:text-2xl font-bold tabular-nums @[250px]/card:md:text-3xl">
          ۱,۲۵۰,۰۰۰
        </CardTitle>
        <p className="text-[10px] text-muted-foreground -mt-1">تومان</p>

        {/* Additional metrics row - only shown on desktop */}
        <div className="hidden md:grid grid-cols-2 gap-2 pt-1">
          <div className="space-y-0.5">
            <p className="text-[10px] text-muted-foreground">درآمد امروز</p>
            <p className="text-sm font-semibold tabular-nums">۴۵,۰۰۰</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] text-muted-foreground">میانگین روزانه</p>
            <p className="text-sm font-semibold tabular-nums">۳۸,۲۰۰</p>
          </div>
        </div>
      </CardHeader>

      {/* Vertical separator for mobile horizontal layout */}
      <div className="block md:hidden h-20 w-px bg-border" />

      <CardFooter className="flex-col items-end gap-1 text-[10px] md:border-t border-t-0 pt-3 md:pt-2 pb-3 px-4 flex-1">
        <div className="w-full flex items-start md:items-center justify-between flex-col md:flex-row gap-1 md:gap-0">
          <div className="flex items-center gap-1 text-muted-foreground">
            <TrendingUp className="size-3 text-emerald-500" />
            <span>روند صعودی این ماه</span>
          </div>
          <span className="font-medium text-emerald-600 text-xs">+۱۸۵,۰۰۰</span>
        </div>
        <div className="w-full flex items-start md:items-center justify-between text-muted-foreground/70 flex-col md:flex-row gap-1 md:gap-0 mt-2 md:mt-0">
          <span>بازدیدکنندگان در ۶ ماه گذشته</span>
          <span className="font-medium text-xs">۱۲,۴۵۰ نفر</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default FinancialCard;
