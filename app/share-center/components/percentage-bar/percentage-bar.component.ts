import { Component, Input } from '@angular/core';
import { colorSets } from '@swimlane/ngx-charts';
import { SharePercentageStatistic } from '../../../resources/interfaces/share-info.interface';

@Component({
  selector: 'app-percentage-bar',
  templateUrl: './percentage-bar.component.html',
  styleUrls: ['./percentage-bar.component.scss'],
})
export class PercentageBarComponent {
  @Input() data: SharePercentageStatistic[];
  colorScheme = colorSets[0];
}
