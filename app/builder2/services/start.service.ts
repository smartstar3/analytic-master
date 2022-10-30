import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { ConstructionSave, InitService } from './init.service';
import { take } from 'rxjs/operators';
import { Update, UpdateType } from './update/update';
import { BodyChange, ImageChange, ImageEnabledChange, StartEnabledChange, TitleChange } from './update/start-update';
import { StartScreen } from '../../question';

@Injectable()
export class StartService implements OnDestroy {
  get body(): string {
    return this._start?.body;
  }
  set body(body: string) {
    if (!this._start) this._start = DEFAULT_START;
    this._start.body = body;
    const update: BodyChange = { type: UpdateType.StartBodyChange, body };
    this.change.emit(update);
  }

  get title(): string {
    return this._start?.title;
  }
  set title(title: string) {
    if (!this._start) this._start = DEFAULT_START;
    this._start.title = title;
    const update: TitleChange = { type: UpdateType.StartTitleChange, title };
    this.change.emit(update);
  }

  get imageEnabled(): boolean {
    return this._start?.imageEnabled;
  }

  set imageEnabled(imageEnabled: boolean) {
    if (!this._start) this._start = DEFAULT_START;
    this._start.imageEnabled = imageEnabled;
    const update: ImageEnabledChange = { type: UpdateType.StartImageEnabledChange, imageEnabled };
    this.change.emit(update);
  }

  get image(): { hash: string; name: string; scale?: number } {
    return this._start?.image;
  }
  set image(image: { hash: string; name: string; scale?: number }) {
    if (!this._start) this._start = DEFAULT_START;
    this._start.image = image;
    const update: ImageChange = { type: UpdateType.StartImageChange, image };
    this.change.emit(update);
  }

  get startEnabled(): boolean {
    return this._startEnabled;
  }
  set startEnabled(enabled: boolean) {
    this._startEnabled = enabled;
    const update: StartEnabledChange = { type: UpdateType.StartEnabledChange, enabled };
    this.change.emit(update);
  }

  get start(): StartScreen {
    return this._start;
  }

  constructor(private is: InitService) {
    is.init.pipe(take(1)).subscribe((data: ConstructionSave) => this.init(data));
  }
  private _startEnabled: boolean;
  private _start: StartScreen;

  change: EventEmitter<Update> = new EventEmitter<Update>();

  newStart(): void {
    this._start = { ...DEFAULT_START };
  }

  ngOnDestroy(): void {
    this.change.complete();
  }

  private init(data: ConstructionSave): void {
    this._startEnabled = data.startEnabled;
    this._start = data.form.start;
  }
}

const DEFAULT_START: StartScreen = { title: 'Title', body: 'Body', imageEnabled: false, image: { hash: '', name: '' } };
