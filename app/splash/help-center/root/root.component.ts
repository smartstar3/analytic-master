import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MediaObserver } from '@angular/flex-layout';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
})
export class RootComponent {
  titles = {
    '/help-center': 'Help Center',
    '/help-center/getting-started': 'Getting Started',
    '/help-center/getting-started/create-account': 'How to create an FA account',
    '/help-center/getting-started/my-first-form': 'My first form',
    '/help-center/getting-started/add-a-profile': 'Add a profile',
    '/help-center/survey-design': 'Survey design',
    '/help-center/questions': 'Questions',
    '/help-center/questions/question-types': 'Question types',
    '/help-center/questions/welcome-screen': 'Welcome screen',
    '/help-center/questions/end-screen': 'End screen',
    '/help-center/logic': 'Logic',
    '/help-center/logic/recall-information': 'Recall Information',
    '/help-center/logic/logic-jumps': 'Logic Jumps',
    '/help-center/logic/boolean-logic': 'Boolean Logic',
    '/help-center/logic/logic-jump-example': 'Logic Jump Example',
  };

  constructor(public router: Router, public mo: MediaObserver) {}

  mode(): 'over' | 'push' | 'side' {
    if (!this.mo.isActive('sm') && !this.mo.isActive('xs')) {
      return 'side';
    }
    return 'over';
  }

  toTop(): void {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }
}
