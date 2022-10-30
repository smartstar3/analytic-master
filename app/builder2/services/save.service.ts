import { Injectable, OnDestroy } from '@angular/core';
import { ConstructionSave } from './init.service';
import { ApiService } from '../../api/api.service';
import { MessengerService } from '../../messenger/messenger.service';
import { EndService } from './end.service';
import { StartService } from './start.service';
import { QuestionService } from './question.service';
import { take } from 'rxjs/operators';
import {
  BuilderDescription,
  BuilderDescriptionPart,
  ConstructionForm,
  Description,
  EndScreen,
  Form,
  formFromJSON,
  Q,
  UniqueEndScreen,
  UniqueQ,
} from '../../question';
import { PosService } from './pos.service';
import { conditionLeafTraverser, If } from '../../logic/jump';
import { Check } from '../../logic/logic';
import Timeout = NodeJS.Timeout;
import { Subscription } from 'rxjs';
import { NameService } from './name.service';
import { IdService } from './id.service';
import { ErrorService } from './error-system/error.service';

@Injectable()
export class SaveService implements OnDestroy {
  id: string;
  public status: 'saving' | 'saved' | 'waiting' | 'error' = 'saved';
  disabled = false;
  private timer: Timeout;

  private qsSub: Subscription;
  private esSub: Subscription;
  private ssSub: Subscription;
  private errSub: Subscription;
  private nsSub: Subscription;

  constructor(
    private api: ApiService,
    private msgr: MessengerService,
    private qs: QuestionService,
    private es: EndService,
    private ss: StartService,
    private pos: PosService,
    private ids: IdService,
    private ns: NameService,
    private err: ErrorService
  ) {
    ids.id.pipe(take(1)).subscribe((id: string) => (this.id = id));

    this.qsSub = qs.changeAll.subscribe(() => this.autosave());
    this.esSub = es.changeAll.subscribe(() => this.autosave());
    this.ssSub = ss.change.subscribe(() => this.autosave());
    this.errSub = err.tree.flatChange.subscribe(() => this.autosave());
    this.nsSub = ns.change.subscribe(() => this.autosave());
  }

  ngOnDestroy(): void {
    this.qsSub?.unsubscribe();
    this.esSub?.unsubscribe();
    this.ssSub?.unsubscribe();
    this.errSub?.unsubscribe();
    this.nsSub?.unsubscribe();
  }

  save(force: boolean = false): void {
    if (force) {
      if (this.timer) clearTimeout(this.timer); // cancel in progress autosave
      this._save(this.gather());
    } else {
      this.autosave();
    }
  }

  autosave(): void {
    if (this.disabled) return;
    if (this.timer) clearTimeout(this.timer); // replace old timer if exists
    this.status = 'waiting';
    this.timer = setTimeout(() => {
      this._save(this.gather());
      this.timer = null; // clear out old timer reference when done
    }, 1000);
  }

  private _save(data: ConstructionSave): void {
    this.status = 'saving';
    this.api
      .saveForm(this.id, data)
      .pipe(take(1))
      .subscribe(
        () => (this.status = 'saved'),
        (err) => {
          this.msgr.httpErrorHandler(err, 'Failed to save changes');
          this.status = 'error';
        }
      );
  }

  private gather(): ConstructionSave {
    const data: ConstructionData = {
      endEnabled: this.es.endEnabled,
      startEnabled: this.ss.startEnabled,
      form: {
        name: this.ns.name,
        start: this.ss.start,
        questionList: this.qs.order.value,
        questions: this.qs.get,
        endList: this.es.order.value,
        defaultEnd: this.es.defaultEnd,
        ends: this.es.get,
        design: DEFAULT_DESIGN,
      },
    };

    return { ...data, publish: this.publish(), errorData: this.err.gather() };
  }

  publish(): Form {
    return formFromJSON({
      defaultEnd: this.pos.get[this.es.defaultEnd],
      design: DEFAULT_DESIGN,
      ends: this.es.endEnabled ? this.publishEnds() : undefined,
      name: this.ns.name,
      questions: this.publishQuestions(),
      start: this.ss.startEnabled ? this.ss.start : undefined,
    });
  }

  private publishEnds(): EndScreen[] {
    return this.es.order.value.map((eid: string) => {
      const ue: UniqueEndScreen = JSON.parse(JSON.stringify(this.es.get[eid])) as UniqueEndScreen;
      if (!ue.linkEnabled) delete ue.link;
      delete ue.id;
      return ue as EndScreen;
    });
  }

  private publishQuestions(): Q[] {
    const qs: Q[] = this.qs.order.value.map((qid: string) => {
      const uq: UniqueQ = JSON.parse(JSON.stringify(this.qs.get[qid])) as UniqueQ;
      delete uq.id;
      return uq as Q;
    });

    qs.forEach((q: Q) => {
      q.conf.description = this.publishDescription(q.conf.description as BuilderDescription);
      q.conf.jumps.forEach((jump: If) => this.publishJump(jump));
    });
    return qs;
  }

  private publishDescription(description: BuilderDescription): Description {
    return description.map((part: BuilderDescriptionPart) => {
      if (typeof part === 'string') return part;
      return this.pos.get[part.qid];
    });
  }

  private publishJump(jump: If): void {
    if (!jump.condition) return;
    conditionLeafTraverser(jump.condition, (check: Check) => {
      if (check.check) check.check.q = this.pos.get[check.check.q];
    });
    jump.then = this.pos.get[jump.then];
  }
}

interface ConstructionData {
  form: ConstructionForm;
  startEnabled?: boolean;
  endEnabled?: boolean;
}

export const DEFAULT_DESIGN = {
  name: 'default',
  font: 'Arial',
  question: '#222222',
  answer: '#222222',
  button: '#FFFFFF',
  card: '#FFFFFF',
  background: '#fafafa',
};
