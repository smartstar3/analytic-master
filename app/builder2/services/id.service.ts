import { Injectable, OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class IdService implements OnDestroy {
  id: ReplaySubject<string> = new ReplaySubject<string>(1);

  constructor(private route: ActivatedRoute) {
    this.id.next(route.snapshot.paramMap.get('id'));
  }

  ngOnDestroy(): void {
    this.id.complete();
  }
}
