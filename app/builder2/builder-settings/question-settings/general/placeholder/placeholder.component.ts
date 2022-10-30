import { Component } from '@angular/core';
import { QuestionService } from '../../../../services/question.service';
import { PlaceholderChange } from '../../../../services/update/question-update';
import { UpdateType } from '../../../../services/update/update';
import { SelectionService } from '../../../../services/selection.service';

@Component({
  selector: 'app-build-placeholder',
  templateUrl: './placeholder.component.html',
  styleUrls: ['./placeholder.component.scss'],
})
export class PlaceholderComponent {
  constructor(public qs: QuestionService, public sel: SelectionService) {}

  change(placeholder: string): void {
    this.qs.get[this.sel.id].conf.placeholder = placeholder;
    this.qs.update<PlaceholderChange>({ placeholder, type: UpdateType.PlaceholderChange }, this.sel.id);
  }
}
