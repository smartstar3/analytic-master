import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Design, StartScreen } from 'src/app/question';
import { Font } from 'ngx-font-picker';
import { Image, ImageService } from '../../builder2/image-stuff/image.service';
import { MessengerService } from '../../messenger/messenger.service';
import { StartService } from '../services/start.service';
import { StartService as BuilderStartService } from '../../builder2/services/start.service';
import { DEFAULT_DESIGN } from '../../builder2/services/save.service';
import { isStartImageChange } from '../../builder2/services/update/start-update';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss'],
})
export class StartScreenComponent implements OnInit {
  image: Image;
  imageLink: string;
  @Input() designForm: Design;
  @Input() disabled = false;
  get screen(): StartScreen {
    return this.ss.start;
  }
  @Output() started: EventEmitter<void> = new EventEmitter<void>();

  constructor(public ss: StartService, public bss: BuilderStartService, private is: ImageService, private msgr: MessengerService) {}
  public font: Font = new Font({
    family: '',
    size: '14px',
    style: 'regular',
    styles: ['regular'],
  });

  ngOnInit(): void {
    this.designForm = DEFAULT_DESIGN;
    this.font.family = this.designForm.font;
    this.resetImage();
    this.ss.change.subscribe((update) => {
      if (isStartImageChange(update)) {
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

  updateImageScale(scale: number): void {
    this.bss.image = { hash: this.image.hash, name: this.image.name, scale };
  }
}
