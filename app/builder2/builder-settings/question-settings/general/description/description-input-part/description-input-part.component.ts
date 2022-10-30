import {
  Component,
  HostBinding,
  Input,
  ElementRef,
  Optional,
  Self,
  EventEmitter,
  Output,
  Pipe,
  PipeTransform,
  OnDestroy,
} from '@angular/core';
import { NgControl, ControlValueAccessor } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { BuilderDescriptionPart } from 'src/app/question';
import { PosService } from '../../../../../services/pos.service';

@Component({
  selector: 'app-description-input-part',
  templateUrl: './description-input-part.component.html',
  styleUrls: ['./description-input-part.component.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: DescriptionInputPartComponent }],
})
export class DescriptionInputPartComponent
  implements MatFormFieldControl<BuilderDescriptionPart>, ControlValueAccessor, OnDestroy {
  static nextId = 0;
  id = `app-description-input-${DescriptionInputPartComponent.nextId++}`;
  stateChanges: Subject<void> = new Subject<void>();
  focused = false;
  errorState = false;
  @Output() remove: EventEmitter<void> = new EventEmitter<void>();

  _value: BuilderDescriptionPart = '';
  @Input()
  get value(): BuilderDescriptionPart {
    return this._value;
  }
  set value(part: BuilderDescriptionPart) {
    part = part ? part : '';
    this._value = part;
    this.stateChanges.next();
    this._onChange(this._value);
  }

  private _placeholder: string;
  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(placeholder: string) {
    this._placeholder = placeholder;
    this.stateChanges.next();
  }

  private _required = false;
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(required: boolean) {
    this._required = coerceBooleanProperty(required);
    this.stateChanges.next();
  }

  private _disabled = false;
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  get empty(): boolean {
    return typeof this.value === 'string' && !this.value;
  }

  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  @HostBinding('attr.aria-describedby') describedBy = '';
  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }

  // needs to be refactored. sloppy
  onContainerClick(event: MouseEvent) {}

  constructor(
    public pos: PosService,
    private fm: FocusMonitor,
    private elRef: ElementRef<HTMLElement>,
    @Optional() @Self() public ngControl: NgControl
  ) {
    if (ngControl) {
      this.ngControl.valueAccessor = this;
    }

    fm.monitor(elRef.nativeElement, true).subscribe((origin) => {
      if (this.focused && !origin) {
        this._onTouched();
      }
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
  }

  writeValue(part: BuilderDescriptionPart | null): void {
    this.value = part;
  }

  // change this entire class, can prolly be done in a smarter way
  _onChange = (_: any) => {};
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  _onTouched = () => {};
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  _handleInput(change: any) {
    this.value = this.value;
  }
}
@Pipe({
  name: 'isChipPart',
})
export class IsChipPartPipe implements PipeTransform {
  transform(part: BuilderDescriptionPart): boolean {
    return typeof part !== 'string';
  }
}
