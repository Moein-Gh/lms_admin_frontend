"use client";

import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export type ResponsivePanelProps = {
  readonly children: React.ReactNode;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly variant?: "default" | "destructive" | "warning";
};

const variantStyles = {
  default: "",
  destructive:
    "border-destructive/50 [&_[data-slot=dialog-title]]:text-destructive [&_[data-slot=drawer-title]]:text-destructive",
  warning:
    "border-yellow-500/50 [&_[data-slot=dialog-title]]:text-yellow-600 [&_[data-slot=drawer-title]]:text-yellow-600"
} as const;

export function ResponsivePanel({ children, open, onOpenChange, variant = "default" }: ResponsivePanelProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent dir="rtl" className={cn(variantStyles[variant], "px-6 pb-6")}>
          {children}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-2xl", variantStyles[variant])} dir="rtl">
        {children}
      </DialogContent>
    </Dialog>
  );
}

ResponsivePanel.displayName = "ResponsivePanel";
