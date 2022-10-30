import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StartService } from '../../services/start.service';
import { Image, ImageService } from '../../image-stuff/image.service';
import { MessengerService } from '../../../messenger/messenger.service';

@Component({
  selector: 'app-start-settings',
  templateUrl: './start-settings.component.html',
  styleUrls: ['./start-settings.component.scss'],
})
export class StartSettingsComponent {
  control: FormGroup;
  private _file: File;

  constructor(
    public ss: StartService,
    private fb: FormBuilder,
    private imageService: ImageService,
    private msgr: MessengerService
  ) {
    this.control = this.fb.group(this.ss.start);
    this.control.get('title').valueChanges.subscribe((title: string) => (this.ss.title = title));
    this.control.get('body').valueChanges.subscribe((body: string) => (this.ss.body = body));
    this.control.get('imageEnabled').valueChanges.subscribe((enabled: boolean) => (this.ss.imageEnabled = enabled));
  }

  addImage(): void {
    this.control.get('imageEnabled').setValue(true);
  }

  removeImage(): void {
    this.control.get('imageEnabled').setValue(false);
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
        this.ss.image = { hash, name };
      },
      (err) => this.msgr.httpErrorHandler(err, 'Failed to upload image')
    );
  }

  onFileChange(event: Event): void {
    const { files } = event.target as HTMLInputElement;
    if (files.item(0)) this.file = files.item(0);
  }
  
  setImage(image: Image): void {
    this.imageService.add(image);
    this.ss.image = { hash: image.hash, name: image.name };
  }
}
