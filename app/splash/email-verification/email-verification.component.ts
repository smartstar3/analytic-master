import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ApiService } from '../../api/api.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss'],
})
export class EmailVerificationComponent implements OnInit {
  snap: ActivatedRouteSnapshot;
  loading: boolean;
  success: boolean;

  constructor(private route: ActivatedRoute, private api: ApiService) {
    this.loading = true;
    this.snap = route.snapshot;
  }

  ngOnInit(): void {
    this.api.verifyEmail(this.snap.queryParams).subscribe(
      () => {
        this.success = true;
        this.loading = false;
      },
      () => {
        this.success = false;
        this.loading = false;
      }
    );
  }
}
