import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ShareInfo } from '../../../resources/interfaces/share-info.interface';
import { ApiService } from '../../../api/api.service';

@Component({
  selector: 'app-email-sending-dialog',
  templateUrl: './email-sending-dialog.component.html',
  styleUrls: ['./email-sending-dialog.component.scss']
})
export class EmailSendingDialogComponent implements OnInit {
  totalBatches: number;
  batch: number;
  interval: NodeJS.Timeout;
  shareInfos: ShareInfo[];
  fid: string;
  companyLink: string
  sending: boolean;
  hasError: boolean;

  constructor(
    public api: ApiService,
    public dialogRef: MatDialogRef<EmailSendingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { shareInfos: ShareInfo[]; fid: string; companyLink: string }
  ) { }

  ngOnInit(): void {
    if (this.data.shareInfos) {
      this.shareInfos = [...this.data.shareInfos];
    } else {
      this.shareInfos = [];
    }
    this.fid = this.data.fid;
    this.companyLink = this.data.companyLink;
    this.sending = true;
    this.hasError = false;
    this.sendEmails();
  }

  close(): void {
    this.dialogRef.close();
  }

  private sendEmails(): void {
    this.api.shareFormLink(this.fid, this.companyLink, this.shareInfos).subscribe(
      () => this.sending = false,
      () => {
        this.sending = false;
        this.hasError = true;
      });
  }
}
