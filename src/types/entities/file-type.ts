export interface File {
  readonly id: string;
  readonly code: number;
  readonly url: string;
  readonly mimeType: string;
  readonly size: number;
  readonly createdAt: Date;
}
