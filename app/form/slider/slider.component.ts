import { Component, EventEmitter, OnDestroy, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { Options } from '@m0t0r/ngx-slider';
import { NumberComponent } from '../number/number.component';
import { Update, UpdateType } from '../../builder2/services/update/update';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent extends NumberComponent implements OnInit, OnDestroy {
  changeSub: Subscription;

  manualRefresh: EventEmitter<void> = new EventEmitter<void>();
  isRefreshing: boolean;
  options: Options = {};

  ngOnInit(): void {
    super.ngOnInit();
    this.isRefreshing = false;
    try {
      this.changeSub = this.qs.getChange(this.qid).subscribe((update: Update) => {
        if (update.type === UpdateType.MaxChange || update.type === UpdateType.MinChange)
          this.options = this.reloadSlider();
      });
    } catch (e) {
      // do nothing
    }
    this.control.valueChanges.subscribe((value) => this.edited(value));
    this.answer = 0;
    this.options = this.reloadSlider();
  }

  reloadSlider(): Options {
    return {
      floor: this.question.conf.min,
      ceil: this.question.conf.max,
      readOnly: this.disabled,
      animate: true,
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    const change: SimpleChange = changes['disabled'];
    if (change?.currentValue === false) this.refreshAfterAnimation();
  }

  ngOnDestroy(): void {
    if (this.changeSub) this.changeSub.unsubscribe();
  }

  refreshAfterAnimation(): void {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      setTimeout(() => {
        this.manualRefresh.emit();
        this.isRefreshing = false;
      }, 700);
    }
  }
}
