import { Installment } from "@/types/entities/installment.type";

export function InstallmentCard({ installment }: { installment: Installment }) {
  return <div>{installment.code}</div>;
}
