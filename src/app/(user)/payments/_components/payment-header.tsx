"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type PaymentHeaderProps = {
  userName?: string;
};

export function PaymentHeader({ userName }: PaymentHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="shrink-0 size-9 sm:size-10">
          <ArrowRight className="size-5" />
        </Button>
        <h1 className="text-lg sm:text-2xl font-bold truncate">پرداخت‌های آینده</h1>
      </div>

      {userName && <p className="text-xs sm:text-sm text-muted-foreground truncate mt-1 sm:mt-0">{userName}</p>}
    </div>
  );
}
