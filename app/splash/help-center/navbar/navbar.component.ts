import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  showGettingStartedMenu = false;
  questionsMenu = false;
  logicMenu = false;

  constructor(public router: Router) {}

  ngOnInit(): void {
    if (this.router.url.indexOf('getting-started') > -1) {
      this.showGettingStartedMenu = true;
    }
    if (this.router.url.indexOf('questions') > -1) {
      this.questionsMenu = true;
    }
    if (this.router.url.indexOf('logic') > -1) {
      this.showGettingStartedMenu = true;
    }
  }
}
