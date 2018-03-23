import { Pipe, PipeTransform } from "@angular/core";
import { BusinessType } from "../models/business-type.enum";

@Pipe({ name: 'businessType' })
export class BusinessTypePipe implements PipeTransform {

  transform(value: string): string {
    switch (value) {
      case BusinessType.BAR_PUB:
        return 'Bar/Pub';
      case BusinessType.COFFEE_SHOP:
        return 'Cafetería';
      case BusinessType.RESTAURANT:
        return 'Restaurante';
    }
  }

}
