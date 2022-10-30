import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Design, StartScreen } from 'src/app/question';
import { Font } from 'ngx-font-picker';
import { Image, ImageService } from '../../builder2/image-stuff/image.service';
import { MessengerService } from '../../messenger/messenger.service';
import { DEFAULT_DESIGN } from '../../builder2/services/save.service';
import { PublishedStartService } from '../../form/services/published-start.service';

@Component({
  selector: 'app-answer-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss'],
})
export class StartScreenComponent implements OnInit {
  image: Image;
  imageLink: string;
  designForm: Design;
  @Input() disabled = false;
  get screen(): StartScreen {
    return this.ss.start;
  }
  @Output() started: EventEmitter<void> = new EventEmitter<void>();

  constructor(public ss: PublishedStartService, private is: ImageService, private msgr: MessengerService) {}
  public font: Font = new Font({
    family: '',
    size: '14px',
    style: 'regular',
    styles: ['regular'],
  });

  ngOnInit(): void {
    this.designForm = DEFAULT_DESIGN;
    this.font.family = this.designForm.font;
    if (this.screen.imageEnabled && this.screen.image.hash) {
      this.image = this.is.imageMap.get(this.screen.image.hash);
      if (!this.image) {
        this.is.retrieve(this.screen.image.hash).subscribe(
          (im) => {
            this.is.add(im);
            this.image = this.is.imageMap.get(this.screen.image.hash);
            this.imageLink = `data:image/png;base64,${this.image?.buffer.toString('base64')}`;
          },
          (err) => this.msgr.httpErrorHandler(err, 'Failed to retrieve image')
        );
      }
      this.imageLink = `data:image/png;base64,${this.image?.buffer.toString('base64')}`;
    }
  }

  fontStyle(): Font {
    this.font.family = this.designForm.font;
    return this.font;
  }
}
