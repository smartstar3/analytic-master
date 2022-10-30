import { Component, OnInit, Input } from '@angular/core';
import { Design, EndScreen } from 'src/app/question';
import { Font } from 'ngx-font-picker';
import { DEFAULT_DESIGN } from '../../builder2/services/save.service';
import { Image, ImageService } from '../../builder2/image-stuff/image.service';
import { MessengerService } from '../../messenger/messenger.service';
import { PublishedEndService } from '../../form/services/published-end.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-answer-end-screen',
  templateUrl: './end-screen.component.html',
  styleUrls: ['./end-screen.component.scss'],
})
export class EndScreenComponent implements OnInit {
  @Input() eid: number | string;
  image: Image;
  imageLink: string;
  designForm: Design;
  @Input() disabled = false;

  private _screen: EndScreen;
  get screen(): EndScreen {
    return this._screen;
  }

  constructor(public es: PublishedEndService, private is: ImageService, private msgr: MessengerService) {}
  public font: Font = new Font({
    family: '',
    size: '14px',
    style: 'regular',
    styles: ['regular'],
  });

  ngOnInit(): void {
    this._screen = this.es.get[Number(this.eid)];
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

    if (this.screen.imageEnabled && this.screen.image.hash) {
      this.image = this.is.imageMap.get(this.screen.image.hash);
      if (!this.image) {
        this.is.retrieve(this.screen.image.hash).subscribe(
          (im) => {
            this.is.add(im);
            this.image = this.is.imageMap.get(this.screen.image.hash);
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

  disable(event: Event): void {
    if (this.disabled) event.preventDefault();
  }
}
