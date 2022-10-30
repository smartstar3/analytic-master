import { EventEmitter, Injectable } from '@angular/core';
import { QuestionService } from './question.service';
import { EndService } from './end.service';
import { Update } from './update/update';
import { isQuestionAdd, isQuestionDelete } from './update/question-update';
import { isEndAdd, isEndDelete, isEndEnabledChange } from './update/end-update';
import { StartService } from './start.service';
import { isStartEnabledChange } from './update/start-update';

@Injectable()
export class SelectionService {
  get type(): 'start' | 'question' | 'end' {
    return this._selection?.type;
  }
  get id(): string {
    return (this._selection as IdSelection)?.id;
  }
  get selected(): boolean {
    return !!this._selection;
  }

  private _selection: Selection;
  set selection(selection: Selection) {
    const prev = this._selection;
    this._selection = selection;
    this.change.emit(Object.assign({}, selection, { prev }));
  }

  change: EventEmitter<SelectionChange> = new EventEmitter<SelectionChange>();

  selectStart(): void {
    if (this.type === 'start') {
      this.deselect();
    } else {
      this.selection = { type: 'start' };
    }
  }

  selectEnd(id: string): void {
    if (this.type === 'end' && this.id === id) {
      this.deselect();
    } else {
      this.selection = { type: 'end', id };
    }
  }

  selectQ(id: string): void {
    if (this.type === 'question' && this.id === id) {
      this.deselect();
    } else {
      this.selection = { type: 'question', id };
    }
  }

  deselect(): void {
    this.selection = null;
  }

  constructor(private qs: QuestionService, private es: EndService, private ss: StartService) {
    qs.change.subscribe((u: Update) => {
      if (isQuestionDelete(u) && u.id === this.id) this.deselect();
      if (isQuestionAdd(u)) this.selectQ(u.id);
    });
    es.change.subscribe((u: Update) => {
      if (isEndDelete(u) && u.id === this.id) this.deselect();
      if (isEndAdd(u)) this.selectEnd(u.id);
      if (isEndEnabledChange(u)) {
        if (u.enabled && es.order.value.length === 0) {
          const eid = es.addNew();
          es.defaultEnd = eid;
          this.selectEnd(eid);
        } else if (!u.enabled && this.type === 'end') {
          this.deselect();
        }
      }
    });
    ss.change.subscribe((u: Update) => {
      if (isStartEnabledChange(u)) {
        if (u.enabled && !ss.start) {
          ss.newStart();
          this.selectStart();
        } else if (!u.enabled && this.type === 'start') {
          this.deselect();
        }
      }
    });
  }
}

export type SelectionChange = Selection & Change;
export type Selection = StartSelection | EndSelection | QuestionSelection;
interface Change {
  prev: Selection;
}

interface StartSelection {
  type: 'start';
}

export interface IdSelection {
  id: string;
}

interface EndSelection extends IdSelection {
  type: 'end';
  id: string;
}

interface QuestionSelection extends IdSelection {
  type: 'question';
  id: string;
}
