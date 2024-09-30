import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'to100'
})
export class To100Pipe implements PipeTransform {

  transform(value: number): number {
    return Number((value * 100).toFixed(2));
  }

}
