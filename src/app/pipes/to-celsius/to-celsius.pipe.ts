import { Pipe, PipeTransform } from '@angular/core';

@Pipe({

  name: 'toCelsius'
})
export class ToCelsiusPipe implements PipeTransform {

  transform(fahrenheit: number, ...args: any): number {
    return Number(((fahrenheit - 32) * 5 / 9).toFixed(2));
  }

}
