import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Answer, ApiService, Filter } from 'src/app/api/api.service';
import { DBAnswers, Q, QuestionType } from 'src/app/question';
import { MessengerService } from 'src/app/messenger/messenger.service';
import { ActivatedRoute } from '@angular/router';
import { SidService } from '../sid.service';
import { switchMap, take, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { FiltersComponent } from '../filters/filters.component';
import { MatDrawer } from '@angular/material/sidenav';
import { TabService } from '../tab.service';
import { QuestionService } from '../../form/services/question.service';
import { InitService } from '../../form/services/init.service';
import { IdService } from '../../form/services/id.service';
import { NameService } from '../name.service';
import { PublishedStartService } from '../../form/services/published-start.service';
import { PublishedEndService } from '../../form/services/published-end.service';
import { PublishedQuestionService } from '../../form/services/published-question.service';
import { StartService } from '../../form/services/start.service';
import { EndService } from '../../form/services/end.service';
import { ExportOptionsDialogComponent } from './export-options-dialog/export-options-dialog.component';
import XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { HttpErrorResponse } from '@angular/common/http';

export interface ExportOptions {
  questions: number[];
  shareInfos: string[];
  exportOnlyShareCenter: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  providers: [
    SidService,
    TabService,
    PublishedStartService,
    PublishedEndService,
    PublishedQuestionService,
    InitService,
    IdService,
    StartService,
    EndService,
    QuestionService,
    NameService,
  ],
})
export class RootComponent implements OnInit {
  @ViewChild('filterSidebar') filterSidebar: MatDrawer;
  fid: string;
  state: 'loading' | 'error' | 'loaded' = 'loading';
  answers: Answer[][];
  submissionList: (DBAnswers & { createdAt: Date; id: number })[];
  selectedSubmission: DBAnswers;
  filters: Filter[] = [];
  filter: Filter;
  private handleAnswers = {
    next: (answers: (DBAnswers & { createdAt: string; id: number })[]) => {
      this.submissionList = answers.map((submission) =>
        Object.assign({}, submission, {
          createdAt: new Date(submission.createdAt),
        })
      ).sort((a, b) => {
        if (a.createdAt > b.createdAt)
          return -1;
        return 1;
      });
      this.answers = answerGrouper(answers, this.qs.pqs.get.length);
      if (this.sid.value) {
        this.selectedSubmission = this.getAnswer(this.sid.value);
      }
    },
    error: (err: HttpErrorResponse) => {
      this.state = 'error';
      this.msgr.httpErrorHandler(err, 'Failed to load answers');
    },
  };
  private handleFilters = {
    next: (filters: Filter[]) => (this.filters = filters),
    error: (err: HttpErrorResponse) => {
      this.state = 'error';
      this.msgr.httpErrorHandler(err, 'Failed to load filters');
    },
  };

  constructor(
    private api: ApiService,
    private msgr: MessengerService,
    private route: ActivatedRoute,
    private sid: SidService,
    public tabs: TabService,
    private dialog: MatDialog,
    public qs: QuestionService,
    private is: InitService,
    public name: NameService,
    private ids: IdService,
    private viewContainerRef: ViewContainerRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.fid = this.route.snapshot.paramMap.get('id');
    this.ids.id.next(this.fid);
    await this.is.init
      .pipe(
        take(1),
        switchMap(() => this.api.getAnswers(this.fid)),
        tap(this.handleAnswers)
      )
      .toPromise();
    await this.api.getFilters(this.fid).pipe(tap(this.handleFilters)).toPromise();

    if (this.state === 'error') return;

    this.state = 'loaded';
    this.sid.change.subscribe(() => {
      if (typeof this.sid.value === 'number') {
        this.selectedSubmission = this.getAnswer(this.sid.value);
      } else {
        this.selectedSubmission = null;
      }
    });
  }

  getAnswer(i: number): DBAnswers {
    return typeof i === 'number' ? this.submissionList.find((sub) => sub.id === i) : null;
  }

  applyFilter(filter: Filter): void {
    this.filter = filter;
    this.api.getAnswers(this.fid, filter.data).subscribe(this.handleAnswers);
  }

  removeFilter(): void {
    this.filter = null;
    this.api.getAnswers(this.fid).subscribe(this.handleAnswers);
  }

