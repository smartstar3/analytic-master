import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { ConstructionSave, InitService } from './init.service';
import { take } from 'rxjs/operators';
import { Update, UpdateType } from './update/update';
import { NameChange } from './update/name-update';

@Injectable()
export class NameService implements OnDestroy {
  private _name: string;
  get name(): string {
    return this._name;
  }
  set name(name: string) {
    if (!name) return;
    this._name = name;
    const u: NameChange = { type: UpdateType.NameChange, name };
    this.change.emit(u);
  }

  change: EventEmitter<Update> = new EventEmitter<Update>();
  ngOnDestroy(): void {
    this.change.complete();
  }

  constructor(private is: InitService) {
    is.init.pipe(take(1)).subscribe((data: ConstructionSave) => {
      this._name = data.form.name;
    });
  }
}
