import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RootComponent } from './root/root.component';
import { ListComponent } from './charts/list/list.component';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { WavesModule, ChartsModule } from 'angular-bootstrap-md';
import { MessengerModule } from '../messenger/messenger.module';
import { HttpClientModule } from '@angular/common/http';
import { SubmissionsRoutingModule } from './submissions-routing.module';
import { SubmissionsListComponent } from './submissions-list/submissions-list.component';
import { FormModule } from '../form/form.module';
import { RouterModule } from '@angular/router';
import { ChartComponent } from './chart/chart.component';
import { VisualizationComponent } from './visualization/visualization.component';
import { DateSelectorComponent } from './date-selector/date-selector.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SerializerPipe } from './chart/serialize.pipe';
import { LineChartComponent } from './charts/line-chart/line-chart.component';
import { MultiSerializerPipe } from './chart/multiserialize';
import { StarAverageComponent } from './charts/star-average/star-average.component';
import { NoTextOnlyPipe } from './root/no-text-only.pipe';
import { LogicModule } from '../logic/logic.module';
import { FiltersComponent } from './filters/filters.component';
import { SubmissionComponent } from './submission/submission.component';
import { ChartIconPipe } from './visualization/chart-icon.pipe';
import { ChartOptionAvailablePipe } from './visualization/chart-option-available.pipe';
import { StarAveragePipe } from './charts/star-average/star-average.pipe';
import { LoopPipe } from './charts/star-average/loop.pipe';
import { StarIconPipe } from './charts/star-average/star-icon.pipe';
import { XAxisTickFormattingPipe } from './charts/line-chart/x-axis-tick-formatting.pipe';
import { ExportOptionsDialogComponent } from './root/export-options-dialog/export-options-dialog.component';

@NgModule({
  declarations: [
    RootComponent,
    ListComponent,
    SubmissionsListComponent,
    ChartComponent,
    VisualizationComponent,
    ChartIconPipe,
    DateSelectorComponent,
    SerializerPipe,
    MultiSerializerPipe,
    LineChartComponent,
    StarAverageComponent,
    StarAveragePipe,
    LoopPipe,
    StarIconPipe,
    NoTextOnlyPipe,
    FiltersComponent,
    SubmissionComponent,
    ChartOptionAvailablePipe,
    XAxisTickFormattingPipe,
    ExportOptionsDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SubmissionsRoutingModule,
    RouterModule,
    WavesModule,
    ChartsModule,
    MaterialModule,
    MessengerModule,
    HttpClientModule,
    FormModule,
    NgxChartsModule,
    LogicModule,
  ],
})
export class SubmissionsModule {}
