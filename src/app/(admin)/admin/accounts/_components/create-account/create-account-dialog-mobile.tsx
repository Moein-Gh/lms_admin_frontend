import { UseMutationResult } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";
import { CreateAccountRequest } from "@/lib/account-api";
import { Account } from "@/types/entities/account.type";

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
        <DrawerBody>{formContent}</DrawerBody>
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
