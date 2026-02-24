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
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/general/use-mobile";
import { useUserCreateLoanRequest } from "@/hooks/user/use-loan-request";
import { CreateLoanRequestForm } from "./create-loan-request-form";

interface CreateLoanRequestButtonProps {
  accountId?: string;
}

export function CreateLoanRequestButton({ accountId }: CreateLoanRequestButtonProps) {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();
  const create = useUserCreateLoanRequest();

  const trigger = (
    <Button variant="default" size="sm">
      <PlusIcon className="size-4" />
      <span className="hidden sm:inline">درخواست وام جدید</span>
    </Button>
  );

  const formContent = <CreateLoanRequestForm defaultAccountId={accountId} create={create} setOpen={setOpen} />;

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-start">
            <DrawerTitle>درخواست وام جدید</DrawerTitle>
            <DrawerDescription>اطلاعات درخواست وام را وارد کنید</DrawerDescription>
          </DrawerHeader>
          <div className="px-4">{formContent}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <DialogTitle>درخواست وام جدید</DialogTitle>
          <DialogDescription>اطلاعات درخواست وام را وارد کنید</DialogDescription>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
}
