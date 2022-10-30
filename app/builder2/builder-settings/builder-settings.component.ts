import { Component } from '@angular/core';
import { SelectionService } from '../services/selection.service';

@Component({
  selector: 'app-builder-settings',
  templateUrl: './builder-settings.component.html',
  styleUrls: ['./builder-settings.component.scss'],
})
export class BuilderSettingsComponent {
  constructor(public sel: SelectionService) {}
}
