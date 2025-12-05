import Link from "next/link";

import { Lock } from "lucide-react";

export default function page() {
  return (
    <div className="bg-background flex min-h-dvh flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <Lock className="text-primary mx-auto size-12" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">دسترسی غیرمجاز</h1>
        <p className="text-muted-foreground mt-4">
          شما اجازه مشاهده این محتوا را ندارید. در صورت نیاز با مدیر سامانه تماس بگیرید.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => (typeof window !== "undefined" ? window.history.back() : undefined)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary inline-flex items-center rounded-md px-4 py-2 text-sm font-medium shadow-xs transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-hidden"
          >
            بازگشت به صفحه قبل
          </button>
          <Link
            href="/dashboard"
            className="bg-muted text-muted-foreground hover:bg-muted/90 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium shadow-xs transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-hidden"
            prefetch={false}
          >
            رفتن به صفحه اصلی
          </Link>
        </div>
      </div>
    </div>
  );
}
