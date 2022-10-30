import { Component, OnDestroy } from '@angular/core';
import { StartService } from '../services/start.service';
import { QuestionService } from '../services/question.service';
import { EndService } from '../services/end.service';
import { DescriptionService } from '../services/description.service';
import { SelectionService } from '../services/selection.service';
import { SelectionChange } from '../services/selection.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form-preview',
  styleUrls: ['./form-preview.component.scss'],
  templateUrl: './form-preview.component.html',
})
export class FormPreviewComponent implements OnDestroy {
  private sub: Subscription;

  constructor(
    public ss: StartService,
    public qs: QuestionService,
    public es: EndService,
    public description: DescriptionService,
    public sel: SelectionService
  ) {
    this.sub = sel.change.subscribe(async (change: SelectionChange) => {
      if (change.type === 'start') {
        await this.moveIntoView('mat-card.start-screen-card');
      }
      else if (change.type === 'question' && 'id' in change && change.id) {
        await this.moveIntoView(`mat-card[id='${change.id}']`);
      }
      else if (change.type === 'end' && 'id' in change && change.id) {
        await this.moveIntoView(`app-end-screen[id='${change.id}']`);
      }
    });
  }

  async moveIntoView(query: string): Promise<void> {
    let item = document.querySelector(query);
    let ttl = 5;
    while (!item && ttl) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      item = document.querySelector(query);
      ttl --;
    }
    if (item) {
      item.scrollIntoView({ behavior: "smooth", block: 'center' });
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
