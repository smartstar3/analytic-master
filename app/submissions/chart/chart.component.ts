import { Component, Input } from '@angular/core';
import { colorSets } from '@swimlane/ngx-charts';
import { Q } from 'src/app/question';
import { Answer } from '../../api/api.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent {
  @Input() type: ChartType;
  @Input() data: Answer[];
  @Input() question: Q;
  colorScheme = colorSets[0];
  starColorScheme = { domain: ['#ffc107'] };

  readonly charts = ChartType;

  starAxisTickFormatting(label: unknown): string {
    return `${label.toString()}   `;
  }
}

export enum ChartType {
  Pie,
  Star,
  VBar,
  List,
  Line,
}
