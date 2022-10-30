import { NgModule } from '@angular/core';
import { RootComponent } from './root/root.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BuilderListComponent } from './builder-list/builder-list.component';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { QuestionIconComponent } from './question-icon/question-icon.component';
import { QuestionSettingsComponent } from './builder-settings/question-settings/question-settings.component';
import { StartSettingsComponent } from './builder-settings/start-settings/start-settings.component';
import { EndSettingsComponent } from './builder-settings/end-settings/end-settings.component';
import { BuilderSettingsComponent } from './builder-settings/builder-settings.component';
import { MatIconModule } from '@angular/material/icon';
import { BuilderRoutingModule } from './builder-routing.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToggleTextPipe } from './builder-list/toggle-text.pipe';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LogicComponent } from './builder-settings/question-settings/logic/logic.component';
import { ChoicesComponent } from './builder-settings/question-settings/general/choices/choices.component';
import { DescriptionComponent } from './builder-settings/question-settings/general/description/description.component';
import { DescriptionInputComponent } from './builder-settings/question-settings/general/description/description-input/description-input.component';
import {
  DescriptionInputPartComponent,
  IsChipPartPipe,
} from './builder-settings/question-settings/general/description/description-input-part/description-input-part.component';
import { StarAmountComponent } from './builder-settings/question-settings/general/star-amount/star-amount.component';
import { MinMaxComponent } from './builder-settings/question-settings/general/min-max/min-max.component';
import { PlaceholderComponent } from './builder-settings/question-settings/general/placeholder/placeholder.component';
import { RatingComponent } from './builder-settings/question-settings/general/rating/rating.component';
import { GeneralComponent } from './builder-settings/question-settings/general/general.component';
import { TextComponent } from './builder-settings/question-settings/general/text/text.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { LogicModule } from '../logic/logic.module';
import { TextOnlyFilterPipe } from './builder-settings/question-settings/logic/text-only-filter.pipe';
import { FormModule } from '../form/form.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormPreviewComponent } from './form-preview/form-preview.component';
import { MatCardModule } from '@angular/material/card';
import { EditableQuestionPipe } from './form-preview/editable-question.pipe';
import { TypeComponent } from './builder-settings/question-settings/general/type/type.component';
import { MatSelectModule } from '@angular/material/select';
import { TypeStringPipe } from './builder-settings/question-settings/general/type/type-string.pipe';
import { AllowedSettingPipe } from './builder-settings/question-settings/general/allowed-setting.pipe';
import { AnsweringModule } from '../answering2/answering.module';
import { BuilderTestComponent } from './builder-test/builder-test.component';
import { StartScreenComponent } from './image-stuff/start-screen/start-screen.component';
import { EndScreenComponent } from './image-stuff/end-screen/end-screen.component';
import { ImageManagerComponent } from './image-stuff/image-manager/image-manager.component';
import { FileUploadComponent } from './image-stuff/file-upload/file-upload.component';
import { QuestionChoiceComponent } from './builder-settings/question-settings/general/choices/question-choice/question-choice.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { SharedModule } from '../shared/shared.module';
import { ImageSettingsComponent } from './builder-settings/image-settings/image-settings.component';
import { ImageManageDialogComponent } from './builder-settings/image-settings/image-manage-dialog/image-manage-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { UploadImageComponent } from './builder-settings/image-settings/image-manage-dialog/upload-image/upload-image.component';
import { ImageListComponent } from './builder-settings/image-settings/image-manage-dialog/image-list/image-list.component';
import { ImageSelectorComponent } from './builder-settings/image-settings/image-manage-dialog/image-list/image-selector/image-selector.component';

@NgModule({
  declarations: [
    RootComponent,
    BuilderListComponent,
    QuestionIconComponent,
    QuestionSettingsComponent,
    StartSettingsComponent,
    EndSettingsComponent,
    BuilderSettingsComponent,
    ToggleTextPipe,

    LogicComponent,
    ChoicesComponent,
    DescriptionComponent,
    DescriptionInputComponent,
    DescriptionInputPartComponent,
    IsChipPartPipe,
    StarAmountComponent,
    MinMaxComponent,
    PlaceholderComponent,
    RatingComponent,
    TextComponent,
    GeneralComponent,
    TextOnlyFilterPipe,
    FormPreviewComponent,
    EditableQuestionPipe,
    TypeComponent,
    TypeStringPipe,
    AllowedSettingPipe,
    BuilderTestComponent,
    StartScreenComponent,
    EndScreenComponent,
    ImageManagerComponent,
    FileUploadComponent,
    QuestionChoiceComponent,
    ImageSettingsComponent,
    ImageManageDialogComponent,
    UploadImageComponent,
    ImageListComponent,
    ImageSelectorComponent,
  ],
  imports: [
    BuilderRoutingModule,
    MatSidenavModule,
    MatListModule,
    CommonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTooltipModule,
    DragDropModule,
    MatButtonModule,
    FormsModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatInputModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatChipsModule,
    LogicModule,
    FormModule,
    MatToolbarModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatCardModule,
    MatSelectModule,
    AnsweringModule,
    ColorPickerModule,
    SharedModule,
    MatDialogModule,
  ],
})
export class BuilderModule {}
