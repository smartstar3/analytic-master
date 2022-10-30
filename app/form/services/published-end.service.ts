import { EndScreen, Form } from '../../question';
import { InitService } from './init.service';
import { take } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class PublishedEndService {
  get: { [i: number]: EndScreen } = [];
  defaultEnd: number;
  constructor(private is: InitService) {
    is.init.pipe(take(1)).subscribe((form: Form) => {
      if (!form.ends) return;
      this.get = form.ends;
      this.defaultEnd = form.defaultEnd;
    });
  }
}
