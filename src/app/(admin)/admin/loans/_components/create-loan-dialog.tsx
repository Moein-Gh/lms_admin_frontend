import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useCreateLoan } from "@/hooks/admin/use-loan";
import { useIsMobile } from "@/hooks/general/use-mobile";
import { listAccounts } from "@/lib/admin-APIs/account-api";
import { listLoanTypes } from "@/lib/admin-APIs/loan-type-api";
import { CreateLoanDialogDesktop } from "./create-loan-dialog-desktop";
import { CreateLoanDialogMobile } from "./create-loan-dialog-mobile";
import { CreateLoanForm } from "./create-loan-form";

export function CreateLoanDialog() {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  const { data: types } = useQuery({
    queryKey: ["loan-types", "list"],
    queryFn: () => listLoanTypes({ pageSize: 100 })
  });

  const { data: accounts } = useQuery({
    queryKey: ["accounts", "list"],
    queryFn: () => listAccounts({ pageSize: 100 })
  });

  const create = useCreateLoan();

  const typesOptions = types?.data ?? [];
  const accountsOptions = (accounts?.data ?? []).map((a) => ({ id: a.id, name: a.name }));

  const formContent = (
    <CreateLoanForm
      types={typesOptions}
      accounts={accountsOptions}
      isMobile={isMobile}
      create={create}
      setOpen={setOpen}
    />
  );

  if (isMobile) {
    return <CreateLoanDialogMobile open={open} setOpen={setOpen} formContent={formContent} />;
  }
  return <CreateLoanDialogDesktop open={open} setOpen={setOpen} formContent={formContent} />;
}
