import { Component, ViewEncapsulation } from '@angular/core';
import { BuilderDescription } from 'src/app/question';
import { QuestionService } from '../../../../services/question.service';
import { DescriptionChange } from '../../../../services/update/question-update';
import { UpdateType } from '../../../../services/update/update';
import { DescriptionService } from '../../../../services/description.service';
import { SelectionService } from '../../../../services/selection.service';

@Component({
  selector: 'app-build-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DescriptionComponent {
  constructor(public qs: QuestionService, public sel: SelectionService, public descriptions: DescriptionService) {}

  change(description: BuilderDescription): void {
    this.qs.get[this.sel.id].conf.description = description;
    this.update(description);
  }

  addChip(qid: string): void {
    const description = this.qs.get[this.sel.id].conf.description as BuilderDescription;
    description.push({ qid }, '');
    this.update(description);
  }

  update(description: BuilderDescription): void {
    this.qs.update<DescriptionChange>({ description, type: UpdateType.DescriptionChange }, this.sel.id);
  }
}
