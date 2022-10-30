import { NgModule } from '@angular/core';
import { AddressQuestionComponent } from './address-question/address-question.component';
import { CommonModule } from '@angular/common';
import { EmailComponent } from './email/email.component';
import { MultipleChoiceComponent } from './multiple-choice/multiple-choice.component';
import { NumberComponent } from './number/number.component';
import { PhoneNumberComponent } from './phone-number/phone-number.component';
import { FilledPipe, LoopPipe, StarRatingComponent } from './star-rating/star-rating.component';
import { TextComponent } from './text/text.component';
import { YesNoComponent } from './yes-no/yes-no.component';
import { OpenQuestionComponent } from './open-question/open-question.component';
import { MaterialModule } from './material.module';
import { QuestionComponent, StringifyDescriptionPipe } from './question/question.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UndefinedPipe } from './undefined.pipe';
import { StartScreenComponent } from './start-screen/start-screen.component';
import { EndScreenComponent } from './end-screen/end-screen.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { SliderComponent } from './slider/slider.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NgxSliderModule } from '@m0t0r/ngx-slider';
import { MatSelectModule } from '@angular/material/select';
import { ScalableImageComponent } from './scalable-image/scalable-image.component';

@NgModule({
  declarations: [
    AddressQuestionComponent,
    EmailComponent,
    MultipleChoiceComponent,
    NumberComponent,
    PhoneNumberComponent,
    StarRatingComponent,
    TextComponent,
    YesNoComponent,
    QuestionComponent,
    OpenQuestionComponent,
    FilledPipe,
    LoopPipe,
    UndefinedPipe,
    StartScreenComponent,
    EndScreenComponent,
    SliderComponent,
    StringifyDescriptionPipe,
    ScalableImageComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatExpansionModule,
    NgxSliderModule,
    MatButtonToggleModule,
    MatSelectModule,
  ],
  exports: [
    QuestionComponent,
    StartScreenComponent,
    EndScreenComponent,
    CommonModule,
    FormsModule,
    StringifyDescriptionPipe,
    YesNoComponent,
    TextComponent,
    ScalableImageComponent,
  ],
  providers: [],
})
export class FormModule {}
