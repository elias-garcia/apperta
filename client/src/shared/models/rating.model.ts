import { User } from "./user.model";

export interface Rating {
  id: string;
  score: number;
  title: string;
  comment: string;
  user: User;
  business: string;
  createdAt: string;
  updatedAt: string;
}
