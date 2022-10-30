import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ExportOptions } from '../root.component';

@Component({
  selector: 'app-export-options-dialog',
  templateUrl: './export-options-dialog.component.html',
  styleUrls: ['./export-options-dialog.component.scss'],
})
export class ExportOptionsDialogComponent implements OnInit {
  questions: number[];
  shareInfos: string[];
  exportOptions: ExportOptions = {
    questions: [],
    shareInfos: [],
    exportOnlyShareCenter: false,
  };

  constructor(
    public dialogRef: MatDialogRef<ExportOptionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { questions: string[]; shareInfoKeys: string[] }
  ) {
    this.questions = this.data.questions.map((item, index) => index);
    this.shareInfos = this.data.shareInfoKeys;
  }

  ngOnInit(): void {
    this.exportOptions.questions = this.questions;
  }

  handleClose(): void {
    this.dialogRef.close();
  }

  getSelectedQuestionList(qsList: number[]): string {
    return qsList
      .map((item) => {
        return 'Q.' + (item + 1).toString();
      })
      .join(', ');
  }
}
