import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpCenterComponent } from './help-center/help-center.component';
import { MaterialModule } from '../material.module';
import { SplashModule } from '../splash.module';
import { NavbarComponent } from './navbar/navbar.component';
import { SurveyDesignComponent } from './survey-design/survey-design.component';
import { HelpCenterRouterModule } from './help-center-router.module';
import { MyFirstFormComponent } from './my-first-form/my-first-form.component';
import { HowToCreateAAccountComponent } from './how-to-create-a-account/how-to-create-a-account.component';
import { RootComponent } from './root/root.component';
import { GettingStartedComponent } from './getting-started/getting-started.component';
import { QuestionTypesComponent } from './question-types/question-types.component';
import { QuestionsComponent } from './questions/questions.component';
import { WelcomescreenComponent } from './welcomescreen/welcomescreen.component';
import { EndscreenComponent } from './endscreen/endscreen.component';
import { LogicComponent } from './logic/logic.component';
import { RecalInformationComponent } from './recal-information/recal-information.component';
import { LogicJumpsComponent } from './logic-jumps/logic-jumps.component';
import { BooleanComponent } from './boolean/boolean.component';
import { LogicExampleComponent } from './logic-example/logic-example.component';
import { AddProfileComponent } from './add-profile/add-profile.component';
import { ExtendedModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HelpCenterComponent,
    NavbarComponent,
    SurveyDesignComponent,
    MyFirstFormComponent,
    HowToCreateAAccountComponent,
    RootComponent,
    GettingStartedComponent,
    QuestionTypesComponent,
    QuestionsComponent,
    WelcomescreenComponent,
    EndscreenComponent,
    LogicComponent,
    RecalInformationComponent,
    LogicJumpsComponent,
    BooleanComponent,
    LogicExampleComponent,
    AddProfileComponent,
  ],
  imports: [CommonModule, MaterialModule, HelpCenterRouterModule, SplashModule, ExtendedModule, FormsModule],
})
export class HelpCenterModule {}
