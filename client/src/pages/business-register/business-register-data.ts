import { BusinessType } from "../../shared/models/business-type.enum";

export interface BusinessRegisterData {
  name: string;
  description: string;
  phone: string;
  type: BusinessType;
  location: {
    address: string,
    coordinates: [number, number]
  };
  homeDeliveries: boolean;
  cover: string;
}
