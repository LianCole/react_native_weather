import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { To100Pipe } from './to100/to100.pipe';
import { ToCelsiusPipe } from './to-celsius/to-celsius.pipe';

@NgModule({
  declarations: [To100Pipe, ToCelsiusPipe],
  imports: [
    CommonModule
  ],
  exports: [To100Pipe, ToCelsiusPipe]

})
export class PipesModule { }
