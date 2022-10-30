import { Component, Input } from '@angular/core';
import { Answer } from 'src/app/api/api.service';
import { SidService } from '../../sid.service';
import { TabService } from '../../tab.service';

@Component({
  selector: 'app-list-chart',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent {
  @Input() answers: Answer[];
  readonly displayedColumns: string[] = ['Answers'];
  readonly displayedColumnsAddress: string[] = ['Cities', 'Streets', 'House Numbers', 'Postal Codes'];

  constructor(public sid: SidService, private tabs: TabService) {}

  isTypeAddress(): boolean {
    // Can't check whether instanceOf interface. So instead this workaround
    // Understandable. Still, this is wack, so refactor in the future
    return (
      this.answers.length > 0 &&
      this.answers.values().next().value.hasOwnProperty('answer') &&
      this.answers.values().next().value.answer.hasOwnProperty('city')
    );
  }

  select(sid: number): void {
    this.sid.value = sid;
    this.tabs.value = this.tabs.LIST;
  }
}
