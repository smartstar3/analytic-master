import { Injectable, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable()
export class TabService {
  public readonly AGGREGATE = 0;
  public readonly LIST = 1;

  private _tab: number;
  change: EventEmitter<void> = new EventEmitter<void>();
  get value(): number {
    return this._tab;
  }
  set value(tab: number) {
    this._tab = tab;
    this.change.emit();
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab },
      queryParamsHandling: 'merge',
    });
  }
  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParamMap.subscribe((map) => {
      this.value = map.get('tab') ? +map.get('tab') : 0;
    });
  }
}
