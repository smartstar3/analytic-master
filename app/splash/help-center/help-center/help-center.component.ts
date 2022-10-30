import { Component } from '@angular/core';
import { Card } from './search.pipe';

@Component({
  selector: 'app-help-center',
  templateUrl: './help-center.component.html',
  styleUrls: ['./help-center.component.scss'],
})
export class HelpCenterComponent {
  searchTerm: string;
  cards: Card[];
  constructor() {
    this.cards = [
      {
        title: 'How to create an FA account',
        icon: '/assets/img/help-center/FAaccount.png',
        text: 'Creating an Feedback Analytics account from start to finish',
        path: 'getting-started/create-account',
      },
      {
        title: 'My first form',
        icon: '/assets/img/help-center/myfirstform.png',
        text: 'Creating an example form step for step',
        path: 'getting-started/my-first-form',
      },
      {
        title: 'How to add a profile',
        icon: '/assets/img/help-center/myfirstform.png',
        text: 'For some plans creating multiple accounts is possible',
        path: 'getting-started/add-a-profile',
      },
      {
        title: 'Survey design',
        icon: '/assets/img/help-center/surveydesign.png',
        text: 'Creating custom design templates, what is possible?',
        path: 'survey-design',
      },
      {
        title: 'Question types',
        icon: '/assets/img/help-center/questiontypes.png',
        text: 'There are more than 10 different question types',
        path: 'questions/question-types',
      },
      {
        title: 'Welcome screen',
        icon: '/assets/img/help-center/welcomescreen.png',
        text: 'What is a welcome screen and how to add them',
        path: 'questions/welcome-screen',
      },
      {
        title: 'End screen',
        icon: '/assets/img/help-center/endscreen.png',
        text: 'It is possible to have multiple end screens for different question paths',
        path: 'questions/end-screen',
      },
      {
        title: 'Recall information',
        icon: '/assets/img/help-center/recallinformation.png',
        text: 'Learn how to use already gathered information to make forms more personal',
        path: 'logic/recall-information',
      },
      {
        title: 'Logic jumps',
        icon: '/assets/img/help-center/logicjumps.png',
        text: 'Forms should be small and relevant',
        path: 'logic/logic-jumps',
      },
      {
        title: 'Logic jump example',
        icon: '/assets/img/help-center/logicjumps.png',
        text: 'A few examples on how to use logic jumps',
        path: 'logic/logic-jump-example',
      },
      {
        title: 'Boolean logic',
        icon: '/assets/img/help-center/logicjumps.png',
        text: 'Read this if Logic Jumps is still hard to understand',
        path: 'logic/boolean-logic',
      },
    ];
  }
}
