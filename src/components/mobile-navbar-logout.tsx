"use client";

import { useState } from "react";
import { LogOut, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer";

interface MobileNavbarLogoutProps {
  onLogoutStart?: () => void;
}

export function MobileNavbarLogout({ onLogoutStart }: MobileNavbarLogoutProps) {
  const [showLogoutDrawer, setShowLogoutDrawer] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutDrawer(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutDrawer(false);
    onLogoutStart?.();
    window.location.href = "/auth/login";
  };

  return (
    <>
      {/* Logout Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleLogoutClick}
        className="flex size-[52px] shrink-0 items-center justify-center rounded-xl border border-destructive/50 bg-destructive/10 text-destructive transition-colors hover:border-destructive hover:bg-destructive/20"
      >
        <LogOut className="size-4.5" />
      </motion.button>

      {/* Logout Confirmation Drawer */}
      <Drawer open={showLogoutDrawer} onOpenChange={setShowLogoutDrawer}>
        <DrawerContent dir="rtl" className="border-destructive/50">
          <DrawerHeader className="text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="size-8 text-destructive" />
            </div>
            <DrawerTitle className="text-xl">خروج از حساب کاربری</DrawerTitle>
            <DrawerDescription className="text-base">
              آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="flex-row gap-2">
            <DrawerClose asChild>
              <Button variant="outline" size="lg" className="flex-1">
                انصراف
              </Button>
            </DrawerClose>
            <Button variant="destructive" size="lg" className="flex-1" onClick={handleLogoutConfirm}>
              خروج
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
