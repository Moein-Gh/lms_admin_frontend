"use client";

import * as React from "react";
import { LogOut } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
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
import { useLogout } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";

export function LogoutButton() {
  const logout = useLogout();
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);

  const trigger = (
    <Button
      variant="outline"
      size="sm"
      className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
      aria-label="خروج از حساب"
      disabled={logout.isPending}
    >
      <LogOut className="size-4" />
      {!isMobile && (logout.isPending ? "در حال خروج..." : "خروج از حساب کاربری")}
    </Button>
  );

  const title = "خروج از حساب کاربری";
  const description = "آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟";

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-start">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="pt-2">
            <Button
              variant="destructive"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
              className="w-full"
            >
              خروج
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                انصراف
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>انصراف</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => logout.mutate()}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            خروج
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
