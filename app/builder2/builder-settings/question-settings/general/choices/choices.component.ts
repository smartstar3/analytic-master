import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ENTER } from '@angular/cdk/keycodes';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatChipList } from '@angular/material/chips';
import { QuestionService } from '../../../../services/question.service';
import { ChoiceAdd, ChoiceDelete } from '../../../../services/update/question-update';
import { UpdateType } from '../../../../services/update/update';
import { IdSelection, SelectionChange, SelectionService } from '../../../../services/selection.service';
import { ErrorService } from '../../../../services/error-system/error.service';
import { Subscription } from 'rxjs';
import { Node, ErrorState } from '../../../../services/error-system/tree-map';

@Component({
  selector: 'app-build-choices',
  templateUrl: './choices.component.html',
  styleUrls: ['./choices.component.scss'],
})
export class ChoicesComponent implements OnInit, AfterViewInit, OnDestroy {
  private sub: Subscription;
  choiceInput: string;
  editingChoice: number;
  @ViewChild('choiceList') choiceList: MatChipList;

  get error(): Node<ErrorState> {
    return this.err.get(`questions.${this.sel.id}.choices`);
  }

  readonly separators: number[] = [ENTER];

  constructor(public qs: QuestionService, public sel: SelectionService, public err: ErrorService) {
    this.sub = sel.change.subscribe((change: SelectionChange) => {
      if (change?.prev) {
        err.get(`questions.${(change.prev as IdSelection).id}.choices`).show = true;
        this.validate((change.prev as IdSelection).id);
      }
      this.updateErrorDisplay();
    });
  }

  remove(i: number): void {
    this.qs.get[this.sel.id].conf.choices.splice(i, 1);
    this.qs.update<ChoiceDelete>({ pos: i, type: UpdateType.ChoiceDelete }, this.sel.id);
    this.validate();
  }

  addChoice(): void {
    const choice: string = this.choiceInput;
    if (choice) {
      this.qs.get[this.sel.id].conf.choices.push(choice);
      this.qs.update<ChoiceAdd>({ choice, type: UpdateType.ChoiceAdd }, this.sel.id);
      this.validate();
    }

    this.showError();
    this.choiceInput = '';
  }

  onInputKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.choiceInput) {
      event.preventDefault();
      this.addChoice();
    }
  }

  drop(event: CdkDragDrop<number, unknown>): void {
    if (event.item.data !== event.container.data) {
      moveItemInArray(this.qs.get[this.sel.id].conf.choices, event.item.data, event.container.data);
      this.validate();
    }
  }

  selectChoice(index: number): void {
    this.editingChoice = index;
  }

  choiceContentChange(value: string, i: number): void {
    if (value) {
      this.qs.get[this.sel.id].conf.choices[i] = value;
      this.validate();
    }
    this.editingChoice = null;
  }

  validate(id: string = this.sel.id): void {
    if (!this.qs.get[id]) return;
    const choices = this.qs.get[id].conf.choices;
    const path = `questions.${id}.choices`;
    if (choices.length < 1) {
      this.err.set(path, { error: 'must have at least 1 choice' });
    } else if (choices.length === 1) {
      this.err.set(path, { warning: 'should have at least 2 choices' });
    } else {
      this.err.set(path, null);
    }
    this.updateErrorDisplay();
  }

  showError(): void {
    this.error.show = true;
    this.updateErrorDisplay();
  }

  updateErrorDisplay(): void {
    if (!this.choiceList) return;
    this.choiceList.errorState = this.error.show && this.error.value?.error !== undefined;
  }

  ngOnInit(): void {
    this.validate();
  }

  ngAfterViewInit(): void {
    this.updateErrorDisplay();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
