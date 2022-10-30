import { Component, OnInit } from '@angular/core';
import { QuestionComponent } from '../question/question.component';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-open-question',
  templateUrl: './open-question.component.html',
  styleUrls: ['./open-question.component.scss'],
})
export class OpenQuestionComponent extends QuestionComponent<string> implements OnInit {
  control: FormControl = new FormControl('', [Validators.required]);

  ngOnInit(): void {
    if (this.disabled) {
      this.control.setValidators([]);
    }
  }

  edited(text: string): void {
    this.changed.emit({ value: text, valid: this.control.valid });
  }
}
