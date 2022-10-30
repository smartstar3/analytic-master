import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent {
  @Input() drawer;

  pages: string[] = ['solutions', 'pricing', 'help-center', 'contact', 'login', 'register'];
  icons = {
    solutions: 'insert_chart_outlined',
    'help-center': 'support',
    pricing: 'attach_money',
    contact: 'contact_support',
    login: 'input',
    register: 'how_to_reg',
  };

  constructor(public router: Router) {}
}
