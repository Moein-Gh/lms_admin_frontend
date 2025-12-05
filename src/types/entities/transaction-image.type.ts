import { File } from "./file-type";

export interface TransactionImage {
  readonly id: string;
  readonly transactionId: string;
  readonly fileId: string;
  readonly description?: string | null;
  readonly createdAt: Date;
  readonly file: File;
}
