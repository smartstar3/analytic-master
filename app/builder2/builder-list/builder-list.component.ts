import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { QuestionService } from '../services/question.service';
import { EndService } from '../services/end.service';
import { StartService } from '../services/start.service';
import { SelectionService, Selection, IdSelection, SelectionChange } from '../services/selection.service';
import { MatSelectionList } from '@angular/material/list';
import { DescriptionService } from '../services/description.service';
import { ErrorService } from '../services/error-system/error.service';
import { QuestionType } from '../../question';
import { getDefaults } from '../builder-settings/question-settings/general/type/type.component';
import { Q } from '../../question';
import { Subscription } from 'rxjs';
import { PosService } from '../services/pos.service';
import { UtilsService } from '../../utils/utils.service';

@Component({
  selector: 'app-builder-list',
  templateUrl: './builder-list.component.html',
  styleUrls: ['./builder-list.component.scss'],
})
export class BuilderListComponent implements OnInit, OnDestroy {
  @ViewChild('list') list: MatSelectionList;
  startExpand = true;
  questionExpand = true;
  endExpand = true;
  types: QuestionType[] = [
    QuestionType.OpenQ,
    QuestionType.YesNoQ,
    QuestionType.MultipleChoiceQ,
    QuestionType.StarRatingQ,
    QuestionType.NumberQ,
    QuestionType.SliderChoiceQ,
    QuestionType.EmailQ,
    QuestionType.PhoneNumberQ,
    QuestionType.TextQ,
    QuestionType.AddressQ,
  ];

  selection: Selection[] = [];

  private sub: Subscription;

  constructor(
    public qs: QuestionService,
    public es: EndService,
    public ss: StartService,
    public sel: SelectionService,
    public description: DescriptionService,
    public err: ErrorService,
    public pos: PosService,
    private utils: UtilsService
  ) {
    this.sub = sel.change.subscribe(async (change: SelectionChange) => {
      if (change.type === 'start') {
        await this.moveIntoView(`mat-list-option[id='start-screen']`);
      }
      else if (change.type === 'question' && 'id' in change && change.id) {
        await this.moveIntoView(`mat-list-option[id='${change.id}']`);
      }
      else if (change.type === 'end' && 'id' in change && change.id) {
        await this.moveIntoView(`mat-list-option[id='${change.id}']`);
      }
    });
  }

  ngOnInit(): void {
    this.selection = [this.sel.selection];
    this.sel.change.subscribe((selection: Selection) => (this.selection = [selection]));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  compare = (o1: Selection, o2: Selection): boolean => {
    return o1?.type === o2?.type && (o1 as IdSelection)?.id === (o2 as IdSelection)?.id;
  };

  addNewQuestion(type: QuestionType): void {
    const settings = getDefaults(type);
    this.qs.add(new Q(settings));
  }

  duplicateQuestion(qid: string): void {
    const settings = this.qs.get[qid].conf;
    const pos = this.pos.get[qid];
    this.qs.add(new Q(this.utils.cloneObject(settings)), pos + 1);
  }

  duplicateEnd(eid: string): void {
    const settings = this.es.get[eid];
    const pos = -(this.pos.get[eid] + 1);
    this.es.add(this.utils.cloneObject(settings), pos + 1);
  }

  setDefaultEnd(eid: string): void {
    this.es.defaultEnd = eid;
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
      item.scrollIntoView({ block: 'center' });
    }
  }
}
