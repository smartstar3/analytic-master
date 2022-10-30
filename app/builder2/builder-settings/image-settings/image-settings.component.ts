import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImageManageDialogComponent } from './image-manage-dialog/image-manage-dialog.component';
import { Image } from '../../image-stuff/image.service';

@Component({
  selector: 'app-image-settings',
  templateUrl: './image-settings.component.html',
  styleUrls: ['./image-settings.component.scss'],
})
export class ImageSettingsComponent implements OnInit {
  @Output() imageSelected: EventEmitter<Image> = new EventEmitter<Image>();

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  openImageManageDialog(): void {
    const dialogRef = this.dialog.open(ImageManageDialogComponent, {
      width: '96vw',
      height: '88vh',
      maxWidth: '100vw',
    });

    dialogRef.afterClosed().subscribe((image: Image) => {
      if (image) {
        this.imageSelected.emit(image);
      }
    });
  }
}
