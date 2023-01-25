import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'filterUnique',
  pure: false
})
export class UniqueFilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {

    const uniqueArray = _.uniqBy(value, 'service');

    return uniqueArray;
  }
}