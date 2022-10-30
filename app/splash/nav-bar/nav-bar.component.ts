import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  appTitle = 'Feedback-Analytics';
  pages: string[] = ['pricing', 'solutions', 'help', 'contact'];
  active: string;

  @Input() drawer;

  constructor(public router: Router) {}
}
