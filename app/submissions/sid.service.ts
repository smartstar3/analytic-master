import { Injectable, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable()
export class SidService {
  private _sid: number;
  change: EventEmitter<void> = new EventEmitter<void>();
  get value(): number {
    return this._sid;
  }
  set value(sid: number) {
    this._sid = sid;
    this.change.emit();
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { sid },
      queryParamsHandling: 'merge',
    });
  }
  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParamMap.subscribe((map) => {
      this.value = map.get('sid') ? +map.get('sid') : null;
    });
  }
}