  editFilter(filter: Filter): void {
    const dialogRef = this.dialog.open(FiltersComponent, {
      width: '1100px',
      minWidth: '600px',
      maxWidth: '1300px',
      height: '80%',
      data: {
        filter: { ...filter },
        apply: (filter1: Filter) => this.applyFilter(filter1),
      },
      viewContainerRef: this.viewContainerRef,
    });
    dialogRef.afterClosed().subscribe((result: Filter) => {
      if (!result) return;

      this.api
        .saveFilter(this.fid, result.id, result.name, result.data)
        .pipe(switchMap(() => this.api.getFilters(this.fid)))
        .subscribe(this.handleFilters);

      // if editing the selected filter, reapply it.
      if (this.filter?.id === result.id) this.applyFilter(result);
    });
  }

  createFilter(): void {
    const dialogRef = this.dialog.open(FiltersComponent, {
      width: '1100px',
      minWidth: '600px',
      maxWidth: '1300px',
      height: '80%',
      data: {
        filter: { name: '', data: { check: null }, id: null },
        apply: (filter: Filter) => this.applyFilter(filter),
      },
      viewContainerRef: this.viewContainerRef,
    });
    dialogRef.afterClosed().subscribe((result: Filter) => {
      if (result) {
        this.api
          .createFilter(this.fid, result.name, result.data)
          .pipe(switchMap(() => this.api.getFilters(this.fid)))
          .subscribe(this.handleFilters);
      }
    });
  }

  deleteFilter(filter: Filter): void {
    this.api
      .deleteFilter(this.fid, filter.id)
      .pipe(switchMap(() => this.api.getFilters(this.fid)))
      .subscribe(this.handleFilters);

    // if deleting the selected filter, remove it from the results.
    if (this.filter?.id === filter.id) this.removeFilter();
  }

  toggleFilter(filter: Filter): void {
    this.filter?.id === filter.id ? this.removeFilter() : this.applyFilter(filter);
  }

  onExport(type: string): void {
    const questions = this.qs.pqs.get
      .filter((item) => item.conf.type !== QuestionType.TextQ)
      .map((item) => item.conf.description[0] as string);

    const dialogRef = this.dialog.open(ExportOptionsDialogComponent, {
      data: {
        questions,
        shareInfoKeys: ['name', 'email', 'status'],
      },
    });

    dialogRef.afterClosed().subscribe((exportOptions: ExportOptions) => {
      if (exportOptions) {
        let answers: (DBAnswers & { createdAt: Date; id: number })[];
        if (exportOptions.exportOnlyShareCenter) {
          answers = this.submissionList.filter((item) => item.share);
        } else {
          answers = [...this.submissionList];
        }

        const exportData = answers.map((item) => {
          const row = {};
          row['Form Name'] = this.name.name;
          row['Submission Date'] = item.createdAt;

          exportOptions.shareInfos.forEach((shareInfoKey) => {
            row['Shared User ' + shareInfoKey] = item.share ? (item.share[shareInfoKey] as string) : '';
          });

          exportOptions.questions.forEach((qsIndex) => {
            const key = (qsIndex + 1).toString() + '.' + questions[qsIndex];
            row[key] = item.answers[qsIndex].answer;
          });

          return row;
        });

        this.exportToFile(type, exportData);
      }
    });
  }

  exportToFile(type: string, data: Record<string, unknown>[]): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };

    if (type === 'xlsx') {
      const excelBuffer: BlobPart = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' }) as BlobPart;
      const blob: Blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      saveAs(blob, `answers-${this.fid}.xlsx`);
    } else if (type === 'csv') {
      const excelBuffer: BlobPart = XLSX.write(workbook, { bookType: 'csv', type: 'array' }) as BlobPart;
      const blob: Blob = new Blob([excelBuffer]);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      saveAs(blob, `answers-${this.fid}.csv`);
    }
  }

  sortAnswersByDate(array) {
    return array.sort((a, b) => {
      if ((a.date) > (b.date))
        return -1;
      return 1;
    });
  }
}

function answerGrouper(submissions: (DBAnswers & { createdAt: string; id: number })[], length: number): Answer[][] {
  const tidied: Answer[][] = [];
  for (let i = 0; i < length; i++) {
    tidied[i] = [];
  }
  for (const submission of submissions) {
    for (const answer of submission.answers) {
      if (!tidied[answer.question]) {
        tidied[answer.question] = [];
      }
      tidied[answer.question].push({
        answer: answer.answer,
        date: new Date(submission.createdAt),
        id: submission.id,
      });
    }
  }
  return tidied;
}

export interface QuestionAnswerPair {
  question: Q;
  answers: Answer[];
}
