import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Design, EndScreen } from 'src/app/question';
import { Font } from 'ngx-font-picker';
import { EndService } from '../services/end.service';
import { DEFAULT_DESIGN } from '../../builder2/services/save.service';
import { Image, ImageService } from '../../builder2/image-stuff/image.service';
import { MessengerService } from '../../messenger/messenger.service';
import { EndImageChange, isEndImageChange } from '../../builder2/services/update/end-update';
import { EndService as BuilderEndService } from '../../builder2/services/end.service';
import { UpdateType } from '../../builder2/services/update/update';

@Component({
  selector: 'app-end-screen',
  templateUrl: './end-screen.component.html',
  styleUrls: ['./end-screen.component.scss'],
})
export class EndScreenComponent implements OnInit, OnChanges {
  @Input() eid: number | string;
  @Input() index: number;
  image: Image;
  imageLink: string;
  designForm: Design;
  @Input() disabled = false;
  console = console;

  private _screen: EndScreen;
  get screen(): EndScreen {
    return this._screen;
  }

  constructor(
    public es: EndService,
    public bes: BuilderEndService,
    private is: ImageService,
    private msgr: MessengerService
  ) {}
  public font: Font = new Font({
    family: '',
    size: '14px',
    style: 'regular',
    styles: ['regular'],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (!Object.prototype.hasOwnProperty.call(changes, 'eid')) return;
    this._screen = this.es.get(this.eid);
  }

  ngOnInit(): void {
    this.designForm = DEFAULT_DESIGN;
    this.font.family = this.designForm.font;
    if (this.screen?.link) {
      try {
        this.screen.link.url = new URL(this.screen.link.url).href;
      } catch {
        try {
          this.screen.link.url = new URL('https://' + this.screen.link.url).href;
        } catch {
          this.screen.link = undefined;
        }
      }
    }
    this.resetImage();
    this.es.getChange(this.eid as string).subscribe((update) => {
      if (isEndImageChange(update)) {
        this.resetImage();
      }
    });
  }

  resetImage(): void {
    const hash = this.screen.image.hash;
    if (this.screen.imageEnabled) {
      this.image = this.is.imageMap.get(hash);
      if (!this.image) {
        this.is.retrieve(hash).subscribe(
          (im) => {
            this.is.add(im);
            this.image = this.is.imageMap.get(hash);
            // this.imageLink = `data:image/png;base64,${this.image?.buffer.toString('base64')}`;
            this.imageLink = this.image?.path;
          },
          (err) => this.msgr.httpErrorHandler(err, 'Failed to retrieve image')
        );
      }
      // this.imageLink = `data:image/png;base64,${this.image?.buffer.toString('base64')}`;
      this.imageLink = this.image?.path;
    }
  }

  fontStyle(): Font {
    this.font.family = this.designForm.font;
    return this.font;
  }

  disable(event: MouseEvent): void {
    if (this.disabled) event.preventDefault();
  }

  updateImageScale(scale: number): void {
    this.bes.get[this.eid].image = { hash: this.image.hash, name: this.image.name, scale };
    this.bes.update<EndImageChange>({ type: UpdateType.EndImageChange, image: { hash: this.image.hash, name: this.image.name, scale } }, this.eid as string);
  }
}
