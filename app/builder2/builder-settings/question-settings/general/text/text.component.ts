import { Component } from '@angular/core';
import { QuestionService } from '../../../../services/question.service';
import { TextChange } from '../../../../services/update/question-update';
import { UpdateType } from '../../../../services/update/update';
import { SelectionService } from '../../../../services/selection.service';

@Component({
  selector: 'app-build-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent {
  constructor(public qs: QuestionService, public sel: SelectionService) {}

  change(text: string): void {
    this.qs.get[this.sel.id].conf.text = text;
    this.qs.update<TextChange>({ text, type: UpdateType.TextChange }, this.sel.id);
  }
}
