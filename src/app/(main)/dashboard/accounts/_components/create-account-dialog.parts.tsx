"use client";

import * as React from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";

import type { CreateAccountRequest } from "@/lib/account-api";
import type { Account } from "@/types/entities/account.type";

type CreateAccountDialogMobileProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  formContent: React.ReactNode;
  create: UseMutationResult<Account, unknown, CreateAccountRequest, unknown>;
};
export function CreateAccountDialogMobile({ open, setOpen, formContent, create }: CreateAccountDialogMobileProps) {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>
          <PlusIcon className="size-4" />
          <span className="hidden sm:inline">افزودن حساب جدید</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>افزودن حساب جدید</DrawerTitle>
          <div className="text-sm text-muted-foreground">اطلاعات حساب بانکی جدید را وارد کنید</div>
        </DrawerHeader>
        <div className="px-4">{formContent}</div>
        <DrawerFooter>
          <div className="flex w-full gap-3">
            <Button
              type="button"
              className="flex-1"
              onClick={() => {
                const formElement = document.querySelector("form");
                if (formElement instanceof HTMLFormElement) formElement.requestSubmit();
              }}
              disabled={create.isPending}
            >
              {create.isPending ? "در حال ایجاد..." : "ایجاد حساب"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">لغو</Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

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
