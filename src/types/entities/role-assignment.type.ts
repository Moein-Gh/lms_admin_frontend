import { Role } from "./role.type";
import { User } from "./user.type";

export interface RoleAssignment {
  id: string;
  userId: string;
  roleId: string;
  assignedBy?: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  status: RoleAssignmentStatus;
  user?: User;
  role?: Role;

  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: string;
}

export interface CreateRoleAssignmentInput {
  roleId: string;
  userId: string;
  expiresAt?: Date;
}

export enum RoleAssignmentStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE"
}
