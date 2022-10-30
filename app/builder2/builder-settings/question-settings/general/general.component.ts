import { Component } from '@angular/core';
import { QuestionService } from '../../../services/question.service';
import { SelectionService } from '../../../services/selection.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class GeneralComponent {
  constructor(public qs: QuestionService, public sel: SelectionService) {}
}
