import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { unique, Unique } from '../../question';
import { ConstructionSave, InitService } from './init.service';
import { take } from 'rxjs/operators';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { Update, UpdateType } from './update/update';
import { QuestionDelete } from './update/question-update';

/**
 * UniqueDataStore is an abstract class with the primary purpose of storing unique objects as well as their order.
 * Each object has a (globally) unique string Id which is stored in an ordered list.
 * This ordered list can be manipulated by adding, removing, or moving.
 * Lastly, there are change detectors for all the objects.
 */
@Injectable()
export abstract class UniqueDataStore<T> implements OnDestroy {
  protected constructor(is: InitService) {
    is.init.pipe(take(1)).subscribe((data: ConstructionSave) => {
      this._init(data);
    });
  }

  protected abstract is: InitService;

  init: ReplaySubject<void> = new ReplaySubject<void>(1);

  order: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  get: { [id: string]: Unique & T } = {};
  getChange: { [id: string]: EventEmitter<Update> } = {};

  change: EventEmitter<Update> = new EventEmitter<Update>();
  changeAll: EventEmitter<Update> = new EventEmitter<Update>();

  ngOnDestroy(): void {
    this.order.complete();
    for (const id in this.getChange) {
      if (!Object.prototype.hasOwnProperty.call(this.getChange, id)) continue;
      this.getChange[id].complete();
    }
    this.init.complete();
    this.change.complete();
    this.changeAll.complete();
  }

  private _add(id: string, pos?: number): void {
    if (typeof pos !== 'number')
      this.order.value.push(id);
    else
      this.order.value.splice(pos, 0, id);
    this.order.next([...this.order.value]);
  }

  add(data: T, pos?: number): string {
    const ud = unique(data);
    this.get[ud.id] = ud;
    this.getChange[ud.id] = new EventEmitter<Update>();
    this._add(ud.id, pos);
    return ud.id;
  }

  deleteAt(pos: number): string {
    const id = this.order.value[pos];
    delete this.get[id];
    this.getChange[id].complete();
    this._delete(pos);
    return id;
  }

  private _delete(pos: number): void {
    this.order.value.splice(pos, 1);
    this.order.next([...this.order.value]);
  }

  move(from: number, to: number): void {
    moveItemInArray(this.order.value, from, to);
    this.order.next(this.order.value);
  }
  update<U extends Update>(update: U, id?: string): void {
    if (!id) {
      this.change.emit(update);
    } else {
      this.getChange[id].next(update);
    }
    this.changeAll.emit(update);
  }
  protected abstract _init(data: ConstructionSave): void;

  protected __init(order: string[] = [], data: { [id: string]: Unique & T } = {}): void {
    this.order.next([...order]);
    this.initData(data);
    this.init.next();
    this.resetQuestionList();
  }

  private initData(data: { [id: string]: Unique & T }): void {
    for (const id in data) {
      if (!Object.prototype.hasOwnProperty.call(data, id)) continue;
      this.getChange[id] = new EventEmitter<Update>();
    }
    this.get = { ...data };
  }

  private resetQuestionList(): void {
    const order = this.order.value;
    const data = this.get;
    for (const id in data) {
      if (!Object.prototype.hasOwnProperty.call(data, id)) continue;
      if (order.includes(id)) continue;
      this._add(id);
    }
  }
}
