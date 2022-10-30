import { Component, Input } from '@angular/core';
import { QuestionType } from '../../question';

@Component({
  selector: 'app-question-icon',
  templateUrl: './question-icon.component.html',
  styleUrls: ['./question-icon.component.scss'],
})
export class QuestionIconComponent {
  @Input() type: QuestionType;
  types = QuestionType;
}
