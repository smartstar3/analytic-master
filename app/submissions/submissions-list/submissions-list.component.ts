import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DBAnswers } from 'src/app/question';
import { Sort } from '@angular/material/sort';
import { SidService } from '../sid.service';

@Component({
  selector: 'app-submissions-list',
  templateUrl: './submissions-list.component.html',
  styleUrls: ['./submissions-list.component.scss'],
})
export class SubmissionsListComponent implements OnChanges {
  @Input() submissionList: (DBAnswers & { createdAt: Date; id: number })[];
  sorted: (DBAnswers & { createdAt: Date; id: number })[];
  sort: Sort = { active: undefined, direction: undefined };

  constructor(private sid: SidService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.submissionList) {
      this.sortData(this.sort);
    }
  }

  sortData(sort: Sort): void {
    this.sort = sort;
    const data = this.submissionList.slice();
    if (!sort.active || !sort.direction) {
      this.sorted = data;
      return;
    }

    this.sorted = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'createdAt':
          return compare(a.createdAt, b.createdAt, isAsc);
        default:
          return 0;
      }
    });
  }

  select(id: number): void {
    this.sid.value = this.sid.value === id ? null : id;
  }

  selectedRow(id: number): boolean {
    return id === this.sid.value;
  }
}

function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
