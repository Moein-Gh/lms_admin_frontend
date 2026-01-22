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

type CreateLoanRequestDialogDesktopProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  formContent: ReactNode;
};

export function CreateLoanRequestDialogDesktop({ open, setOpen, formContent }: CreateLoanRequestDialogDesktopProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          <PlusIcon className="size-4" />
          <span className="hidden sm:inline">درخواست جدید</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>ایجاد درخواست وام</DialogTitle>
          <DialogDescription>اطلاعات درخواست وام را وارد کنید</DialogDescription>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
}
