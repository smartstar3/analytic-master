import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Image } from '../../builder2/image-stuff/image.service';

@Component({
  selector: 'app-scalable-image',
  templateUrl: './scalable-image.component.html',
  styleUrls: ['./scalable-image.component.scss'],
})
export class ScalableImageComponent implements OnInit, OnChanges {
  @Input() imageLink: string;
  @Input() image: Image;
  @Input() imageScale: number;
  @Input() isEditAble: boolean;

  @Output() updateImageScale: EventEmitter<number> = new EventEmitter<number>();

  @ViewChild('scalableImage') scalableImage: ElementRef;

  width = 0;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.imageScale) {
      this.fitImageSize();
    }
  }

  plusScale(event: Event): void {
    event.stopPropagation();

    if (!this.imageScale) {
      this.updateImageScale.emit(1.1);
    } else {
      this.updateImageScale.emit(this.imageScale + 0.1);
    }
  }

  minusScale(event: Event): void {
    event.stopPropagation();

    if (this.imageScale === 0) {
      return;
    }

    if (!this.imageScale) {
      this.updateImageScale.emit(1 - 0.1);
    } else {
      this.updateImageScale.emit(this.imageScale - 0.1);
    }
  }

  fitImageSize(): void {
    if (!this.scalableImage)
      return;

    const el = this.scalableImage.nativeElement;
    if (el) {
      let width = el.naturalWidth * (this.imageScale || 1);
      let height = el.naturalHeight * (this.imageScale || 1);
      const maxWidth = this.imageScale ? this.imageScale * 350 : 350;
      const maxHeight = this.imageScale ? this.imageScale * 110 : 110;
      if (width > maxWidth) {
        height = (height / width) * maxWidth;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (width / height) * maxHeight;
      }

      this.width = width;
    }
  }
}
