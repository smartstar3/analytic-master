import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedEmailStatistics, ShareInfo, ShareResponse } from '../../resources/interfaces/share-info.interface';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ConfirmationDialogComponent } from '../../dashboard/settings/settings.component';
import { STATUS_ENUM } from '../../resources/constants/share-center.constant';
import { ApiService } from '../../api/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessengerService } from '../../messenger/messenger.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-email-status',
  templateUrl: './email-status.component.html',
  styleUrls: ['./email-status.component.scss'],
})
export class EmailStatusComponent implements OnInit {
  fid: string;
  displayedColumns: string[] = ['select', 'name', 'email', 'status', 'action'];
  tableShareInfos: ShareInfo[] = [];
  dataSource = new MatTableDataSource<ShareInfo>([]);
  selection = new SelectionModel<ShareInfo>(true, []);
  emailSearchWord = '';
  emailTableSort: { active: string; direction: SortDirection } = {
    active: 'name',
    direction: '',
  };
  emailStatusFilterOptions = ['', 'sent', 'submitted', 'pending', 'expired', 'failure', 'opened', 'clicked'];
  emailStatusFilter = '';
  shareInfoTotalCount = 0;
  currentPage = 0;
  pageOptions = [5, 10, 20];
  pageSize = this.pageOptions[0];
  emailStatistics: SharedEmailStatistics;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private msgr: MessengerService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fid = this.route.snapshot.paramMap.get('fid');
    this.getShareInfos();
    this.getSharedEmailStatics();
  }

  getShareInfos(): void {
    const params = {
      searchWord: this.emailSearchWord,
      emailStatus: this.emailStatusFilter,
      sortBy: this.emailTableSort.active,
      sortDirection: this.emailTableSort.direction,
      pageSize: `${this.pageSize}`,
      currentPage: `${this.currentPage}`,
    };

    this.api.getShareInfos(this.fid, params).subscribe(
      (data: ShareResponse): void => {
        this.shareInfoTotalCount = data.totalSize;
        this.tableShareInfos = data.shares;
        this.dataSource = new MatTableDataSource<ShareInfo>(this.tableShareInfos);
      },
      () => this.msgr.error('There is a problem getting you link')
    );
  }

  getSharedEmailStatics(): void {
    this.api.getSharedEmailStatics(this.fid).subscribe(
      (data: SharedEmailStatistics): void => {
        this.emailStatistics = data;
      },
      () => this.msgr.error('There is a problem getting shared email statistics')
    );
  }

  onRemoveShareInfo(id: number): void {
    this.dialog
      .open(ConfirmationDialogComponent, {
        width: '400px',
        data: {
          title: 'Confirm deletion',
          action: 'Delete',
        },
      })
      .beforeClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.api.deleteShare(this.fid, id).subscribe(() => {
            this.getShareInfos();
          });
        }
      });
  }

  onRemoveMultiShareInfos(): void {
    this.dialog
      .open(ConfirmationDialogComponent, {
        width: '400px',
        data: {
          title: 'Confirm deletion',
          action: 'Delete',
        },
      })
      .beforeClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          const shareIds = this.selection.selected.map((share) => share.id);
          this.api.deleteMultipleShares(this.fid, shareIds).subscribe(() => {
            this.getShareInfos();
          });
        }
      });
  }

  onViewResponse(shareInfo: ShareInfo): void {
    // Open if the user is submitted
    if (shareInfo.status === STATUS_ENUM.SUBMITTED) {
      void this.router.navigateByUrl(`/data/${this.fid}?tab=1&sid=${shareInfo.responseId}`);
    }
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  checkboxLabel(row?: ShareInfo): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }

  applyFilter(): void {
    this.getShareInfos();
  }

  onEmailSortChange(event: Sort): void {
    this.emailTableSort = event;
    this.getShareInfos();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getShareInfos();
  }
}
