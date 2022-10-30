import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum SelectionUpdateType {
  init,
  next,
  previous,
}

export interface SelectionUpdate {
  selectedQuestion: number;
  selectionUpdateType: SelectionUpdateType;
}

@Injectable({
  providedIn: 'root',
})
export class SelectionService {
  selectedQuestionBehaviorSubject: BehaviorSubject<SelectionUpdate>;

  constructor() {
    this.selectedQuestionBehaviorSubject = new BehaviorSubject<SelectionUpdate>({
      selectedQuestion: 0,
      selectionUpdateType: SelectionUpdateType.init,
    });
  }

  selectNextQuestion(): void {
    this.selectedQuestionBehaviorSubject.next({
      selectedQuestion: this.selectedQuestion + 1,
      selectionUpdateType: SelectionUpdateType.next,
    });
  }

  selectPreviousQuestion(): void {
    if (this.selectedQuestion > 0) {
      this.selectedQuestionBehaviorSubject.next({
        selectedQuestion: this.selectedQuestion - 1,
        selectionUpdateType: SelectionUpdateType.previous,
      });
    }
  }

  get selectedQuestion(): number {
    return this.selectedQuestionBehaviorSubject.value.selectedQuestion;
  }

  get updateType(): number {
    return this.selectedQuestionBehaviorSubject.value.selectionUpdateType;
  }
}
