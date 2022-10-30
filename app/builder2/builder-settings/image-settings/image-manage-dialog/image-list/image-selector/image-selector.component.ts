import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Image } from '../../../../../image-stuff/image.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-image-selector',
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.scss'],
})
export class ImageSelectorComponent implements OnInit {
  readonly API_ADDR: string = environment.api_base;
  checked = false;
  @Input() image: Image;
  @Output() selectChanged: EventEmitter<string> = new EventEmitter<string>();
  constructor() {}

  ngOnInit(): void {}

  toggleCheck(): void {
    this.checked = !this.checked;
    this.selectChanged.emit(this.image.hash);
  }
}
