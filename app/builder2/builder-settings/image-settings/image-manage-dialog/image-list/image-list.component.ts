import { Component, OnInit } from '@angular/core';
import { Image } from '../../../../image-stuff/image.service';
import { ApiService } from '../../../../../api/api.service';
import { tap } from 'rxjs/operators';
import { MessengerService } from '../../../../../messenger/messenger.service';

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss'],
})
export class ImageListComponent implements OnInit {
  images: Image[] = [];
  loading = false;
  imageHashes: string[] = [];

  constructor(private api: ApiService, private msgr: MessengerService) {}

  ngOnInit(): void {
    this.getImages();
  }

  getImages(): void {
    this.imageHashes = [];
    this.loading = true;
    this.api
      .getImages()
      .pipe(tap(() => (this.loading = false)))
      .subscribe(
        (images) => {
          this.images = images;
        },
        (err) => this.msgr.httpErrorHandler(err, 'Failed to get images')
      );
  }

  imageSelectionChange(hash: string): void {
    if (this.imageHashes.includes(hash)) {
      this.imageHashes = this.imageHashes.filter((item) => item !== hash);
    } else {
      this.imageHashes.push(hash);
    }
  }

  deleteImages(): void {
    this.api.deleteImages(this.imageHashes).subscribe(
      () => {
        this.getImages();
      },
      (err) => this.msgr.httpErrorHandler(err, 'Failed to delete images')
    );
  }

  getImageData(): Image {
    return this.images.find((item) => item.hash === this.imageHashes[0]);
  }
}
