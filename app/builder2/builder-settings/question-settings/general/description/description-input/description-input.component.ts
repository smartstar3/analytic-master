import { Component, HostBinding, Input, ElementRef, Optional, Self, OnDestroy } from '@angular/core';
import { NgControl, ControlValueAccessor } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { BuilderDescription, BuilderDescriptionPart } from 'src/app/question';

@Component({
  selector: 'app-description-input',
  templateUrl: './description-input.component.html',
  styleUrls: ['./description-input.component.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: DescriptionInputComponent }],
})
export class DescriptionInputComponent
  implements MatFormFieldControl<BuilderDescription>, ControlValueAccessor, OnDestroy {
  static nextId = 0;
  id = `app-description-input-${DescriptionInputComponent.nextId++}`;
  stateChanges: Subject<void> = new Subject<void>();
  focused = false;
  errorState = false;

  _value: BuilderDescription = [''];
  @Input()
  get value(): BuilderDescription {
    return this._value;
  }
  set value(description: BuilderDescription) {
    description = description ? description : [''];
    this._value = description;
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
    return this.value.length === 1 && !this.value[0];
  }

  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  @HostBinding('attr.aria-describedby') describedBy = '';
  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent): void {
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      const inputs = this.elRef.nativeElement.querySelectorAll('input');
      inputs[inputs.length - 1].focus(); // focus last input
    }
  }

  constructor(
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

  writeValue(description: BuilderDescription | null): void {
    this.value = description;
  }

  // refactor this one dayyy, its sloppyyyy
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

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  trackByObj(index: number, obj: any): any {
    return obj;
  }

  trackByType(index: number, obj: any): any {
    return typeof obj !== 'string';
  }

  remove(i: number): void {
    if (
      this.value[i - 1] !== undefined &&
      typeof this.value[i - 1] === 'string' &&
      this.value[i + 1] !== undefined &&
      typeof this.value[i + 1] === 'string'
    ) {
      const v1: string = this.value[i - 1] as string;
      const v2: string = this.value[i + 1] as string;
      this.value.splice(i - 1, 3, v1 + v2);
    } else {
      this.value.splice(i, 1);
    }
    this._handleChange();
  }

  _handleInput(change: BuilderDescriptionPart, index: number): void {
    this.value[index] = change;
    this._handleChange();
  }

  // wtf, y would you do this? xD
  _handleChange(): void {
    this.value = this.value;
  }
}
