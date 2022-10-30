import { Injectable } from '@angular/core';
import { Q } from '../../question';
import { ConstructionSave, InitService } from './init.service';
import { UniqueDataStore } from './unique-data-store';
import { QuestionAdd, QuestionDelete, QuestionMove } from './update/question-update';
import { UpdateType } from './update/update';
import { DEFAULT_OPEN } from '../../question/q-defaults';

@Injectable()
export class QuestionService extends UniqueDataStore<Q> {
  protected _init(data: ConstructionSave): void {
    this.__init(data.form.questionList, data.form.questions);
  }
  constructor(protected is: InitService) {
    super(is);
  }

  add(data: Q, pos = null): string {
    const id = super.add(data, pos);
    this.update<QuestionAdd>({ type: UpdateType.QuestionAdd, id });
    return id;
  }

  addNew(): string {
    return this.add(newDefault());
  }

  deleteAt(pos: number): string {
    const id = super.deleteAt(pos);
    this.update<QuestionDelete>({ type: UpdateType.QuestionDelete, pos, id });
    return id;
  }

  move(from: number, to: number): void {
    super.move(from, to);
    this.update<QuestionMove>({ type: UpdateType.QuestionMove, from, to });
  }
}

function newDefault(): Q {
  return new Q(DEFAULT_OPEN());
}
