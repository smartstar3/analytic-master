import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { QuestionComponent } from '../question/question.component';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
})
export class EmailComponent extends QuestionComponent<string> implements OnInit {
  control: FormControl = new FormControl('', [Validators.required, Validators.email]);

  ngOnInit(): void {
    if (this.disabled) {
      this.control.setValidators([]);
    }
  }

  edited(email: string): void {
    this.changed.emit({ value: email, valid: this.control.valid });
  }
}
