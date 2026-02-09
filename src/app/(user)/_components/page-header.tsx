"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  /**
   * The title/label to display on the right side
   */
  title: string;

  /**
   * Optional icon to display with the title
   */
  icon?: LucideIcon;

  /**
   * Optional subtitle/description below the title
   */
  subtitle?: string;

  /**
   * Whether to show the back button (default: true)
   */
  showBackButton?: boolean;

  /**
   * Custom back navigation path. If not provided, uses router.back()
   */
  backPath?: string;

  /**
   * Additional action buttons to render on the left side
   */
  actions?: React.ReactNode;

  /**
   * Additional className for the container
   */
  className?: string;
}

export function PageHeader({
  title,
  icon: Icon,
  subtitle,
  showBackButton = true,
  backPath,
  actions,
  className
}: PageHeaderProps) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBack = () => {
    if (backPath) {
      router.push(backPath);
    } else {
      router.back();
    }
  };

  return (
    <div
      className={cn(
        "sticky top-0 z-10 -mx-4 -mt-4 border-b px-4 pt-4 transition-all duration-200 md:-mx-6 md:-mt-6 md:px-6 md:pt-6",
        isScrolled && "bg-background/80 shadow-sm backdrop-blur-md",
        className
      )}
    >
      <div className="flex items-center justify-between gap-4 pb-3 md:pb-4">
        {/* Title Section */}
        <div className="flex flex-1 items-center gap-3">
          {Icon && (
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary sm:size-12">
              <Icon className="size-6 sm:size-7" />
            </div>
          )}
          <div className={cn(!subtitle && "flex items-center", subtitle && "space-y-0.5")}>
            <h1 className="text-base font-bold md:text-lg lg:text-xl">{title}</h1>
            {subtitle && <p className="text-xs text-muted-foreground md:text-sm">{subtitle}</p>}
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-2">
          {/* Custom Actions */}
          {actions}

          {/* Back Button */}
          {showBackButton && (
            <Button variant="outline" size="icon" onClick={handleBack} aria-label="بازگشت">
              <ArrowLeft className="size-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
