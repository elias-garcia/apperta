import { Role } from "./role.enum";
import { Business } from "./business.model";

export interface Session {
  userId: string;
  firstName: string;
  lastName: string,
  role: Role
  token: string;
  business?: Business
}
