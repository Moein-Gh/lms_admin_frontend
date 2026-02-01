"use client";

import { useState } from "react";
import { ChevronLeft, Layers, Plus } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
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
import { cn } from "@/lib/utils";
import { LoanTypeForm } from "./loan-type-form";

export function LoanTypesHeader() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const Title = "تعریف نوع وام جدید";
  const Description = "اطلاعات نوع وام جدید را وارد کنید.";

  const headerContent = (
    <div className="flex flex-col gap-1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">داشبورد</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronLeft />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>انواع وام</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl sm:h-12 sm:w-12">
          <Layers className="size-6 sm:size-7" />
        </div>
        <h1 className="text-xl font-bold tracking-tight sm:text-3xl">انواع وام</h1>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div
        data-slot="loan-types-header"
        className={cn("flex items-center justify-between gap-4", "border-b border-border/40 pb-6")}
      >
        {headerContent}

        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button size="icon" className="rounded-lg shrink-0">
              <Plus className="size-5" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader className="text-start">
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
    <div
      data-slot="loan-types-header"
      className={cn("flex items-center justify-between gap-4", "border-b border-border/40 pb-6")}
    >
      {headerContent}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="shrink-0">
            <Plus className="ml-2 size-4" />
            نوع وام جدید
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="text-start">
            <DialogTitle>{Title}</DialogTitle>
            <DialogDescription>{Description}</DialogDescription>
          </DialogHeader>
          <LoanTypeForm onSuccess={() => setOpen(false)} onCancel={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
