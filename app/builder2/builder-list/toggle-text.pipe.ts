import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toggleText',
})
export class ToggleTextPipe implements PipeTransform {
  transform(enabled: boolean): string {
    return enabled ? 'disable' : 'enable';
  }
}
