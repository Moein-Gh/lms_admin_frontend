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

type CreateLoanDialogMobileProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  formContent: ReactNode;
};

export function CreateLoanDialogMobile({ open, setOpen, formContent }: CreateLoanDialogMobileProps) {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="default" size="sm">
          <PlusIcon className="size-4" />
          <span className="hidden sm:inline">افزودن وام جدید</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-start">
          <DrawerTitle>افزودن وام جدید</DrawerTitle>
          <DrawerDescription>اطلاعات وام بانکی جدید را وارد کنید</DrawerDescription>
        </DrawerHeader>
        <div className="px-4">{formContent}</div>
      </DrawerContent>
    </Drawer>
  );
}
