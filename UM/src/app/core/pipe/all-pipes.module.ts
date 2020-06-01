import { NgModule } from '@angular/core';
import { SortedLevels } from './sorted-levels.pipe';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  declarations: [SortedLevels],
  exports: [SortedLevels]
})
export class AllPipesModule { }