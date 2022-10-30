import { Component } from '@angular/core';
import { QuestionService } from '../../../../services/question.service';
import { RatingTypeChange } from '../../../../services/update/question-update';
import { UpdateType } from '../../../../services/update/update';
import { SelectionService } from '../../../../services/selection.service';

@Component({
  selector: 'app-build-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
})
export class RatingComponent {
  constructor(public qs: QuestionService, public sel: SelectionService) {}

  change(ratingType: string): void {
    if (ratingType !== undefined) {
      this.qs.get[this.sel.id].conf.rating = ratingType;
      this.qs.update<RatingTypeChange>({ ratingType, type: UpdateType.RatingTypeChange }, this.sel.id);
    }
  }
}
