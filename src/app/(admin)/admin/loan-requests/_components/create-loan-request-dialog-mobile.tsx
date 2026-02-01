import type { ReactNode } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";

type CreateLoanRequestDialogMobileProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  formContent: ReactNode;
};

export function CreateLoanRequestDialogMobile({ open, setOpen, formContent }: CreateLoanRequestDialogMobileProps) {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="default" size="sm">
          <PlusIcon className="size-4" />
          <span className="hidden sm:inline">درخواست جدید</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-start">
          <DrawerTitle>ایجاد درخواست وام</DrawerTitle>
          <DrawerDescription>اطلاعات درخواست وام را وارد کنید</DrawerDescription>
        </DrawerHeader>
        <div className="px-4">{formContent}</div>
      </DrawerContent>
    </Drawer>
  );
}
