import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HomeComponent } from './home/home.component';

import { ContactComponent } from './contact/contact.component';
import { routes } from './splash-routing.module';

describe('Router: App', () => {
  beforeEach(() => {
    void TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
      declarations: [HomeComponent, ContactComponent],
    }).compileComponents();
  });
});
