import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyFirstFormComponent } from './my-first-form/my-first-form.component';
import { SurveyDesignComponent } from './survey-design/survey-design.component';
import { HowToCreateAAccountComponent } from './how-to-create-a-account/how-to-create-a-account.component';
import { RootComponent } from './root/root.component';
import { QuestionTypesComponent } from './question-types/question-types.component';
import { WelcomescreenComponent } from './welcomescreen/welcomescreen.component';
import { EndscreenComponent } from './endscreen/endscreen.component';
import { RecalInformationComponent } from './recal-information/recal-information.component';
import { LogicJumpsComponent } from './logic-jumps/logic-jumps.component';
import { BooleanComponent } from './boolean/boolean.component';
import { LogicExampleComponent } from './logic-example/logic-example.component';
import { AddProfileComponent } from './add-profile/add-profile.component';

export const routes: Routes = [
  {
    path: '',
    component: RootComponent,
    children: [
      { path: 'getting-started', redirectTo: 'getting-started/create-account', pathMatch: 'full' },
      { path: 'getting-started/create-account', component: HowToCreateAAccountComponent },
      { path: 'getting-started/my-first-form', component: MyFirstFormComponent },
      { path: 'getting-started/add-a-profile', component: AddProfileComponent },
      { path: 'survey-design', component: SurveyDesignComponent },
      { path: 'questions', redirectTo: 'questions/question-types', pathMatch: 'full' },
      { path: 'questions/question-types', component: QuestionTypesComponent },
      { path: 'questions/welcome-screen', component: WelcomescreenComponent },
      { path: 'questions/end-screen', component: EndscreenComponent },
      { path: 'logic', redirectTo: 'logic/recall-information', pathMatch: 'full' },
      { path: 'logic/recall-information', component: RecalInformationComponent },
      { path: 'logic/logic-jumps', component: LogicJumpsComponent },
      { path: 'logic/boolean-logic', component: BooleanComponent },
      { path: 'logic/logic-jump-example', component: LogicExampleComponent },
      { path: '', redirectTo: '/help', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpCenterRouterModule {}
