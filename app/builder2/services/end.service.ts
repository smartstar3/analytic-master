import { Injectable } from '@angular/core';
import { EndScreen } from '../../question';
import { ConstructionSave, InitService } from './init.service';
import { UniqueDataStore } from './unique-data-store';
import { DefaultEndChange, EndAdd, EndDelete, EndEnabledChange, EndMove } from './update/end-update';
import { UpdateType } from './update/update';

@Injectable()
export class EndService extends UniqueDataStore<EndScreen> {
  get endEnabled(): boolean {
    return this._endEnabled;
  }
  set endEnabled(enabled: boolean) {
    this._endEnabled = enabled;
    this.update<EndEnabledChange>({ type: UpdateType.EndEnabledChange, enabled });
  }
  get defaultEnd(): string {
    return this._defaultEnd;
  }
  set defaultEnd(value: string) {
    this._defaultEnd = value;
    this.update<DefaultEndChange>({ type: UpdateType.DefaultEndChange, default: value });
  }

  constructor(protected is: InitService) {
    super(is);
  }

  private _endEnabled: boolean;

  private _defaultEnd: string;

  add(data: EndScreen, pos = null): string {
    const id = super.add(data, pos);
    this.update<EndAdd>({ type: UpdateType.EndAdd, id });
    if (this.order.value.length === 1) {
      this.defaultEnd = this.order.value[0];
    }
    return id;
  }

  addNew(): string {
    return this.add({ ...DEFAULT_END });
  }

  deleteAt(pos: number): string {
    const id = super.deleteAt(pos);
    this.update<EndDelete>({ type: UpdateType.EndDelete, pos, id });
    if (this.order.value.length && this.defaultEnd === id) {
      this.defaultEnd = this.order.value[0];
    }
    return id;
  }

  move(from: number, to: number): void {
    super.move(from, to);
    this.update<EndMove>({ type: UpdateType.EndMove, from, to });
  }

  protected _init(data: ConstructionSave): void {
    this._endEnabled = data.endEnabled;
    this._defaultEnd = data.form.defaultEnd;
    data.form.endList ? this.__init(data.form.endList, data.form.ends) : this.__init();
  }
}

export const DEFAULT_END: EndScreen = {
  title: 'Title',
  body: 'Body',
  linkEnabled: false,
  link: { button: '', url: '' },
  imageEnabled: false,
  image: { hash: '', name: '' },
  mailEnabled: false,
  mail: { sendTo: [], subject: '', message: '', linkUrl: '' },
};
