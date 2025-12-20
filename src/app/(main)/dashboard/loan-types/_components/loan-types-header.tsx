"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { LoanTypeForm } from "./loan-type-form";

export function LoanTypesHeader() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const Title = "تعریف نوع وام جدید";
  const Description = "اطلاعات نوع وام جدید را وارد کنید.";

  if (isMobile) {
    return (
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">انواع وام</h1>
          <p className="text-muted-foreground mt-1">مدیریت و مشاهده لیست انواع وام</p>
        </div>

        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button size="icon" className="rounded-lg">
              <Plus className="size-5" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader className="text-right">
                <DrawerTitle>{Title}</DrawerTitle>
                <DrawerDescription>{Description}</DrawerDescription>
              </DrawerHeader>
              <div className="p-4">
                <LoanTypeForm onSuccess={() => setOpen(false)} onCancel={() => setOpen(false)} />
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">انواع وام</h1>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="ml-2 size-4" />
            نوع وام جدید
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="text-right">
            <DialogTitle>{Title}</DialogTitle>
            <DialogDescription>{Description}</DialogDescription>
          </DialogHeader>
          <LoanTypeForm onSuccess={() => setOpen(false)} onCancel={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
