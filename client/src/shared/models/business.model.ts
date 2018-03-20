import { BusinessType } from "./business-type.enum";

interface Image {
  id: string;
  format: string;
  url: string;
  publicId: string;
}

export interface Business {
  id: string;
  owner: string;
  name: string;
  phone: number;
  type: BusinessType;
  location: {
    type: string,
    coordinates: [number, number]
  };
  isPromoted: boolean;
  cover: Image;
  images: Image[]
}