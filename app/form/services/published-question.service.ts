import { Form, Q } from '../../question';
import { InitService } from './init.service';
import { take } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class PublishedQuestionService {
  get: Q[] = [];

  constructor(private is: InitService) {
    is.init.pipe(take(1)).subscribe((form: Form) => {
      this.get = form.questions;
    });
  }
}
