import { Component } from '@angular/core';
import { ImageService } from '../image.service';
import { MessengerService } from '../../../messenger/messenger.service';
import { StartService } from '../../services/start.service';

@Component({
  selector: 'app-start-screen-builder',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss'],
})
export class StartScreenComponent {
  private _file: File;

  constructor(public ss: StartService, private imageService: ImageService, private msgr: MessengerService) {}

  get file(): File {
    return this._file;
  }

  set file(file: File) {
    this._file = file;
    this.imageService.upload(file).subscribe(
      (data) => {
        this.imageService.add(data);
        const { hash, name } = data;
        this.ss.image = { hash, name };
      },
      (err) => this.msgr.httpErrorHandler(err, 'Failed to upload image')
    );
  }

  removeImage(): void {
    this.ss.image = null;
  }

  onFileChange(event: Event): void {
    const { files } = event.target as HTMLInputElement;
    if (files.item(0)) this.file = files.item(0);
  }
}
