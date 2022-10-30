import { Component } from '@angular/core';
import { QuestionComponent } from '../question/question.component';

@Component({
  selector: 'app-yes-no',
  templateUrl: './yes-no.component.html',
  styleUrls: ['./yes-no.component.scss'],
})
export class YesNoComponent extends QuestionComponent<boolean> {
  choice: boolean = undefined;

  select(choice: boolean): void {
    if (this.disabled) {
      return;
    }
    if (this.answer === choice) {
      this.answer = undefined;
    } else {
      this.answer = choice;
    }
    this.changed.emit({ value: this.answer, valid: typeof this.answer === 'boolean' });
    if (this.answer !== undefined) {
      this.answered.emit();
    }
  }
}
