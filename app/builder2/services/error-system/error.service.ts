import { Injectable, OnDestroy } from '@angular/core';
import { take } from 'rxjs/operators';
import { ConstructionForm } from '../../../question';
import { Subscription } from 'rxjs';
import { Node, ErrorState } from './tree-map';
import { ConstructionSave, ErrorData, ErrorTree, InitService } from '../init.service';
import { QuestionService } from '../question.service';
import { EndService } from '../end.service';
import { StartService } from '../start.service';
import { Update } from '../update/update';
import { isQuestionDelete } from '../update/question-update';
import { isEndDelete, isEndEnabledChange } from '../update/end-update';
import { isStartEnabledChange } from '../update/start-update';

@Injectable()
export class ErrorService implements OnDestroy {
  private _tree: Node<ErrorState> = new Node<ErrorState>();
  get tree(): Node<ErrorState> {
    return this._tree;
  }
  private qsub: Subscription;
  private esub: Subscription;
  private ssub: Subscription;

  constructor(private is: InitService, private qs: QuestionService, private es: EndService, private ss: StartService) {
    is.init.pipe(take(1)).subscribe((data: ConstructionSave) => {
      data.errorData ? this.setTree(data.errorData.tree) : this.createTree(data.form);
    });
    this.qsub = qs.change.subscribe((u: Update) => this.qsHandler(u));
    this.esub = es.change.subscribe((u: Update) => this.esHandler(u));
    this.ssub = ss.change.subscribe((u: Update) => this.ssHandler(u));
  }

  get(path: string, p: boolean = true): Node<ErrorState> {
    return this.tree.get(path, p);
  }

  set(path: string, err: ErrorState, p: boolean = true): void {
    this.tree.set(path, err, p);
  }

  restrictQ(id: string): void {
    const conf = this.tree.get(`questions.${id}`);
    for (const key in conf?.children) {
      if (Object.prototype.hasOwnProperty.call(conf.children, key) && this.qs.get[id].conf[key] === undefined) {
        conf.get(key).delete();
      }
    }
  }

  private qsHandler(u: Update): void {
    if (isQuestionDelete(u)) {
      this.tree.get(`questions.${u.id}`)?.delete();
    }
  }

  private esHandler(u: Update): void {
    if (isEndDelete(u)) {
      this.tree.get(`ends.${u.id}`)?.delete();
    } else if (isEndEnabledChange(u)) {
      this.tree.get('ends').delete();
    }
  }

  private ssHandler(u: Update): void {
    if (isStartEnabledChange(u)) {
      this.tree.get('start')?.delete();
    }
  }

  ngOnDestroy(): void {
    this.tree?.delete();
    this.qsub?.unsubscribe();
    this.esub?.unsubscribe();
    this.ssub?.unsubscribe();
  }

  private setTree(tree: ErrorTree): void {
    Node.fromTree(tree, this._tree);
  }

  private createTree(form: ConstructionForm): void {
    this._tree = Node.from(
      {
        questions: form.questions,
        ends: form.ends ? form.ends : {},
        start: form.start ? form.start : {},
      },
      this._tree
    );
  }

  gather(): ErrorData {
    return {
      valid: valid(this.tree),
      tree: this.tree.save(),
    };
  }

  valid(): boolean {
    return valid(this.tree);
  }

  showErrors(): void {
    this.tree.showErrors();
  }
}

export function valid(node: Node<ErrorState>): boolean {
  if (node.value?.error !== undefined) return false;
  for (const key in node.children) {
    if (!Object.prototype.hasOwnProperty.call(node.children, key)) continue;
    if (!valid(node.children[key])) return false;
  }
  return true;
}
