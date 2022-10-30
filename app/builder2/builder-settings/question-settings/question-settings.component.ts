import { Component } from '@angular/core';
import { SelectionService } from '../../services/selection.service';
import { QuestionService } from '../../services/question.service';
import { PosService } from '../../services/pos.service';

@Component({
  selector: 'app-question-settings',
  templateUrl: './question-settings.component.html',
  styleUrls: ['./question-settings.component.scss'],
})
export class QuestionSettingsComponent {
  constructor(public sel: SelectionService, public qs: QuestionService, public pos: PosService) {}
}
