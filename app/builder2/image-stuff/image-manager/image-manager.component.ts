import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Image, ImageService } from '../image.service';

@Component({
  selector: 'app-image-manager',
  templateUrl: './image-manager.component.html',
  styleUrls: ['./image-manager.component.scss'],
})
export class ImageManagerComponent implements OnInit {
  progress = 0;
  console = console;

  uploadForm = new FormGroup({
    // eslint-disable-next-line @typescript-eslint/unbound-method
    image: new FormControl(null, Validators.required),
  });

  constructor(private imageService: ImageService) {}

  ngOnInit(): void {
    this.uploadForm.valueChanges.subscribe((change: { image: File }) => {
      this.imageService.upload(change.image);
    });
  }

  get images(): Image[] {
    const images = this.imageService.images;
    return images;
  }

  submit(): void {
    // this.http.post('http://...', toFormData(this.signup.value), {
    //   reportProgress: true,
    //   observe: 'events'
    // }).subscribe(event => {
    //
    // if ( event.type === HttpEventType.UploadProgress ) {
    //   this.progress = Math.round((100 * event.loaded) / event.total);
    // }
    //
    // if ( event.type === HttpEventType.Response ) {
    //   this.signup.reset();
    // }});
  }
}
