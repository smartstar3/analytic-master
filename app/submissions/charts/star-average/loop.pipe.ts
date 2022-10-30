import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'loop',
})
export class LoopPipe implements PipeTransform {
  transform<T>(i: number): T[] {
    return new Array<T>(i);
  }
}
