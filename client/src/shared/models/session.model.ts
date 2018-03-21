import { Role } from "./role.enum";

export interface Session {
  userId: string;
  firstName: string;
  lastName: string,
  role: Role
  token: string;
  business?: string;
}
