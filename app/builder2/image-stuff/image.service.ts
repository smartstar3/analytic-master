import { Injectable } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { Buffer } from 'buffer';
import { Observable } from 'rxjs';

export interface Image {
  name: string;
  buffer?: Buffer;
  image?: { type: string; data: number[] };
  hash: string;
  path?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private readonly _imageMap: Map<string, Image>;

  constructor(private api: ApiService) {
    this._imageMap = new Map<string, Image>();
  }

  get images(): Image[] {
    return [...this._imageMap.values()];
  }

  get imageMap(): Map<string, Image> {
    return this._imageMap;
  }

  upload(image: File): Observable<Image> {
    const formData = new FormData();
    formData.append('image', image);
    return this.api.uploadImage(formData);
  }

  retrieve(hash: string): Observable<Image> {
    return this.api.getImage(hash);
  }

  add(data: Image): void {
    this._imageMap.set(data.hash, data);
  }
}
