import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { InitService } from '../form/services/init.service';
import { Form } from '../question';

@Injectable()
export class NameService {
  private _name: string;
  get name(): string {
    return this._name;
  }

  constructor(private is: InitService) {
    is.init.pipe(take(1)).subscribe((data: Form) => {
      this._name = data.name;
    });
  }
}
