import * as React from "react";
import { useCreateLoanRequest } from "@/hooks/use-loan-request";
import { useIsMobile } from "@/hooks/use-mobile";
import { CreateLoanRequestDialogDesktop } from "./create-loan-request-dialog-desktop";
import { CreateLoanRequestDialogMobile } from "./create-loan-request-dialog-mobile";
import { CreateLoanRequestForm } from "./create-loan-request-form";

export function CreateLoanRequestDialog() {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  const create = useCreateLoanRequest();

  const formContent = <CreateLoanRequestForm isMobile={isMobile} create={create} setOpen={setOpen} />;

  if (isMobile) {
    return <CreateLoanRequestDialogMobile open={open} setOpen={setOpen} formContent={formContent} />;
  }
  return <CreateLoanRequestDialogDesktop open={open} setOpen={setOpen} formContent={formContent} />;
}
