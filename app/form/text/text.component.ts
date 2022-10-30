import { Component } from '@angular/core';
import { QuestionComponent } from '../question/question.component';
@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent extends QuestionComponent<boolean> {}
