import { Component, Input } from '@angular/core';
import { Answer } from 'src/app/api/api.service';
import { colorSets } from '@swimlane/ngx-charts';
import { Q } from 'src/app/question';
import { TimeSpan, ViewType } from '../../chart/multiserialize';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent {
  timespan: TimeSpan = 'months';
  dataform: ViewType = 'percentage';
  cumulative = false;
  @Input() answers: Answer[];
  @Input() question: Q;
  colorScheme = colorSets[0];
}
