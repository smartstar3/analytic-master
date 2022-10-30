import { Form } from '../../question';
import { Injectable, OnDestroy, Optional } from '@angular/core';
import { forkJoin, ReplaySubject } from 'rxjs';
import { IdService } from './id.service';
import { switchMap, take } from 'rxjs/operators';
import { ApiService } from '../../api/api.service';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class InitService implements OnDestroy {
  init: ReplaySubject<Form> = new ReplaySubject<Form>(1);

  ngOnDestroy(): void {
    this.init.complete();
  }

  private _init(
    form: Form = { defaultEnd: undefined, design: undefined, ends: [], name: '', questions: [], start: undefined }
  ): void {
    this.init.next(form);
  }

  constructor(
    @Optional() private route?: ActivatedRoute,
    @Optional() private ids?: IdService,
    @Optional() private api?: ApiService
  ) {
    if (!api) return;
    forkJoin([ids.company.pipe(take(1)), ids.id.pipe(take(1))])
      .pipe(
        switchMap(([company, id]) => {
          if (company) return this.api.getForm(company, id);
          return this.api.getOwnForm(id);
        })
      )
      .subscribe((form: Form) => this._init(form));
  }
}
