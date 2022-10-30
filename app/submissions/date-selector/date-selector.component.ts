import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-date-selector',
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.scss'],
})
export class DateSelectorComponent implements OnInit {
  private _startDate: Date;
  @Input() set startDate(date: Date) {
    this._startDate = date;
    this.startDateChange.emit(date);
  }
  get startDate(): Date {
    return this._startDate;
  }
  @Output() readonly startDateChange: EventEmitter<Date> = new EventEmitter<Date>();

  _endDate: Date;
  @Input() set endDate(date: Date) {
    this._endDate = date;
    this.endDateChange.emit(date);
  }
  get endDate(): Date {
    return this._endDate;
  }
  @Output() readonly endDateChange: EventEmitter<Date> = new EventEmitter<Date>();

  _minDate: Date;
  @Input() set minDate(date: Date) {
    this._minDate = date;
  }
  get minDate(): Date {
    return this._minDate;
  }

  _maxDate: Date;
  @Input() set maxDate(date: Date) {
    this._maxDate = date;
  }
  get maxDate(): Date {
    return this._maxDate;
  }

  ngOnInit(): void {
    this.startDate = this.startDate ? this.startDate : this.minDate;
    this.endDate = this.endDate ? this.endDate : this.maxDate;
  }
}
