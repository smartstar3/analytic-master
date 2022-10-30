import { Component, HostListener, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { EndService } from '../../services/end.service';
import { BodyChange, EndImageChange, LinkChange, TitleChange } from '../../services/update/end-update';
import { UpdateType } from '../../services/update/update';
import { ImageService } from '../image.service';
import { MessengerService } from '../../../messenger/messenger.service';

@Component({
  selector: 'app-end-screens-builder',
  templateUrl: './end-screen.component.html',
  styleUrls: ['./end-screen.component.scss'],
})
export class EndScreenComponent implements OnInit {
  selected: number;
  private _file: File;

  @HostListener('change', ['$event.target']) emitFiles(target: HTMLInputElement): void {
    if (target.type === 'file' && target.files) {
      this.file = target.files.item(0);
    }
  }

  get file(): File {
    return this._file;
  }

  set file(file: File) {
    this._file = file;
    this.imageService.upload(file).subscribe(
      (data) => {
        this.imageService.add(data);
        const { hash, name } = data;
        this.linkImageChange({ hash, name });
      },
      (err) => this.msgr.httpErrorHandler(err, 'Failed to upload image')
    );
  }

  get eid(): string {
    return this.es.order.value[this.selected];
  }

  constructor(public es: EndService, public imageService: ImageService, private msgr: MessengerService) {}

  ngOnInit(): void {
    this.selected = 0;
    if (this.es.order.value.length < 1) {
      this.add();
      this.es.defaultEnd = this.eid;
    }
  }

  defaultToggle(change: MatSlideToggleChange): void {
    if (change.checked) {
      this.es.defaultEnd = this.es.order.value[this.selected];
    } else {
      this.es.defaultEnd = this.es.order.value[0];
    }
  }

  add(): void {
    this.es.add({
      title: '',
      body: '',
      link: { button: '', url: '' },
      linkEnabled: false,
      image: null,
    });
    this.selected = this.es.order.value.length - 1;
  }

  delete(): void {
    if (this.es.defaultEnd === this.eid) this.es.defaultEnd = this.es.order.value[0];
    this.es.deleteAt(this.selected);
    this.selected--;
    if (this.selected < 0) this.selected = 0;
  }

  titleChange(title: string): void {
    this.es.get[this.eid].title = title;
    this.es.update<TitleChange>({ type: UpdateType.EndTitleChange, title }, this.eid);
  }

  bodyChange(body: string): void {
    this.es.get[this.eid].body = body;
    this.es.update<BodyChange>({ type: UpdateType.EndBodyChange, body }, this.eid);
  }

  linkButtonChange(button: string): void {
    this.es.get[this.eid].link.button = button;
    this.es.update<LinkChange>({ type: UpdateType.EndLinkChange, link: this.es.get[this.eid].link }, this.eid);
  }

  linkUrlChange(url: string): void {
    this.es.get[this.eid].link.url = url;
    this.es.update<LinkChange>({ type: UpdateType.EndLinkChange, link: this.es.get[this.eid].link }, this.eid);
  }

  linkImageChange(image: { hash: string; name: string }): void {
    this.es.get[this.eid].image = image;
    this.es.update<EndImageChange>({ type: UpdateType.EndImageChange, image: this.es.get[this.eid].image }, this.eid);
  }

  linkEnableChange(enabled: boolean): void {
    this.es.get[this.eid].linkEnabled = enabled;
    if (enabled && !this.es.get[this.eid].link) {
      this.es.get[this.eid].link = { button: '', url: '' };
    }
  }

  removeImage(): void {
    this.linkImageChange(null);
  }

  onFileChange(event: Event): void {
    const { files } = event.target as HTMLInputElement;
    if (files.item(0)) this.file = files.item(0);
  }
}
