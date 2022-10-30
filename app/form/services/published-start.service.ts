import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { Form, StartScreen } from '../../question';
import { InitService } from './init.service';

@Injectable()
export class PublishedStartService {
  private _start: StartScreen;
  get start(): StartScreen {
    return this._start;
  }

  constructor(private is: InitService) {
    is.init.pipe(take(1)).subscribe((form: Form) => {
      this._start = form.start;
    });
  }
}
