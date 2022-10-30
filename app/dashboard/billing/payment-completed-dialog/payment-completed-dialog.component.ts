import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../api/api.service';
import { Company } from '../../../api/company';
import { MessengerService } from '../../../messenger/messenger.service';

@Component({
  selector: 'app-payment-completed-dialog',
  templateUrl: './payment-completed-dialog.component.html',
  styleUrls: ['./payment-completed-dialog.component.scss'],
})
export class PaymentCompletedDialogComponent implements OnInit {
  company: Company;
  constructor(
    public dialogRef: MatDialogRef<PaymentCompletedDialogComponent>,
    public api: ApiService,
    private msgr: MessengerService
  ) {}

  ngOnInit(): void {
    this.api.getOwnCompany().subscribe(
      (company) => (this.company = company),
      (err) => this.msgr.httpErrorHandler(err, 'something went wrong when trying to get your user account info')
    );
  }

  noClick(): void {
    this.dialogRef.close();
  }
}
