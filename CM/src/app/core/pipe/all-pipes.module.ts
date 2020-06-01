import { NgModule } from '@angular/core';
import { SortedLevels } from './sorted-levels.pipe';
import { ConvertToDate } from './date-filter.pipe';
import { CommonModule } from '@angular/common';
import { ConvertToTime } from './time-filter.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [SortedLevels, ConvertToDate, ConvertToTime],
  exports: [SortedLevels, ConvertToDate, ConvertToTime]
})
export class AllPipesModule { }