import { Injectable, OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class IdService implements OnDestroy {
  id: ReplaySubject<string> = new ReplaySubject<string>(1);
  company: ReplaySubject<string> = new ReplaySubject<string>(1);

  constructor(private route: ActivatedRoute) {
    const id = route.snapshot.paramMap.get('id');
    const company = route.snapshot.paramMap.get('company');
    if (id) this.id.next(id);
    this.company.next(company);
  }

  ngOnDestroy(): void {
    this.id.complete();
    this.company.complete();
  }
}
