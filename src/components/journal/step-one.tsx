import { Building2, CalendarDays, ChevronLeft, AccountIcon, type AppIcon } from "@/components/icons/index";

import type { AllocationFormData } from "@/components/journal/allocate-journal-panel.types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AllocationType } from "@/types/entities/journal-entry.type";

type AllocationTypeConfig = {
  readonly value: AllocationType;
  readonly label: string;
  readonly description: string;
  readonly icon: AppIcon;
  readonly iconColor: string;
};

const ALLOCATION_TYPE_CONFIG: AllocationTypeConfig[] = [
  {
    value: AllocationType.ACCOUNT_BALANCE,
    label: "موجودی حساب",
    description: "تخصیص مبلغ به موجودی حساب کاربر",
    icon: AccountIcon,
    iconColor: "text-(--allocation-account)"
  },
  {
    value: AllocationType.LOAN_REPAYMENT,
    label: "بازپرداخت وام",
    description: "تسویه اقساط وام‌های فعال کاربر",
    icon: Building2,
    iconColor: "text-(--allocation-loan)"
  },
  {
    value: AllocationType.SUBSCRIPTION_FEE,
    label: "ماهیانه",
    description: "پرداخت حق عضویت ماهیانه کاربر",
    icon: CalendarDays,
    iconColor: "text-(--allocation-fee)"
  }
];

export function StepOne({
  formData,
  setFormData,
  onNext
}: {
  formData: Partial<AllocationFormData>;
  setFormData: (data: Partial<AllocationFormData>) => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-3">
      <p className="px-0.5 text-xs font-semibold tracking-wide text-muted-foreground">نوع تخصیص را انتخاب کنید</p>
      <div className="grid grid-cols-1 gap-2">
        {ALLOCATION_TYPE_CONFIG.map(({ value, label, description, icon: Icon, iconColor }) => {
          return (
            <Button
              key={value}
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  ...formData,
                  allocationType: value,
                  userId: undefined,
                  accountId: undefined,
                  accountIds: undefined,
                  items: []
                });
                onNext();
              }}
              className="group h-auto w-full justify-start gap-4 rounded-xl p-4 text-right hover:border-primary/30 hover:bg-accent/40"
            >
              {/* Icon */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted/60 transition-all duration-200 group-hover:bg-muted">
                <Icon className={cn("size-5 transition-colors duration-200", iconColor)} />
              </div>

              {/* Text */}
              <div className="flex min-w-0 flex-1 flex-col items-start">
                <span className="text-sm font-semibold leading-tight text-foreground">{label}</span>
                <span className="mt-0.5 text-xs font-normal leading-relaxed text-muted-foreground">{description}</span>
              </div>

              {/* Indicator */}
              <ChevronLeft className="size-4 shrink-0 text-muted-foreground/30 transition-colors group-hover:text-muted-foreground" />
            </Button>
          );
        })}
      </div>
    </div>
  );
}
