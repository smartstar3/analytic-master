import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-image-manage-dialog',
  templateUrl: './image-manage-dialog.component.html',
  styleUrls: ['./image-manage-dialog.component.scss'],
})
export class ImageManageDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ImageManageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { test: any }
  ) {}

  ngOnInit(): void {
  }

  handleClose(): void {
    this.dialogRef.close();
  }
}
