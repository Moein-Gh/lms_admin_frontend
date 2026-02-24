"use client";

import { useState } from "react";
import { PlusIcon, WalletIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/general/use-mobile";

interface QuickActionsProps {
  accountId: string;
}

export function QuickActions({ accountId }: QuickActionsProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const TriggerButton = (
    <Button className="w-full justify-start h-12 text-base font-medium" size="lg">
      <div className="bg-primary-foreground/20 p-1 rounded-md ml-3">
        <PlusIcon className="size-5" />
      </div>
      درخواست وام جدید
    </Button>
  );

  const content = (
    <div className="p-4 flex flex-col items-center justify-center min-h-[200px] text-center gap-4">
      <div className="bg-muted p-4 rounded-full">
        <WalletIcon className="size-8 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h3 className="font-bold">ثبت درخواست وام</h3>
        <p className="text-sm text-muted-foreground">فرم درخواست وام در اینجا قرار خواهد گرفت (در مرحله بعد)</p>
      </div>
    </div>
  );

  return (
    <Card className="h-full border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          دسترسی سریع
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {isMobile ? (
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>{TriggerButton}</DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="text-right">
                <DrawerTitle>درخواست وام جدید</DrawerTitle>
                <DrawerDescription>برای ثبت درخواست وام جدید، فرم زیر را تکمیل کنید.</DrawerDescription>
              </DrawerHeader>
              {content}
            </DrawerContent>
          </Drawer>
        ) : (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{TriggerButton}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>درخواست وام جدید</DialogTitle>
                <DialogDescription>برای ثبت درخواست وام جدید، فرم زیر را تکمیل کنید.</DialogDescription>
              </DialogHeader>
              {content}
            </DialogContent>
          </Dialog>
        )}

        {/* Placeholder for other potential actions */}
        {/* <Button variant="outline" className="w-full justify-start h-12 text-sm">
            <div className="bg-muted p-1 rounded-md ml-3">
                <ArrowLeftRight className="size-4" />
            </div>
            انتقال وجه
        </Button> */}
      </CardContent>
    </Card>
  );
}
