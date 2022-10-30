import { Component } from '@angular/core';
import { SaveService } from '../services/save.service';
import { InitService } from '../../form/services/init.service';
import { QuestionService } from '../../form/services/question.service';
import { PublishedQuestionService } from '../../form/services/published-question.service';
import { PublishedEndService } from '../../form/services/published-end.service';
import { PublishedStartService } from '../../form/services/published-start.service';
import { EndService } from '../../form/services/end.service';
import { StartService } from '../../form/services/start.service';

@Component({
  selector: 'app-builder-test',
  templateUrl: './builder-test.component.html',
  styleUrls: ['./builder-test.component.scss'],
  providers: [
    { provide: InitService, useValue: new InitService() },
    PublishedEndService,
    PublishedQuestionService,
    PublishedStartService,
    StartService,
    QuestionService,
    EndService,
  ],
})
export class BuilderTestComponent {
  constructor(private save: SaveService, private is: InitService) {
    this.is.init.next(save.publish());
  }
}
