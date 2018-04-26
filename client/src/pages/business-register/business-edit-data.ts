import { BusinessType } from "../../shared/models/business-type.enum";

export interface BusinessEditData {
  name: string;
  description: string;
  phone: string;
  type: BusinessType;
  location: [number, number];
  homeDeliveries: boolean;
  cover?: string;
}
