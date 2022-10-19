import { Pipe, PipeTransform } from '@angular/core';
import { statesMock } from 'packages/lomi-backoffice/providers/lomi/mocks/states.mock';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if(value == 0){
      return "Por retirar"
    }

    if(typeof value == 'number'){
      return statesMock[value];
    } else if (typeof value == 'string'){
      return statesMock[parseInt(value)];
    }
    return value;
  }

}
