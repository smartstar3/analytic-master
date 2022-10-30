import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../api/api.service';
import { MessengerService } from '../../messenger/messenger.service';
import { environment } from '../../../environments/environment';
import { EmailStatusComponent } from '../email-status/email-status.component';

export interface VariableField {
  name: string;
  field: string;
}

export interface Field {
  nameField: string;
  emailField: string;
  otherFields?: VariableField[];
}

@Component({
  selector: 'app-share-center',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
})
export class RootComponent implements OnInit {
  fid: string;
  companyLink: string;

  @ViewChild(EmailStatusComponent) emailStatus: EmailStatusComponent;

  constructor(private api: ApiService, private msgr: MessengerService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.fid = this.route.snapshot.paramMap.get('fid');
    this.getCompanyLink();
  }

  getCompanyLink(): void {
    this.api.getOwnCompanyLink().subscribe(
      (link) => {
        this.companyLink = `${environment.url}f/${link}/${this.fid}`;
      },
      () => this.msgr.error('There is a problem getting you link')
    );
  }

  getEmailStatus = (): void => {
    this.emailStatus.getShareInfos();
    this.emailStatus.getSharedEmailStatics();
  };
}
