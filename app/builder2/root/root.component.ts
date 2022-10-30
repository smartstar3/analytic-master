import { Component, ViewChild } from '@angular/core';
import { Form } from 'src/app/question';
import { take } from 'rxjs/operators';
import { InitService } from '../services/init.service';
import { QuestionService } from '../services/question.service';
import { EndService } from '../services/end.service';
import { PosService } from '../services/pos.service';
import { StartService } from '../services/start.service';
import { NameService } from '../services/name.service';
import { DescriptionService } from '../services/description.service';
import { SaveService } from '../services/save.service';
import { IdService } from '../services/id.service';
import { SelectionService } from '../services/selection.service';
import { QuestionService as QS } from '../../form/services/question.service';
import { StartService as SS } from '../../form/services/start.service';
import { EndService as ES } from '../../form/services/end.service';
import { ErrorService } from '../services/error-system/error.service';
import { MessengerService } from '../../messenger/messenger.service';
import { MatTabGroup } from '@angular/material/tabs';
import { LogicValidationService } from '../services/logic-validation.service';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  providers: [
    LogicValidationService,
    IdService,
    InitService,
    QuestionService,
    EndService,
    PosService,
    StartService,
    NameService,
    DescriptionService,
    SaveService,
    SelectionService,
    ErrorService,
    QS,
    SS,
    ES,
  ],
})
export class RootComponent {
  id: string;
  testForm: Form;
  loaded = false;
  formTitleEditMode = false;

  @ViewChild('tabGroup') tabGroup: MatTabGroup;
  tab = 0;

  constructor(
    public save: SaveService,
    public is: InitService,
    public sel: SelectionService,
    public ns: NameService,
    private err: ErrorService,
    private msg: MessengerService
  ) {
    is.init.pipe(take(1)).subscribe(() => (this.loaded = true));
  }

  select(tab: number): void {
    switch (tab) {
      case 1:
        if (!this.err.valid()) {
          this.msg.error('Cannot test invalid form.', 1000);
          this.tabGroup.selectedIndex = this.tab;
          this.err.showErrors();
          return;
        }
        this.testForm = this.save.publish();
        this.tab = tab;
        return;
      default:
        this.tab = tab;
    }
  }

  enableTitleEditMode(): void {
    this.formTitleEditMode = true;
  }

  updateFormTitle(): void {
    this.formTitleEditMode = false;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.ns.name) {
      event.preventDefault();
      this.formTitleEditMode = false;
    }
  }
}
