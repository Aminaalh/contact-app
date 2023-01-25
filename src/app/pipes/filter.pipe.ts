import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false // pipe is recalculated every time data changes on the page
})
export class FilterPipe implements PipeTransform {

  transform(value: string[], filterString: string, propName: string): any {
    if ( filterString === '' || filterString === undefined || filterString === 'All') {
      return value;
    }

    const resultArray = [];
    for (const item of value) {
      if (item[propName] === filterString) {
        resultArray.push(item)
      }
    }

    return resultArray;

  }


}