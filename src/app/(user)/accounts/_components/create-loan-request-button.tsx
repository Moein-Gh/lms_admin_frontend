"use client";

import * as React from "react";
import { PlusIcon } from "@/components/icons";
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
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/general/use-mobile";
import { useUserCreateLoanRequest } from "@/hooks/user/use-loan-request";
import { cn } from "@/lib/utils";
import { CreateLoanRequestForm } from "./create-loan-request-form";

interface CreateLoanRequestButtonProps {
  readonly accountId?: string;
  readonly buttonSize?: "default" | "sm" | "lg" | "icon";
  readonly buttonClassName?: string;
  readonly hideLabelOnMobile?: boolean;
  readonly buttonLabel?: string;
  readonly buttonIcon?: React.ReactNode;
}

export function CreateLoanRequestButton({
  accountId,
  buttonSize = "sm",
  buttonClassName,
  hideLabelOnMobile = true,
  buttonLabel = "درخواست وام جدید",
  buttonIcon
}: CreateLoanRequestButtonProps) {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const [selectedAccountId, setSelectedAccountId] = React.useState<string | undefined>(accountId);
  const formRef = React.useRef<HTMLFormElement>(null);
  const isMobile = useIsMobile();
  const create = useUserCreateLoanRequest();

  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    if (!val) {
      setStep(1);
      setSelectedAccountId(accountId);
    }
  };

  const trigger = (
    <Button variant="default" size={buttonSize} className={cn(buttonClassName)}>
      {buttonIcon ?? <PlusIcon className="size-4" />}
      <span className={cn(hideLabelOnMobile && "hidden sm:inline")}>{buttonLabel}</span>
    </Button>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-start">
            <DrawerTitle>درخواست وام جدید</DrawerTitle>
            <DrawerDescription>
              {step === 1 ? "حساب مورد نظر را انتخاب کنید" : "جزئیات درخواست وام را وارد کنید"}
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex gap-1.5 px-4 pb-4">
            <div className="h-1 flex-1 rounded-full bg-primary transition-colors" />
            <div className={cn("h-1 flex-1 rounded-full transition-colors", step === 2 ? "bg-primary" : "bg-muted")} />
          </div>
          <div className="flex-1 overflow-y-auto px-4">
            <CreateLoanRequestForm
              formRef={formRef}
              step={step}
              setStep={setStep}
              selectedAccountId={selectedAccountId}
              setSelectedAccountId={setSelectedAccountId}
              defaultAccountId={accountId}
              create={create}
              setOpen={handleOpenChange}
              hideFooter
            />
          </div>
          <DrawerFooter>
            {step === 1 ? (
              <>
                <Button type="button" onClick={() => setStep(2)} disabled={!selectedAccountId}>
                  ادامه
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline">لغو</Button>
                </DrawerClose>
              </>
            ) : (
              <>
                <Button type="button" onClick={() => formRef.current?.requestSubmit()} disabled={create.isPending}>
                  {create.isPending ? "در حال ثبت..." : "ثبت درخواست"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  بازگشت
                </Button>
              </>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <DialogTitle>درخواست وام جدید</DialogTitle>
          <DialogDescription>اطلاعات درخواست وام را وارد کنید</DialogDescription>
        </DialogHeader>
        <CreateLoanRequestForm
          step={step}
          setStep={setStep}
          selectedAccountId={selectedAccountId}
          setSelectedAccountId={setSelectedAccountId}
          defaultAccountId={accountId}
          create={create}
          setOpen={handleOpenChange}
        />
      </DialogContent>
    </Dialog>
  );
}
