import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortedLevels'
})

export class SortedLevels implements PipeTransform {
  transform(items: any[], filter: Object): any {
    if (items && Array.isArray(items) && items.length > 0) {
      var sortedObjs = items.sort(this.dynamicSort("level"));
      return sortedObjs;
    }
  }

  dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }
}