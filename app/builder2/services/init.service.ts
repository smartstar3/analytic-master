import { ConstructionForm, Form } from '../../question';
import { Injectable, OnDestroy, Optional } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { IdService } from './id.service';
import { switchMap, take } from 'rxjs/operators';
import { ApiService } from '../../api/api.service';
import { ErrorState } from './error-system/tree-map';

@Injectable()
export class InitService implements OnDestroy {
  init: ReplaySubject<ConstructionSave> = new ReplaySubject<ConstructionSave>(1);

  ngOnDestroy(): void {
    this.init.complete();
  }

  private _init(
    save: ConstructionSave = {
      form: { name: '', questions: {}, questionList: [] },
      publish: { name: '', questions: [] },
    }
  ): void {
    this.init.next(save);
  }

  private getSave(id: string): Observable<ConstructionSave> {
    return this.api.getBuilderForm(id);
  }

  constructor(private ids: IdService, @Optional() private api: ApiService) {
    if (!api) return;
    ids.id
      .pipe(
        switchMap((id: string) => this.getSave(id)),
        take(1)
      )
      .subscribe((save: ConstructionSave) => this._init(save));
  }
}

export interface ConstructionSave {
  form: ConstructionForm;
  publish: Form;
  startEnabled?: boolean;
  endEnabled?: boolean;
  errorData?: ErrorData;
}

export interface ErrorData {
  tree: ErrorTree;
  valid: boolean;
}

export interface TreeSave<V> {
  key: string | undefined;
  children: { [key: string]: TreeSave<V> };
  value: V;
}

export type ErrorTree = TreeSave<ErrorState>;
