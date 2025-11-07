import { Identity } from "./identity.type";

export interface User {
  id: string;
  code: number;
  isActive: boolean;
  identityId: string;
  identity: Partial<Identity>;
}
