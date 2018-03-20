import { BusinessType } from "../../shared/models/business-type.enum";

export interface BusinessRegisterData {
  name: string;
  phone: string;
  type: BusinessType;
  location: [number, number];
  cover: string;
}
