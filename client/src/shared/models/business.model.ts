import { BusinessType } from "./business-type.enum";

interface Image {
  id: string;
  format: string;
  url: string;
  publicId: string;
}

export interface Business {
  id: string;
  owner: any;
  name: string;
  description: string;
  phone: number;
  type: BusinessType;
  location: {
    type: string,
    address: string,
    coordinates: [number, number]
  };
  homeDeliveries: boolean;
  isPromoted: boolean;
  avgRating?: number;
  cover: Image;
  images: Image[]
}
