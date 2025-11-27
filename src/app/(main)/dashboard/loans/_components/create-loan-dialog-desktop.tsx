import type { ReactNode } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

type CreateLoanDialogDesktopProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  formContent: ReactNode;
};

export function CreateLoanDialogDesktop({ open, setOpen, formContent }: CreateLoanDialogDesktopProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          <PlusIcon className="size-4" />
          <span className="hidden sm:inline">افزودن وام جدید</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>افزودن وام جدید</DialogTitle>
          <DialogDescription>اطلاعات وام بانکی جدید را وارد کنید</DialogDescription>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
}
