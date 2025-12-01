"use client";

import * as React from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type CreateAccountDialogDesktopProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  formContent: React.ReactNode;
};
export function CreateAccountDialogDesktop({ open, setOpen, formContent }: CreateAccountDialogDesktopProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="size-4" />
          افزودن حساب جدید
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]" dir="rtl">
        <DialogHeader className="text-start">
          <DialogTitle>افزودن حساب جدید</DialogTitle>
          <div className="text-sm text-muted-foreground">اطلاعات حساب بانکی جدید را وارد کنید</div>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
}
