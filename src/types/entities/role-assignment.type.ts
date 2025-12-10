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
  isActive: boolean;
  user?: User;
  role?: Role;
}

export interface CreateRoleAssignmentInput {
  roleId: string;
  userId: string;
  expiresAt?: Date;
}
